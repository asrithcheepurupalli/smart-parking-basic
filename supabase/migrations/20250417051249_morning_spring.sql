/*
  # Add ML-related tables

  1. New Tables
    - `parking_patterns`: Store historical parking patterns
    - `prediction_logs`: Store prediction accuracy for model improvement

  2. Security
    - Enable RLS on new tables
    - Add policies for data access
*/

-- Create table for parking patterns
CREATE TABLE IF NOT EXISTS parking_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid REFERENCES parking_slots(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  hour_of_day integer CHECK (hour_of_day BETWEEN 0 AND 23),
  occupancy_rate decimal(5,4),
  sample_size integer,
  last_updated timestamptz DEFAULT now()
);

-- Create table for prediction logs
CREATE TABLE IF NOT EXISTS prediction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid REFERENCES parking_slots(id) ON DELETE CASCADE,
  predicted_status boolean,
  actual_status boolean,
  prediction_time timestamptz,
  verification_time timestamptz,
  confidence decimal(5,4),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE parking_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view parking patterns"
  ON parking_patterns FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view prediction logs"
  ON prediction_logs FOR SELECT
  USING (true);