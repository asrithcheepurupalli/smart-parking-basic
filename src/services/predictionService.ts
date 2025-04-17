import { supabase } from './supabase';

export async function predictAvailability(
  locationId: string,
  slotId: string,
  predictFor: Date
) {
  const { data, error } = await supabase.functions.invoke('predict-availability', {
    body: {
      locationId,
      slotId,
      predictFor: predictFor.toISOString(),
    },
  });

  if (error) throw error;
  return data;
}