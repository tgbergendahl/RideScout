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


const mapContainerStyle = {
height: '400px',
width: '100%',
borderRadius: '10px',
boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
marginBottom: '1rem',
};


return (
<div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', backgroundColor: '#F7F8FA', minHeight: '100vh' }}>
<header style={{ padding: '1rem 0', backgroundColor: '#007BFF', color: '#FFFFFF' }}>
  <img src="/images/logo.png" alt="RideScout" style={{ width: '400px', height: '100px', margin: '2rem 0' }} />
</header>
<main style={{ padding: '2rem 0', maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Map Page</h2>
  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
    <LoadScript googleMapsApiKey={geocodingAPIKey}>
      {/* Render the map here */}
      <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: 0, lng: 0 }} zoom={3}>
        {/* Implement map features, markers, and other functionalities here */}
      </GoogleMap>
    </LoadScript>
  </div>
</main>
<footer style={{ backgroundColor: '#007BFF', color: '#FFFFFF', padding: '1rem 0', position: 'sticky', bottom: '0', width: '100%', zIndex: '1' }}>
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




export default MapPage;
