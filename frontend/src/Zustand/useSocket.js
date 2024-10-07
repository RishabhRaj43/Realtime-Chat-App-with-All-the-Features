import { create } from "zustand";
import { io } from "socket.io-client";

const useSocket = create((set) => {
  const socket = io("http://localhost:8000");
  return {
    socket,
    emit: (event, data) => socket.emit(event, data),
    on: (event, callback) => socket.on(event, callback),
    off: (event, callback) => socket.off(event, callback),
  };
});

export default useSocket;
