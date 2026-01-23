import { useState, useEffect } from 'react'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import './Members.css'

function Members() {
  const [members, setMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState([])

  useEffect(() => {
    // Load members from localStorage
    const storedMembers = JSON.parse(localStorage.getItem('dreamworld_members') || '[]')
    setMembers(storedMembers)
    setFilteredMembers(storedMembers)
  }, [])

  useEffect(() => {
    // Filter members based on search term
    if (searchTerm.trim() === '') {
      setFilteredMembers(members)
    } else {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.age.toString().includes(searchTerm)
      )
      setFilteredMembers(filtered)
    }
  }, [searchTerm, members])

  return (
    <div className="members page">
      <div className="container">
        <SectionHeader 
          title="DreamWorld Members"
          subtitle="Our growing community of learners, creators, and dreamers"
        />

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search members by name or age..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="search-result-count">
            Showing {filteredMembers.length} of {members.length} members
          </p>
        </div>

        {/* Members Table */}
        {filteredMembers.length > 0 ? (
          <Card className="members-table-card">
            <div className="table-wrapper">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, index) => (
                    <tr key={member.memberID}>
                      <td>{index + 1}</td>
                      <td className="member-name">{member.name}</td>
                      <td>{member.age}</td>
                      <td>{new Date(member.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No members found</h3>
            <p>
              {searchTerm ? 
                `No members match "${searchTerm}". Try a different search.` : 
                'No members have joined yet. Be the first!'
              }
            </p>
          </Card>
        )}

        {/* Info Section */}
        <div className="members-info">
          <Card className="info-card">
            <h3>👤 About Members</h3>
            <p>
              Members are the foundation of DreamWorld. They join our community to learn, 
              grow, and participate in quests together.
            </p>
          </Card>

          <Card className="info-card">
            <h3>⭐ Become a Dreamer</h3>
            <p>
              Members can become Dreamers by choosing a role and creating content for 
              DreamWorld. Visit the Join page to upgrade your membership!
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Members
