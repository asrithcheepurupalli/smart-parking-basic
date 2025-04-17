import React, { useState } from 'react';
import { X, Phone, User, Clock, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { BookingConfirmation } from './BookingConfirmation';
import { sendSMS } from '../services/smsService';
import type { ParkingSlot, TimeSlot } from '../types';

interface BookingModalProps {
  slot: ParkingSlot;
  selectedTimeSlot: TimeSlot | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ slot, selectedTimeSlot, isOpen, onClose }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(selectedTimeSlot);
  const [paymentMethod, setPaymentMethod] = useState<'counter' | 'online'>('counter');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!isOpen) return null;

  const totalAmount = selectedTime ? selectedTime.price : slot.price;

  const generateBookingId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `PK${timestamp}${random}`.toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    const newBookingId = generateBookingId();
    setBookingId(newBookingId);

    const bookingDetails = `🎉 ParkEasy Booking Confirmed!\n\nBooking ID: ${newBookingId}\nLocation: ${slot.locationName}\nSlot: ${slot.number}\nTime: ${selectedTime.startTime}-${selectedTime.endTime}\nAmount: ₹${totalAmount}\n\nShow this message at the counter. Happy Parking! 🚗`;

    sendSMS(phone, bookingDetails)
      .then((success) => {
        if (success) {
          toast.success('Booking confirmed! Details sent to your phone');
        } else {
          toast.error('Failed to send SMS. Please save your booking ID.');
        }
        setShowConfirmation(true);
      })
      .catch(() => {
        toast.error('Failed to send SMS. Please save your booking ID.');
        setShowConfirmation(true);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Parking Slot</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slot Details
            </label>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="text-sm text-gray-600">
                Slot Number: <span className="font-medium">{slot.number}</span>
              </p>
              <p className="text-sm text-gray-600">
                Type: <span className="font-medium capitalize">{slot.type}</span>
              </p>
              <p className="text-sm text-gray-600">
                Rate: <span className="font-medium">₹{slot.price}/hour</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="block w-full rounded-lg border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="10-digit mobile number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="timeSlot">
              Time Slot *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="timeSlot"
                value={selectedTime?.id || ''}
                onChange={(e) => {
                  const timeSlot = slot.availableTimeSlots.find(ts => ts.id === e.target.value);
                  setSelectedTime(timeSlot || null);
                }}
                className="block w-full rounded-lg border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a time slot</option>
                {slot.availableTimeSlots
                  .filter(timeSlot => timeSlot.isAvailable)
                  .map(timeSlot => (
                  <option key={timeSlot.id} value={timeSlot.id}>
                    {timeSlot.startTime} - {timeSlot.endTime} (₹{timeSlot.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('counter')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  paymentMethod === 'counter'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <IndianRupee className="w-5 h-5" />
                Pay at Counter
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  paymentMethod === 'online'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <IndianRupee className="w-5 h-5" />
                Pay Online
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Selected Time</span>
              <span className="font-medium">
                {selectedTime ? `${selectedTime.startTime} - ${selectedTime.endTime}` : 'Not selected'}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold mt-3 pt-3 border-t">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Confirm Booking
          </button>
        </form>
      </div>
      </div>

      {showConfirmation && selectedTime && (
        <BookingConfirmation
          slot={slot}
          timeSlot={selectedTime}
          name={name}
          phone={phone}
          bookingId={bookingId}
          totalAmount={totalAmount}
          onClose={() => {
            setShowConfirmation(false);
            onClose();
          }}
        />
      )}
    </>
  );
}