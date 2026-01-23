import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Button from '../components/Button'
import './Events.css'


function Events() {
  const { events, loading } = useContent()
  const [selectedEvent, setSelectedEvent] = useState(null)

  if (loading) return <div className="loading-state">Syncing Events with DreamWorld...</div>

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRegister = (event) => {
    window.location.href = event.registrationLink
  }

  return (
    <div className="events page">
      <div className="container">
        {/* Logo at top */}
        <div className="page-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
        </div>

        <SectionHeader
          title="Upcoming Events"
          subtitle="Join live sessions, workshops, and community gatherings"
        />

        <div className="events-list">
          {events.map((event) => (
            <Card key={event.id} className="event-card">
              <div className="event-header">
                <div>
                  <h3>{event.title}</h3>
                  <p className="event-host">Hosted by {event.host}</p>
                </div>
                <Badge variant={event.type === 'online' ? 'default' : 'medium'}>
                  {event.type}
                </Badge>
              </div>

              <div className="event-meta">
                <div className="event-meta-item">
                  <span className="meta-icon">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="event-meta-item">
                  <span className="meta-icon">📍</span>
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-actions">
                <Button variant="primary" onClick={() => handleRegister(event)}>
                  Register Now
                </Button>
                <Button variant="ghost" onClick={() => setSelectedEvent(event)}>
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={selectedEvent !== null}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent?.title}
        >
          {selectedEvent && (
            <div className="event-modal-content">
              <div className="event-modal-meta">
                <Badge variant={selectedEvent.type === 'online' ? 'default' : 'medium'}>
                  {selectedEvent.type}
                </Badge>
                <p className="modal-host">Hosted by {selectedEvent.host}</p>
              </div>

              <div className="event-detail-section">
                <h4>When</h4>
                <p>{formatDate(selectedEvent.date)}</p>
              </div>

              <div className="event-detail-section">
                <h4>Where</h4>
                <p>{selectedEvent.location}</p>
              </div>

              <div className="event-detail-section">
                <h4>About This Event</h4>
                <p>{selectedEvent.description}</p>
              </div>

              <div className="modal-register">
                <Button variant="primary" onClick={() => handleRegister(selectedEvent)}>
                  Register for This Event
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}


export default Events
