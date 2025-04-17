import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation2, Zap, CarFront } from 'lucide-react';
import ParkingGrid from './ParkingGrid';
import type { ParkingSlot } from '../types';

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push({
      id: `slot-${hour}`,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      isAvailable: Math.random() > 0.3,
      price: Math.floor(Math.random() * 30) + 20, // ₹20-50 per hour
    });
  }
  return slots;
};

const vizagLocations = [
  {
    id: 'beach-road',
    name: 'RK Beach Road',
    coordinates: { lat: 17.7209, lng: 83.3435 },
    description: 'Prime parking near beach front',
    totalSpots: 15,
  },
  {
    id: 'jagadamba',
    name: 'Jagadamba Junction',
    coordinates: { lat: 17.7127, lng: 83.3047 },
    description: 'Central shopping district parking',
    totalSpots: 20,
  },
  {
    id: 'dwaraka',
    name: 'Dwaraka Nagar',
    coordinates: { lat: 17.7277, lng: 83.3051 },
    description: 'Commercial hub parking',
    totalSpots: 25,
  },
];

export function ParkingLocations() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const floors = [1, 2, 3];

  useEffect(() => {
    if (selectedLocation) {
      const location = vizagLocations.find(loc => loc.id === selectedLocation);
      if (location) {
        const slots: ParkingSlot[] = Array.from({ length: location.totalSpots }, (_, i) => ({
          id: `${location.id}-slot-${i + 1}`,
          number: i + 1,
          isOccupied: Math.random() > 0.7,
          type: i % 5 === 0 ? 'handicap' : i % 3 === 0 ? 'electric' : 'standard',
          price: Math.floor(Math.random() * 30) + 20,
          locationName: location.name,
          coordinates: location.coordinates,
          availableTimeSlots: generateTimeSlots(),
        }));
        setParkingSlots(slots);
      }
    }
  }, [selectedLocation]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Parking Location</h2>
        <p className="text-gray-600 mb-6">Choose from our prime parking locations across the city</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {vizagLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedLocation === location.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {location.name}
                    {location.id === 'beach-road' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Popular</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>24/7 Open</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <CarFront className="w-4 h-4 text-blue-600" />
                      <span>{location.totalSpots} spots</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>EV Charging</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Navigation2 className="w-4 h-4 text-blue-600" />
                      <span>Navigation</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedLocation && parkingSlots.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Available Parking Slots at{' '}
              <span className="text-blue-600">
                {vizagLocations.find(loc => loc.id === selectedLocation)?.name}
              </span>
            </h3>
            <ParkingGrid 
              slots={parkingSlots} 
              floors={floors}
              selectedFloor={selectedFloor}
              onFloorChange={setSelectedFloor}
              onSlotSelect={(slot) => console.log('Selected:', slot)} 
            />
          </div>
        )}
      </div>
    </section>
  );
}