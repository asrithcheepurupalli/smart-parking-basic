export interface ParkingSlot {
  id: string;
  number: number;
  isOccupied: boolean;
  type: 'standard' | 'handicap' | 'electric';
  price: number;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableTimeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  slotId: string;
  locationName: string;
  slotNumber: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}