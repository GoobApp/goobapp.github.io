import { io } from "socket.io-client";
import { Client } from "./components/supabase/Client";
const URL = import.meta.env.PROD
  ? "https://goobapp-server.koyeb.app/"
  : "http://localhost:3000"; // If import.meta.env.PROD is true, then you are in production. Otherwise just use localhost

export const socket = io(URL, {
  autoConnect: false,
  auth: {
    token: await Client?.auth.getSession(),
  },
});
