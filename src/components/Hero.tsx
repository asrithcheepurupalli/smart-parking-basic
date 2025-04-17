import React from 'react';
import { Search, MapPin, Clock, IndianRupee, Shield } from 'lucide-react';
import { GoogleMap, Autocomplete } from '@react-google-maps/api';
import { SearchResults } from './SearchResults';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 17.6868,
  lng: 83.2185
};

export function Hero() {
  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setSearchInput(place.formatted_address || '');
        setSelectedLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || '',
        });
        setShowResults(true);
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                Live
              </span>
              <span className="text-sm text-gray-600">
                Smart Parking in Visakhapatnam
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl leading-tight">
              Park Smart in<br />
              <span className="text-blue-600">The City of Destiny</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              సులభంగా పార్కింగ్ చేయండి। Find and book parking spots instantly across Vizag.
            </p>
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex flex-grow items-stretch">
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                    restrictions={{ country: 'in' }}
                    bounds={{
                      north: 17.8868,
                      south: 17.4868,
                      east: 83.4185,
                      west: 83.0185,
                    }}
                  >
                    <div className="relative w-full">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                        placeholder="Search in Vizag (e.g., RK Beach, Dwaraka Nagar)"
                      />
                    </div>
                  </Autocomplete>
                </div>
                <button 
                  onClick={() => {
                    if (selectedLocation) {
                      setShowResults(true);
                    }
                  }}
                  className="relative inline-flex items-center justify-center gap-x-1.5 rounded-lg px-6 py-3 bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto w-full"
                >
                  <Search className="h-5 w-5" />
                  వెతకండి (Search)
                </button>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">24x7 Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">From ₹20/hour</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Safe & Secure</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              options={{
                styles: [{ featureType: "poi.business", stylers: [{ visibility: "off" }] }],
                disableDefaultUI: true,
                zoomControl: true,
              }}
            />
          </div>
        </div>
      </div>
      {showResults && selectedLocation && (
        <SearchResults
          location={selectedLocation}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}