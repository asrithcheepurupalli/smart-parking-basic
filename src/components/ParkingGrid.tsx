import React, { useState } from 'react';
import { Car, CarFront, Zap, Clock, IndianRupee } from 'lucide-react';
import { BookingModal } from './BookingModal';
import type { ParkingSlot, TimeSlot } from '../types/index';

interface ParkingGridProps {
  slots: ParkingSlot[];
  floors: number[];
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
  onSlotSelect: (slot: ParkingSlot) => void;
}

export default function ParkingGrid({
  slots,
  floors,
  selectedFloor,
  onFloorChange,
  onSlotSelect,
}: ParkingGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const getSlotIcon = (type: ParkingSlot['type'], isOccupied: boolean) => {
    const className = `h-6 w-6 ${isOccupied ? 'text-red-500' : 'text-green-500'}`;
    switch (type) {
      case 'handicap':
        return <CarFront className={className} />;
      case 'electric':
        return <Zap className={className} />;
      default:
        return <Car className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Occupied</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => onFloorChange(floor)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedFloor === floor
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => {
              onSlotSelect(slot);
              setSelectedSlot(slot);
            }}
            disabled={slot.isOccupied}
            className={`relative p-4 rounded-lg text-left space-y-1 ${
              slot.isOccupied
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-white border-2 border-green-500 hover:bg-green-50'
            }`}
          >
            {getSlotIcon(slot.type, slot.isOccupied)}
            <span className="font-semibold">Slot {slot.number}</span>
            <span className="text-sm text-gray-600">₹{slot.price}/hr</span>
            {!slot.isOccupied && (
              <div className="mt-2 w-full">
                <select
                  value={selectedTimeSlot?.id || ''}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => {
                    const timeSlot = slot.availableTimeSlots.find(ts => ts.id === e.target.value);
                    setSelectedTimeSlot(timeSlot || null);
                  }}
                >
                  <option value="">Select time slot</option>
                  {slot.availableTimeSlots
                    .filter(timeSlot => timeSlot.isAvailable)
                    .map(timeSlot => (
                      <option key={timeSlot.id} value={timeSlot.id}>
                        {timeSlot.startTime} - {timeSlot.endTime} (₹{timeSlot.price})
                      </option>
                    ))}
                </select>
              </div>
            )}
            {slot.type !== 'standard' && (
              <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {slot.type === 'handicap' ? 'Accessible' : 'EV Charging'}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          selectedTimeSlot={selectedTimeSlot}
          isOpen={!!selectedSlot}
          onClose={() => {
            setSelectedSlot(null);
            setSelectedTimeSlot(null);
          }}
        />
      )}
    </div>
  );
}