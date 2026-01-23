import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import './Quests.css'


function Quests() {
  const { quests, loading } = useContent()
  const [selectedQuest, setSelectedQuest] = useState(null)

  if (loading) return <div className="loading-state">Syncing Quests with DreamWorld...</div>

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      easy: 'easy',
      medium: 'medium',
      hard: 'hard'
    }
    return variants[difficulty] || 'default'
  }

  return (
    <div className="quests page">
      <div className="container">
        {/* Logo at top */}
        <div className="page-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
        </div>

        <SectionHeader
          title="Weekly Quests"
          subtitle="Small actions, big impact. Choose a quest and start building better habits today."
        />

        <div className="quests-grid">
          {quests.map((quest) => (
            <Card key={quest.id}>
              <div className="quest-header">
                <h3>{quest.title}</h3>
                <Badge variant={getDifficultyVariant(quest.difficulty)}>
                  {quest.difficulty}
                </Badge>
              </div>
              <p className="quest-purpose">{quest.purpose}</p>
              <div className="quest-meta">
                <span className="quest-time">⏱️ {quest.timeNeeded}</span>
              </div>
              <button
                className="quest-details-btn"
                onClick={() => setSelectedQuest(quest)}
              >
                View Quest Details
              </button>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={selectedQuest !== null}
          onClose={() => setSelectedQuest(null)}
          title={selectedQuest?.title}
        >
          {selectedQuest && (
            <div className="quest-modal-content">
              <div className="quest-modal-header">
                <Badge variant={getDifficultyVariant(selectedQuest.difficulty)}>
                  {selectedQuest.difficulty}
                </Badge>
                <span className="quest-time">⏱️ {selectedQuest.timeNeeded}</span>
              </div>

              <div className="quest-section">
                <h4>Purpose</h4>
                <p>{selectedQuest.purpose}</p>
              </div>

              <div className="quest-section">
                <h4>Steps to Complete</h4>
                <ol className="quest-steps">
                  {selectedQuest.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="quest-section">
                <h4>Impact</h4>
                <p>{selectedQuest.impact}</p>
              </div>

              <div className="quest-share">
                <h4>Share Your Journey</h4>
                <p>{selectedQuest.sharePrompt}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}


export default Quests
