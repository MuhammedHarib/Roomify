import React from 'react'
import { Box } from 'lucide-react'
import { Button } from './ui/button';
import { useOutletContext } from 'react-router';

const Navbar = () => {

  const{isSignedIn,userName,signIn,signOut}= useOutletContext<AuthContext>()
  const handleAuthClick = async () => {


if (isSignedIn) {
  try {

     await signOut();
    
  } catch (error) {
     console.error(`puter signed out failed ${error}` )
  }
  return;
}

    try {
      await signIn();
    } catch (error) {
      console.error(`puter sign in failed ${error}` )
    }
  return;
  }
  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo">

            </Box>
            <span className='name'>Roomify</span>
          </div>
          <ul className="links">
            <a href="/">Product</a>
            <a href="/about">Pricing</a>
            <a href="/contact">Comunity</a>
            <a href="/contact">Enterprise </a>

          </ul>

        </div>
        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">  {userName ? `hi, ${userName}` : 'sign in'}</span>
              <Button size="sm" className="btn" onClick={handleAuthClick}>Logout</Button>
            </>
          ) : (
            <>
              <button
                onClick={handleAuthClick}
                className="login">Login</button>
              <a className="cta" href="#upload">get started </a>
            </>)}
      </div>



      </nav>
    </header >
  )
}

export default Navbar