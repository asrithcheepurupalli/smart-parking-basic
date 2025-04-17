/*
  # Create parking system tables

  1. New Tables
    - `users`: Store user information and authentication
    - `parking_locations`: Store parking location details
    - `parking_slots`: Store individual parking slot information
    - `bookings`: Store parking bookings
    - `slot_availability`: Store real-time slot availability
    - `pricing_rules`: Store dynamic pricing rules

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parking_locations table
CREATE TABLE IF NOT EXISTS parking_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  total_slots integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parking_slots table
CREATE TABLE IF NOT EXISTS parking_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES parking_locations(id) ON DELETE CASCADE,
  slot_number text NOT NULL,
  slot_type text NOT NULL CHECK (slot_type IN ('standard', 'handicap', 'electric')),
  floor_number integer DEFAULT 1,
  base_price decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(location_id, slot_number)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  slot_id uuid REFERENCES parking_slots(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  payment_status text NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create slot_availability table for real-time status
CREATE TABLE IF NOT EXISTS slot_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid REFERENCES parking_slots(id) ON DELETE CASCADE,
  is_occupied boolean DEFAULT false,
  last_updated timestamptz DEFAULT now(),
  sensor_data jsonb DEFAULT '{}'::jsonb,
  UNIQUE(slot_id)
);

-- Create pricing_rules table for dynamic pricing
CREATE TABLE IF NOT EXISTS pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES parking_locations(id) ON DELETE CASCADE,
  slot_type text NOT NULL,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  start_hour integer CHECK (start_hour BETWEEN 0 AND 23),
  end_hour integer CHECK (end_hour BETWEEN 0 AND 23),
  multiplier decimal(3,2) DEFAULT 1.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view active parking locations" ON parking_locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active parking slots" ON parking_slots
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view slot availability" ON slot_availability
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view pricing rules" ON pricing_rules
  FOR SELECT USING (true);

-- Create functions for slot allocation and dynamic pricing
CREATE OR REPLACE FUNCTION calculate_parking_price(
  p_slot_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
) RETURNS decimal(10,2) AS $$
DECLARE
  base_price decimal(10,2);
  total_hours decimal(10,2);
  final_price decimal(10,2);
BEGIN
  -- Get base price from parking_slots
  SELECT base_price INTO base_price
  FROM parking_slots
  WHERE id = p_slot_id;
  
  -- Calculate total hours
  total_hours := EXTRACT(EPOCH FROM (p_end_time - p_start_time))/3600;
  
  -- Calculate final price (implement dynamic pricing logic here)
  final_price := base_price * total_hours;
  
  RETURN ROUND(final_price, 2);
END;
$$ LANGUAGE plpgsql;