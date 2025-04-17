import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Car, MapPin, Clock, IndianRupee, Zap, CarFront } from 'lucide-react';
import { BookingModal } from './BookingModal';
import type { ParkingSlot } from '../types';

interface SearchResultsProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  onClose: () => void;
}

const generateMockParkingSpots = (center: { lat: number; lng: number }): ParkingSlot[] => {
  const spots: ParkingSlot[] = [];
  for (let i = 0; i < 5; i++) {
    const lat = center.lat + (Math.random() - 0.5) * 0.01;
    const lng = center.lng + (Math.random() - 0.5) * 0.01;
    
    spots.push({
      id: `spot-${i}`,
      number: i + 1,
      isOccupied: Math.random() > 0.7,
      type: i % 3 === 0 ? 'electric' : i % 2 === 0 ? 'handicap' : 'standard',
      price: Math.floor(Math.random() * 30) + 20,
      locationName: `Parking Zone ${String.fromCharCode(65 + i)}`,
      coordinates: { lat, lng },
      availableTimeSlots: Array.from({ length: 24 }, (_, hour) => ({
        id: `slot-${i}-${hour}`,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        isAvailable: Math.random() > 0.3,
        price: Math.floor(Math.random() * 30) + 20,
      })),
    });
  }
  return spots;
};

export function SearchResults({ location, onClose }: SearchResultsProps) {
  const [parkingSpots, setParkingSpots] = useState<ParkingSlot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  useEffect(() => {
    setParkingSpots(generateMockParkingSpots(location));
  }, [location]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const getMarkerIcon = (type: ParkingSlot['type']) => {
    switch (type) {
      case 'electric':
        return '🔌';
      case 'handicap':
        return '♿';
      default:
        return '🅿️';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Parking Spots</h2>
              <p className="text-gray-600">{location.address}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={15}
            >
              {parkingSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  position={spot.coordinates}
                  label={getMarkerIcon(spot.type)}
                  onClick={() => setSelectedMarker(spot.id)}
                >
                  {selectedMarker === spot.id && (
                    <InfoWindow
                      position={spot.coordinates}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-semibold">{spot.locationName}</h3>
                        <p className="text-sm">Slot {spot.number}</p>
                        <p className="text-sm">₹{spot.price}/hour</p>
                        <button
                          onClick={() => {
                            setSelectedSpot(spot);
                            setShowBookingModal(true);
                          }}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md"
                        >
                          Book Now
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-green-500" />
                <span>Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span>EV Charging</span>
              </div>
              <div className="flex items-center gap-2">
                <CarFront className="w-5 h-5 text-purple-500" />
                <span>Accessible</span>
              </div>
            </div>

            <div className="grid gap-4">
              {parkingSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpot(spot);
                    setShowBookingModal(true);
                  }}
                  disabled={spot.isOccupied}
                  className={`flex items-start gap-4 p-4 rounded-lg text-left ${
                    spot.isOccupied
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'bg-white border-2 border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {spot.type === 'electric' ? (
                      <Zap className="w-8 h-8 text-blue-500" />
                    ) : spot.type === 'handicap' ? (
                      <CarFront className="w-8 h-8 text-purple-500" />
                    ) : (
                      <Car className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{spot.locationName}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Slot {spot.number}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>24/7 Access</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span>₹{spot.price}/hour</span>
                      </div>
                    </div>
                    {spot.type !== 'standard' && (
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {spot.type === 'handicap' ? 'Accessible Parking' : 'EV Charging Available'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedSpot && showBookingModal && (
        <BookingModal
          slot={selectedSpot}
          selectedTimeSlot={null}
          isOpen={showBookingModal}
          onClose={() => {
            setSelectedSpot(null);
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
}