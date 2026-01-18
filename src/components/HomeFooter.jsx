import './HomeFooter.css'


function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-content">
        <div className="home-footer-grid">
          <div className="home-footer-section">
            <h3>DreamWorld</h3>
            <p>A Beautiful Dream</p>
            <p><em>Where nature, technology, and wonder unite</em></p>
          </div>

          <div className="home-footer-section">
            <h3>Connect</h3>
            <div className="contact-info">
              <p>✉️ contact@dreamworld.com</p>
              <p>📞 +91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="home-footer-bottom">
          <p>&copy; 2026 DreamWorld. Built with ❤️ by <a href="/creator">Justice</a></p>
        </div>
      </div>
    </footer>
  )
}


export default HomeFooter
