import React, { useState } from 'react'
import { Box, Menu, X } from 'lucide-react'
import { Button } from './ui/button';
import { useOutletContext } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleAuthClick = async () => {
    setIsOpen(false);
    if (isSignedIn) {
      try {
        await signOut();
      } catch (error) {
        console.error(`puter signed out failed ${error}`)
      }
      return;
    }

    try {
      await signIn();
    } catch (error) {
      console.error(`puter sign in failed ${error}`)
    }
  }

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className='name'>Roomify</span>
          </div>

          <ul className="links">
            <a href="/">Product</a>
            <a href="/about">Pricing</a>
            <a href="/contact">Community</a>
            <a href="/contact">Enterprise</a>
          </ul>
        </div>

        <div className="actions">
          {/* Desktop Auth Section */}
          {isSignedIn && (
            <span className="greeting hidden md:inline">
              {userName ? `hi, ${userName}` : 'signed in'}
            </span>
          )}

          <div className="desktop-auth">
            {isSignedIn ? (
              <Button size="sm" className="btn btn--primary" onClick={handleAuthClick}>
                Logout
              </Button>
            ) : (
              <>
                <button onClick={handleAuthClick} className="login">
                  Login
                </button>
                <a className="cta" href="#upload">get started</a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="mobile-menu">
          <a href="/" onClick={toggleMenu}>Product</a>
          <a href="/about" onClick={toggleMenu}>Pricing</a>
          <a href="/contact" onClick={toggleMenu}>Community</a>
          <a href="/contact" onClick={toggleMenu}>Enterprise</a>

          <div className="mobile-auth">
            {isSignedIn ? (
              <button className="btn-mobile" onClick={handleAuthClick}>Logout</button>
            ) : (
              <>
                <button className="login text-left" onClick={handleAuthClick}>Login</button>
                <button className="btn-mobile" onClick={() => { setIsOpen(false); window.location.hash = "upload"; }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar