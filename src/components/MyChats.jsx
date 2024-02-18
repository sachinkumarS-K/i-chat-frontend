import React, { useEffect, useState } from "react";
import { chatState } from "../context/ChatProvider";
import axios from "axios";
import { frontendUrl, header } from "../utils/constant";
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../utils/chatHelper";
import GroupChatModel from "./GroupChatModel";
import ChatLoading from "./loader/ChatLoading";
import UserChatDetails from "./UserChatDetails";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchAgain, selectedChat, chats, setChats, setSelectedChat } =
    chatState();
  async function fetchChat() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${frontendUrl}api/v1/chat`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      setChats(data);
    } catch (error) {}
    setLoading(false);
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));

    fetchChat();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      justifyContent="start"
      padding={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        fontSize={{ base: "28px", md: "30px" }}
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      {loading ? (
        <div className="w-full h-full flex justify-center  items-center">
          <Spinner size="2xl" />
        </div>
      ) : chats.length === 0 ? (
        <div className="w-full h-full flex justify-center tracking-wide text-red-500  text-2xl items-center">
          Search user to chat
        </div>
      ) : (
        <UserChatDetails loggedUser={loggedUser} />
      )}
    </Box>
  );
};

export default MyChats;
