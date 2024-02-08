import React from 'react';


const ChallengesPage = () => {
  const challenges = [
    {
      id: 1,
      title: 'Explore the Coastline',
      description: 'Ride along the beautiful coastline and enjoy breathtaking views.',
      reward: 'Coastal Explorer Badge',
    },
    {
      id: 2,
      title: 'Mountain Peak Adventure',
      description: 'Conquer the challenging mountain trails and reach the summit.',
      reward: 'Mountain Master Badge',
    },
    // Add more challenges as needed
  ];


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <header>
        <h1 style={{ color: '#007BFF', fontSize: '2.5rem', margin: '2rem 0' }}>Challenges</h1>
      </header>
      <main>
        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0' }}>Join the RideScout Challenges!</h2>
        {challenges.map((challenge) => (
          <div key={challenge.id} style={{ margin: '1rem 0' }}>
            <h3 style={{ fontSize: '1.2rem' }}>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <p>Reward: {challenge.reward}</p>
            <button style={{ backgroundColor: '#007BFF', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
              Join Challenge
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};


export default ChallengesPage;


