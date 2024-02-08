import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


const FeaturedRides = () => {
  const router = useRouter();
  const [weather, setWeather] = React.useState(null);


  const navigateToPage = (page) => {
    if (page === router.pathname) {
      // Refresh the feed when clicking the link of the current page
      router.replace(router.pathname);
    } else {
      router.push(`/${page}`);
    }
  };


  const weatherAPIKey = 'YOUR_OPENWEATHERMAP_API_KEY';
  const geocodingAPIKey = 'YOUR_GOOGLE_MAPS_API_KEY';


  // Function to fetch weather data using the API key and user's location
  const fetchWeatherData = async () => {
    try {
      // Get user's location using Google Maps Geocoding API
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('YOUR_LOCATION')}&key=${geocodingAPIKey}`);
      const data = await response.json();


      // Extract latitude and longitude from the geocoding data
      const { lat, lng } = data.results[0].geometry.location;


      // Fetch weather data using OpenWeatherMap API
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherAPIKey}`);
      const weatherData = await weatherResponse.json();


      // Use the weather data as needed
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };


  // Call the fetchWeatherData function when the component mounts
  React.useEffect(() => {
    fetchWeatherData();
  }, []);


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', backgroundColor: '#F7F8FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 0', backgroundColor: '#007BFF', color: '#FFFFFF' }}>
        <img src="/images/logo.png" alt="RideScout" style={{ width: '400px', height: '100px', margin: '2rem 0' }} />
      </header>
      <main style={{ padding: '2rem 0', flexGrow: '1', overflowY: 'scroll', paddingBottom: '150px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Featured Rides</h2>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Replace with your featured rides content */}
          <img src="/images/ride_image.jpg" alt="Featured Ride" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            What's up, thanks for downloading RideScout! We're super excited to launch this app
            so that riders can track their trips, stops, and share the best of them all with the
            RideScout community. We're adding some other features too like challenges, and probably
            the most exciting of all, the marketplace where you can buy and sell bikes and gear.
            I look forward to seeing your posts! In the meantime, here's me buying my first bike
            Honda Rebel 500
            .....
          </p>
        </div>
      </main>
      <footer style={{ backgroundColor: '#007BFF', color: '#FFFFFF', padding: '1rem 0', width: '100%', position: 'fixed', bottom: '0', zIndex: '1' }}>
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


export default FeaturedRides;
