import React, { useEffect, useState } from "react";
import { chatState } from "../context/ChatProvider";
import axios from "axios";
import { frontendUrl, header } from "../utils/constant";
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../utils/chatHelper";
import GroupChatModel from "./GroupChatModel";
import ChatLoading from "./loader/ChatLoading";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { fetchAgain, selectedChat, chats, setChats, setSelectedChat } =
    chatState();
  async function fetchChat() {
    try {
      const { data } = await axios.get(`${frontendUrl}api/v1/chat`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      setChats(data);
    } catch (error) {}
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

      {chats.length === 0 ? (
        <Spinner className="flex justify-center h-full items-center" />
      ) : (
        <Box
          p={3}
          display="flex"
          flexDir="column"
          alignItems="center"
          borderRadius="lg"
          overflowY="hidden"
          justifyContent="center"
        >
          {" "}
          {chats ? (
            <Stack overflowY="scroll" w="100% ">
              {chats.map((chat) => {
                return (
                  <Box
                    className="space-y-2"
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    px={3}
                    w="100%"
                    color={selectedChat === chat ? "white" : "black"}
                    bg={selectedChat === chat ? "#a3e635" : "#F8F8F8"}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text w="100%" className="px-3 text-lg">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MyChats;
