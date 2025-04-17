import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Search, MapPin } from 'lucide-react';

const vizagCenter = {
  lat: 17.6868,
  lng: 83.2185
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(vizagCenter);
  const [address, setAddress] = useState('');

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create SearchBox
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    setSearchBox(searchBox);

    // Bias searchBox results towards current map viewport
    map.addListener("bounds_changed", () => {
      if (searchBox) {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      }
    });

    // Listen for searchBox results
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places?.length === 0) return;

      const place = places![0];
      if (!place.geometry || !place.geometry.location) return;

      // Center map on selected place
      map.setCenter(place.geometry.location);
      map.setZoom(17);

      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setSelectedLocation(newLocation);
      setAddress(place.formatted_address || '');
      onLocationSelect({ 
        ...newLocation, 
        address: place.formatted_address || '' 
      });
    });
  }, [onLocationSelect]);

  const handleMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    setSelectedLocation(newLocation);

    // Reverse geocode to get address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: newLocation }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setAddress(results[0].formatted_address);
        onLocationSelect({ 
          ...newLocation, 
          address: results[0].formatted_address 
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          id="pac-input"
          type="text"
          placeholder="Search for a location in Vizag..."
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={vizagCenter}
        onLoad={onMapLoad}
      >
        <Marker
          position={selectedLocation}
          draggable={true}
          onDragEnd={handleMarkerDrag}
        />
      </GoogleMap>

      {address && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Selected Location</p>
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
}