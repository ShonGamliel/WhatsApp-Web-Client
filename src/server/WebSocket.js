import { socketIP } from "../env";
let socket = new WebSocket(`wss://${socketIP}`);

function send(message) {
  try {
    socket.send(JSON.stringify(message));
  } catch {
    const timer = setInterval(() => {
      try {
        socket.send(JSON.stringify(message));
        clearInterval(timer);
      } catch {
        socket = new WebSocket(`wss://${socketIP}`);
        console.log("socket not ready yet");
      }
    }, 1000);
  }
}

export { socket, send };
