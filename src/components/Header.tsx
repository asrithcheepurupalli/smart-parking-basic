import React, { useState } from 'react';
import { ParkingCircle, PhoneCall, Bell, ClipboardList } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { BookingsList } from './BookingsList';
import { LoginModal } from './LoginModal';
import { useUser } from '../contexts/UserContext';

export function Header() {
  const { notifications, clearNotification } = useNotifications();
  const [showBookings, setShowBookings] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { userPhone } = useUser();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ParkingCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ParkEasy Vizag</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setShowBookings(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ClipboardList className="w-6 h-6" />
            </button>
            <div className="relative">
              <Bell 
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600"
                onClick={() => {/* Toggle notifications */}}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            <button 
              className={`flex items-center gap-2 px-4 py-2 ${
                userPhone 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } rounded-lg`}
              onClick={() => !userPhone && setShowLoginModal(true)}
            >
              <PhoneCall className="w-4 h-4" />
              {userPhone ? `Welcome +91 ${userPhone}` : 'Login with Mobile'}
            </button>
          </nav>
        </div>
      </div>
      {notifications.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className="flex items-center justify-between bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-2"
            >
              <p>{notification}</p>
              <button 
                onClick={() => clearNotification(index)}
                className="text-blue-500 hover:text-blue-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {showBookings && (
        <BookingsList onClose={() => setShowBookings(false)} />
      )}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
}