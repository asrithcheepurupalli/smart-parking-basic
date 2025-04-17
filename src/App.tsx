import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ParkingLocations } from './components/ParkingLocations';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Hero />
          <Features />
          <ParkingLocations />
        </div>
      </LoadScript>
    </UserProvider>
  );
}

export default App;