// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface ParkingData {
  hour: number;
  day: number;
  isWeekend: boolean;
  isHoliday: boolean;
  weather: string;
  events: string[];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data } = await req.json();
    const { locationId, slotId, predictFor } = data;

    // Get historical data
    const { data: historicalData, error } = await supabase
      .from('slot_availability')
      .select('is_occupied, last_updated')
      .eq('slot_id', slotId)
      .order('last_updated', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Simple prediction based on historical patterns
    // In production, this would use a proper ML model
    const occupancyRate = historicalData.filter(d => d.is_occupied).length / historicalData.length;
    const prediction = {
      probability: occupancyRate,
      confidence: 0.7,
      recommendedTime: null as string | null,
    };

    // If high occupancy, recommend alternative time
    if (occupancyRate > 0.8) {
      prediction.recommendedTime = new Date(
        new Date(predictFor).getTime() + 2 * 60 * 60 * 1000
      ).toISOString();
    }

    return new Response(
      JSON.stringify(prediction),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});