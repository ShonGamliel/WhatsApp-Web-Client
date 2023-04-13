import { socketIP } from "../env";
const socket = new WebSocket(`ws://${socketIP}`);

function send(message) {
  socket.send(JSON.stringify(message));
}

export { socket, send };
