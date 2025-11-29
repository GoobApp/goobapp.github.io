// Followed tutorial: https://mobisoftinfotech.com/resources/blog/app-development/supabase-react-typescript-tutorial
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wfdcqaqihwsilzegcknq.supabase.co";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const Client = createClient(supabaseUrl, supabasePublishableKey);
