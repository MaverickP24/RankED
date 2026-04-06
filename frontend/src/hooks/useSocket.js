import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      socketRef.current = connectSocket(user._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  return socketRef.current;
};
