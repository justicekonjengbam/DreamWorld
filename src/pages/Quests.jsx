import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Button from '../components/Button'
import './Quests.css'


function Quests() {
  const { quests, loading } = useContent()
  const navigate = useNavigate()
  const [selectedQuest, setSelectedQuest] = useState(null)

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all') // all, easy, medium, hard

  if (loading) return <div className="loading-state">Syncing Quests with DreamWorld...</div>

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      easy: 'easy',
      medium: 'medium',
      hard: 'hard'
    }
    return variants[difficulty] || 'default'
  }

  // Filter Logic
  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === 'all' || quest.difficulty.toLowerCase() === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

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

        {/* Search & Filter Bar */}
        <div className="quests-filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search quests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="quest-search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterDifficulty === 'all' ? 'active' : ''}`}
              onClick={() => setFilterDifficulty('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterDifficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setFilterDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`filter-btn ${filterDifficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setFilterDifficulty('medium')}
            >
              Medium
            </button>
            <button
              className={`filter-btn ${filterDifficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setFilterDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="quests-grid">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <Card key={quest.id}>
                <div className="quest-header">
                  <h3>{quest.title}</h3>
                  <Badge variant={getDifficultyVariant(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                </div>
                <p className="quest-purpose">{quest.purpose}</p>

                {parseFloat(quest.amountNeeded) > 0 && (
                  <div className="quest-funding-progress">
                    <div className="funding-stats">
                      <span>₹{quest.amountRaised || 0} raised</span>
                      <span>Goal: ₹{quest.amountNeeded}</span>
                    </div>
                    <div className="funding-bar">
                      <div
                        className="funding-fill"
                        style={{ width: `${Math.min((parseFloat(quest.amountRaised || 0) / parseFloat(quest.amountNeeded)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

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
            ))
          ) : (
            <div className="no-results">
              <h3>No quests found</h3>
              <p>Try adjusting your search or filters to find new adventures.</p>
              <button className="reset-btn" onClick={() => { setSearchTerm(''); setFilterDifficulty('all') }}>Clear Filters</button>
            </div>
          )}
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

              {parseFloat(selectedQuest.amountNeeded) > 0 && (
                <div className="quest-modal-funding">
                  <div className="funding-progress-large">
                    <div className="stats">
                      <strong>₹{selectedQuest.amountRaised || 0}</strong> raised of <strong>₹{selectedQuest.amountNeeded}</strong> goal
                    </div>
                    <div className="bar-large">
                      <div
                        className="fill-large"
                        style={{ width: `${Math.min((parseFloat(selectedQuest.amountRaised || 0) / parseFloat(selectedQuest.amountNeeded)) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="funding-status-text">
                      {selectedQuest.fundingStatus === 'completed' ? '🎉 This quest is fully funded!' : 'This quest needs your support to launch!'}
                    </p>
                    {selectedQuest.fundingStatus !== 'completed' && (
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/funders?type=quest&id=${selectedQuest.id}`)}
                      >
                        💖 Support This Goal
                      </Button>
                    )}
                  </div>
                </div>
              )}

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
