import React from 'react';
import { Check, MapPin, Clock, IndianRupee, QrCode } from 'lucide-react';
import type { ParkingSlot, TimeSlot } from '../types';

interface BookingConfirmationProps {
  slot: ParkingSlot;
  timeSlot: TimeSlot;
  name: string;
  phone: string;
  bookingId: string;
  totalAmount: number;
  onClose: () => void;
}

export function BookingConfirmation({
  slot,
  timeSlot,
  name,
  phone,
  bookingId,
  totalAmount,
  onClose,
}: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          <p className="text-gray-600 mt-2">
            Your parking slot has been reserved successfully
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-medium">{bookingId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Name</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium">+91 {phone}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Location & Slot</p>
                <p className="text-sm text-gray-600">{slot.locationName} - Slot {slot.number}</p>
                {slot.type !== 'standard' && (
                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {slot.type === 'handicap' ? 'Accessible' : 'EV Charging'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Time Slot</p>
                <p className="text-sm text-gray-600">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Amount to Pay</p>
                <p className="text-sm text-gray-600">₹{totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <QrCode className="w-4 h-4" />
              Show this confirmation at the counter
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}