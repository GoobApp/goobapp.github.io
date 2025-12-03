import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wfdcqaqihwsilzegcknq.supabase.co";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const Client = supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null;