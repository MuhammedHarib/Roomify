import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="big-heading">Build Beautiful Spaces</h2>

        <div className="subscribe-section">
          <span className="subscribe-label">Stay in the loop</span>
          <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="E-mail address"
              className="subscribe-input"
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-col">
          <h4 className="col-heading">Explore</h4>
          <nav className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="/projects" className="footer-link">My Projects</a>
            <a href="/cancellation" className="footer-link">Cancellation policy</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="col-heading">Learn</h4>
          <nav className="footer-links">
            <a href="/how-it-works" className="footer-link">How It Works</a>
            <a href="/safety" className="footer-link">Safety Tips</a>
            <a href="/faq" className="footer-link">FAQ</a>
            <a href="/blog" className="footer-link">Blog</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="col-heading">Community</h4>
          <nav className="footer-links">
            <a href="/testimonials" className="footer-link">Testimonials</a>
            <a href="/partner-stories" className="footer-link">Partner Stories</a>
            <a href="/events" className="footer-link">Events & Meetups</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="col-heading">Support</h4>
          <nav className="footer-links">
            <a href="/contact" className="footer-link">Contact Us</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;