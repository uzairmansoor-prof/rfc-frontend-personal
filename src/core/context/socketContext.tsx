import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_BASE_PATH } from "../constants/env-constants";
import { isEmpty } from "../utils/functions";
import { useLocation } from "react-router-dom";

const socketContext = createContext({
  socketInstance: null,
});

const SocketContexttProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const socketRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("access-token");

    if (isEmpty(token)) return;
    socketRef.current = io(`${SOCKET_BASE_PATH}/admin`, {
      query: { token: `${token}` },
    });
    console.log({ socket: socketRef.current });
    socketRef.current.on("connect", (response) => {
      console.log("Connected to server", response);
      setSocket(socketRef.current);
      // toast.success("Socket Connected!");
    });

    socketRef.current.on("disconnect", (disconnect) => {
      console.log("Disconnected from server", disconnect);
      //toast.success("Socket Disconnected!");
    });

    socketRef.current.on("error", (message) => {
      console.log("New message received:", message);
      //toast.error("Socket Connection Error!");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [location?.pathname]);
  return (
    <socketContext.Provider
      value={{
        socketInstance: socket,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

const useSocketContext = () => {
  const socketContextValue = useContext(socketContext);
  if (!socketContextValue) {
    throw new Error("useContext must be used within a SocketContexttProvider");
  }
  return socketContextValue;
};

export { useSocketContext, SocketContexttProvider };
