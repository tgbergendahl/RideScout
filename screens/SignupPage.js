import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';


const SignupPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };


  const handleSignup = async (e) => {
    e.preventDefault();


    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }


    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, username, password);
      // Redirect to login page after successful signup
      router.push('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <header>
        <h1 style={{ color: '#007BFF', fontSize: '2.5rem', margin: '2rem 0' }}>Signup Page</h1>
      </header>
      <main>
        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0' }}>Create an Account</h2>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button type="submit">Submit</button>
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




export default SignupPage;
