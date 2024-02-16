import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();
  const value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain,
    notification,
    setNotification,
  };
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/");
      return;
    }
    setUser(userInfo);
  }, []);

  return (
    <ChatContext.Provider value={value}> {children} </ChatContext.Provider>
  );
};

export const chatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
