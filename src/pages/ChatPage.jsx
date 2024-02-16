import React from "react";
import { chatState } from "../context/ChatProvider";
import bgUrl from "../assets/chatBg.jpg";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
const ChatPage = () => {
  const { user } = chatState();
  return (
    <div
      className="min-h-screen bg-cover bg-center object-cover"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <SideDrawer />
      <Box display="flex" w="100%" h="92vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
