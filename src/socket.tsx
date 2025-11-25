import { io } from "socket.io-client";
const URL = import.meta.env.PROD
  ? "https://goobapp-backend.koyeb.app"
  : "http://localhost:3000"; // If import.meta.env.PROD is true, then you are in production. Otherwise just use localhost
export const socket = io(URL, {
  autoConnect: true, // TODO: make this false, and only connect once logged in
});
