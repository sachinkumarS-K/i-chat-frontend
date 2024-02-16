import React from "react";
import { chatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat, fetchAgain, setFetchAgain } = chatState();

  return (
    <Box
      className="ml-0 md:ml-4"
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "68%" }}
      bg="white"
      padding={3}
      flexDir="column"
      borderRadius="lg"
      borderWidth="1px"
      alignItems="center"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
