import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';


const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to desired page after successful login
      router.push('/profile');
    } catch (error) {
      setMessage('Invalid email or password');
      console.error('Error logging in:', error);
    }
  };


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <header>
        <h1 style={{ color: '#007BFF', fontSize: '2.5rem', margin: '2rem 0' }}>Login Page</h1>
      </header>
      <main>
        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit">Login</button>
          <p>{message}</p>
        </form>
      </main>
      <footer style={{ marginTop: '2rem' }}>
      <nav>
          <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none' }}>
            <li style={{ margin: '0 10px' }}>
              <Link href="/home" passHref>
                <span onClick={() => navigateToPage('home')} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/images/homelogo.png" alt="Home" width="50" height="50" />
                  Home
                </span>
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link href="/featuredrides" passHref>
                <span onClick={() => navigateToPage('featuredrides')} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/images/featuredrideslogo.png" alt="Featured Rides" width="50" height="50" />
                  Featured Rides
                </span>
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link href="/map" passHref>
                <span onClick={() => navigateToPage('map')} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/images/maplogo.png" alt="Map" width="50" height="50" />
                  Map
                </span>
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link href="/marketplace" passHref>
                <span onClick={() => navigateToPage('marketplace')} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/images/marketplacelogo.png" alt="Marketplace" width="50" height="50" />
                  Marketplace
                </span>
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link href="/profile" passHref>
                <span onClick={() => navigateToPage('profile')} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/images/profilelogo.png" alt="Profile" width="50" height="50" />
                  Profile
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};




export default LoginPage;
