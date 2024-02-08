import React from 'react';
import Link from 'next/link';


const ProfilePage = () => {
  const [friends, setFriends] = React.useState([]);
  const [rideHistory, setRideHistory] = React.useState([]);


  // Fetch friends data
  const fetchFriends = async () => {
    try {
      // Fetch friends data from your API or database
      const response = await fetch('API_URL/friends');
      const data = await response.json();
      setFriends(data.friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };


  // Fetch ride history data
  const fetchRideHistory = async () => {
    try {
      // Fetch ride history data from your API or database
      const response = await fetch('API_URL/ride-history');
      const data = await response.json();
      setRideHistory(data.rideHistory);
    } catch (error) {
      console.error('Error fetching ride history:', error);
    }
  };


  // Call the fetchFriends and fetchRideHistory functions when the component mounts
  React.useEffect(() => {
    fetchFriends();
    fetchRideHistory();
  }, []);


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <header style={{ padding: '1rem 0', backgroundColor: '#007BFF', color: '#FFFFFF' }}>
        <img src="/images/logo.png" alt="RideScout" style={{ width: '400px', height: '100px', margin: '2rem 0' }} />
      </header>
      <main>
        <section>
          <h2>Friends & Connections</h2>
          <div>
            {friends.map((friend) => (
              <div key={friend.id}>
                <h3>{friend.name}</h3>
                <p>{friend.bio}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>Ride History</h2>
          <div>
            {rideHistory.map((ride) => (
              <div key={ride.id}>
                <h3>{ride.title}</h3>
                <p>Date: {ride.date}</p>
                <p>Distance: {ride.distance}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>Settings</h2>
          <div>
            <Link href="/settings" passHref>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <img src="gearLogo.png" alt="Settings" width="50" height="50" />
              </button>
            </Link>
          </div>
        </section>
        <section>
          <h2>Account Options</h2>
          <div>
            <Link href="/signup" passHref>
              <button style={{ border: 'none', background: '#007BFF', color: '#FFFFFF', padding: '10px 20px', margin: '5px', cursor: 'pointer', borderRadius: '5px' }}>Create an Account</button>
            </Link>
            <Link href="/login" passHref>
              <button style={{ border: 'none', background: '#007BFF', color: '#FFFFFF', padding: '10px 20px', margin: '5px', cursor: 'pointer', borderRadius: '5px' }}>Login</button>
            </Link>
          </div>
        </section>
      </main>
      <footer style={{ marginTop: '2rem', backgroundColor: '#007BFF', color: '#FFFFFF', padding: '1rem 0', position: 'sticky', bottom: '0', width: '100%', zIndex: '1' }}>
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




export default ProfilePage;
