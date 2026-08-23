import { useEffect, useRef, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import './Games.css'

const MEMORY_RUNES = [
  { symbol: '✦', name: 'Star', color: '#f4b942' },
  { symbol: '◇', name: 'Crystal', color: '#d46aae' },
  { symbol: '☾', name: 'Moon', color: '#7e71e9' },
  { symbol: '✧', name: 'Spark', color: '#48b8a8' }
]

const makeQuestion = (streak = 0) => {
  const level = Math.min(Math.floor(streak / 3), 2)
  const left = Math.floor(Math.random() * (level === 2 ? 16 : 10)) + 3
  const right = Math.floor(Math.random() * (level === 0 ? 8 : 12)) + 2

  if (level === 0) return { text: `${left} + ${right}`, answer: left + right }
  if (level === 1) return { text: `${left} × ${right}`, answer: left * right }

  const total = left * right + Math.floor(Math.random() * 15) + 4
  return { text: `${left} × ${right} + ${total - left * right}`, answer: total }
}

function Games() {
  const [activeGame, setActiveGame] = useState('memory')
  const [sequence, setSequence] = useState([])
  const [playerSteps, setPlayerSteps] = useState([])
  const [showingSequence, setShowingSequence] = useState(false)
  const [litTile, setLitTile] = useState(null)
  const [memoryStatus, setMemoryStatus] = useState('Press Begin to reveal a sequence.')
  const [memoryBest, setMemoryBest] = useState(0)
  const memoryTimers = useRef([])

  const [focusActive, setFocusActive] = useState(false)
  const [focusScore, setFocusScore] = useState(0)
  const [focusTime, setFocusTime] = useState(20)
  const [focusBest, setFocusBest] = useState(0)
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 })

  const [question, setQuestion] = useState(makeQuestion)
  const [answer, setAnswer] = useState('')
  const [concentrationScore, setConcentrationScore] = useState(0)
  const [concentrationStatus, setConcentrationStatus] = useState('Solve each calculation without rushing.')

  useEffect(() => () => memoryTimers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (!focusActive || focusTime <= 0) return undefined

    const timer = setInterval(() => setFocusTime(time => time - 1), 1000)
    return () => clearInterval(timer)
  }, [focusActive, focusTime])

  useEffect(() => {
    if (focusTime === 0) setFocusActive(false)
  }, [focusTime])

  useEffect(() => {
    if (!focusActive) return undefined

    const mover = setInterval(() => {
      setTargetPosition({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 })
    }, 850)
    return () => clearInterval(mover)
  }, [focusActive])

  useEffect(() => {
    if (focusTime === 0) setFocusBest(best => Math.max(best, focusScore))
  }, [focusScore, focusTime])

  const showMemorySequence = (nextSequence) => {
    memoryTimers.current.forEach(clearTimeout)
    memoryTimers.current = []
    setShowingSequence(true)
    setLitTile(null)
    setMemoryStatus(`Watch carefully — round ${nextSequence.length}.`)

    nextSequence.forEach((tile, index) => {
      memoryTimers.current.push(setTimeout(() => setLitTile(tile), index * 700 + 350))
      memoryTimers.current.push(setTimeout(() => setLitTile(null), index * 700 + 800))
    })
    memoryTimers.current.push(setTimeout(() => {
      setShowingSequence(false)
      setMemoryStatus('Your turn: repeat the sequence.')
    }, nextSequence.length * 700 + 350))
  }

  const startMemory = () => {
    const firstSequence = [Math.floor(Math.random() * MEMORY_RUNES.length)]
    setSequence(firstSequence)
    setPlayerSteps([])
    showMemorySequence(firstSequence)
  }

  const chooseMemoryTile = (tile) => {
    if (showingSequence || sequence.length === 0) return
    const nextSteps = [...playerSteps, tile]
    const stepIndex = nextSteps.length - 1

    if (sequence[stepIndex] !== tile) {
      setMemoryStatus(`Not quite. You reached round ${sequence.length}. Try again!`)
      setPlayerSteps([])
      return
    }

    if (nextSteps.length === sequence.length) {
      setMemoryBest(best => Math.max(best, sequence.length))
      const nextSequence = [...sequence, Math.floor(Math.random() * MEMORY_RUNES.length)]
      setPlayerSteps([])
      setSequence(nextSequence)
      showMemorySequence(nextSequence)
      return
    }
    setPlayerSteps(nextSteps)
  }

  const startFocus = () => {
    setFocusScore(0)
    setFocusTime(20)
    setTargetPosition({ x: 50, y: 50 })
    setFocusActive(true)
  }

  const catchTarget = () => {
    if (!focusActive) return
    setFocusScore(score => score + 1)
    setTargetPosition({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 })
  }

  const submitAnswer = (event) => {
    event.preventDefault()
    if (Number(answer) === question.answer) {
      const nextScore = concentrationScore + 1
      setConcentrationScore(nextScore)
      setConcentrationStatus('Correct. Keep the rhythm going.')
      setQuestion(makeQuestion(nextScore))
    } else {
      setConcentrationScore(0)
      setConcentrationStatus(`The answer was ${question.answer}. Start a new streak.`)
      setQuestion(makeQuestion())
    }
    setAnswer('')
  }

  return (
    <div className="games page">
      <div className="container">
        <div className="page-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
        </div>
        <SectionHeader title="Mind Games" subtitle="Short, playful exercises for memory, focus, and concentration. No account is needed; scores reset when you leave." />

        <div className="mind-intro" aria-label="Mind games overview">
          <span>Memory</span><i>•</i><span>Focus</span><i>•</i><span>Concentration</span>
          <p>No account, timer pressure, or data collection — just a short daily mental reset.</p>
        </div>

        <div className="game-tabs" role="tablist" aria-label="Mind games">
          <button className={activeGame === 'memory' ? 'active' : ''} onClick={() => setActiveGame('memory')} role="tab" aria-selected={activeGame === 'memory'}>Memory Path</button>
          <button className={activeGame === 'focus' ? 'active' : ''} onClick={() => setActiveGame('focus')} role="tab" aria-selected={activeGame === 'focus'}>Focus Hunt</button>
          <button className={activeGame === 'concentration' ? 'active' : ''} onClick={() => setActiveGame('concentration')} role="tab" aria-selected={activeGame === 'concentration'}>Number Flow</button>
        </div>

        {activeGame === 'memory' && (
          <section className="game-panel" aria-labelledby="memory-title">
            <div className="game-copy">
              <span className="game-kicker">Memory</span>
              <h2 id="memory-title">Memory Path</h2>
              <p>Watch the glowing runes, then repeat their order. Each round adds one more step.</p>
              <div className="game-stats"><span>Round: {sequence.length || 0}</span><span>Best: {memoryBest}</span></div>
              <p className="game-status" aria-live="polite">{memoryStatus}</p>
              <button className="game-action" onClick={startMemory}>Begin a new path</button>
            </div>
            <div className="memory-board" aria-label="Memory sequence board">
              <div className={`memory-oracle ${litTile !== null ? 'revealing' : ''}`} style={{ '--rune-color': litTile !== null ? MEMORY_RUNES[litTile].color : 'var(--color-primary)' }} aria-live="polite">
                <span className="oracle-label">{showingSequence ? 'The oracle reveals' : 'Choose the next rune'}</span>
                <strong>{litTile !== null ? MEMORY_RUNES[litTile].symbol : '?'}</strong>
              </div>
              <div className="rune-choices">
                {MEMORY_RUNES.map((rune, index) => (
                  <button key={rune.name} className="rune-choice" style={{ '--rune-color': rune.color }} onClick={() => chooseMemoryTile(index)} disabled={showingSequence || sequence.length === 0} aria-label={`Choose ${rune.name}`}>
                    <span>{rune.symbol}</span><small>{rune.name}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeGame === 'focus' && (
          <section className="game-panel" aria-labelledby="focus-title">
            <div className="game-copy">
              <span className="game-kicker">Focus</span>
              <h2 id="focus-title">Focus Hunt</h2>
              <p>Catch the wandering star before it moves again. You have twenty seconds.</p>
              <div className="game-stats"><span>Time: {focusTime}s</span><span>Stars: {focusScore}</span><span>Best: {focusBest}</span></div>
              <button className="game-action" onClick={startFocus}>{focusActive ? 'Restart round' : 'Start 20-second round'}</button>
            </div>
            <div className="focus-board" aria-label="Focus target area">
              {focusActive && <button className="focus-target" onClick={catchTarget} style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%` }} aria-label="Catch the star">✦</button>}
              {!focusActive && <p>{focusTime === 0 ? `Round complete: ${focusScore} stars caught. Can you beat your best?` : 'Start a round to summon the star.'}</p>}
            </div>
          </section>
        )}

        {activeGame === 'concentration' && (
          <section className="game-panel" aria-labelledby="concentration-title">
            <div className="game-copy">
              <span className="game-kicker">Concentration</span>
              <h2 id="concentration-title">Number Flow</h2>
              <p>Keep your attention on one task at a time. The patterns become more challenging as your streak grows.</p>
              <div className="game-stats"><span>Current streak: {concentrationScore}</span></div>
              <p className="game-status" aria-live="polite">{concentrationStatus}</p>
            </div>
            <form className="number-flow" onSubmit={submitAnswer}>
              <span className="number-question">{question.text}</span>
              <label htmlFor="number-answer">Your answer</label>
              <input id="number-answer" type="number" inputMode="numeric" value={answer} onChange={event => setAnswer(event.target.value)} autoComplete="off" required />
              <button className="game-action" type="submit">Check answer</button>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default Games
