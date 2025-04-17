import React from 'react';
import { X, MapPin, Clock, IndianRupee, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Booking } from '../types';

interface BookingsListProps {
  onClose: () => void;
}

const mockBookings: Booking[] = [
  {
    id: 'BK123',
    slotId: 'SLOT1',
    locationName: 'RK Beach Road',
    slotNumber: 'A12',
    startTime: new Date('2024-03-20T10:00:00'),
    endTime: new Date('2024-03-20T12:00:00'),
    totalPrice: 100,
    status: 'active',
  },
  {
    id: 'BK124',
    slotId: 'SLOT2',
    locationName: 'Dwaraka Nagar',
    slotNumber: 'B05',
    startTime: new Date('2024-03-21T14:00:00'),
    endTime: new Date('2024-03-21T16:00:00'),
    totalPrice: 120,
    status: 'pending',
  },
  {
    id: 'BK125',
    slotId: 'SLOT3',
    locationName: 'Jagadamba Junction',
    slotNumber: 'C08',
    startTime: new Date('2024-03-19T09:00:00'),
    endTime: new Date('2024-03-19T11:00:00'),
    totalPrice: 80,
    status: 'completed',
  },
];

const getStatusIcon = (status: Booking['status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'pending':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: Booking['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function BookingsList({ onClose }: BookingsListProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Bookings</h2>

        <div className="space-y-4">
          {mockBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                  <h3 className="font-semibold text-gray-900">{booking.locationName}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Location & Slot</p>
                    <p className="text-sm text-gray-600">
                      {booking.locationName} - {booking.slotNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Time Slot</p>
                    <p className="text-sm text-gray-600">
                      {booking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {booking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <IndianRupee className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm text-gray-600">₹{booking.totalPrice}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {getStatusIcon(booking.status)}
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-gray-600">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}