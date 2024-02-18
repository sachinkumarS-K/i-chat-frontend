import React from "react";
import { chatState } from "../context/ChatProvider";
import { Box, Image, Stack, Text, Tooltip } from "@chakra-ui/react";
import { getSender } from "../utils/chatHelper";
import ChatLoading from "./loader/ChatLoading";
import chatLogo from "../assets/groupLogo.png";
const UserChatDetails = ({ loggedUser }) => {
  const { selectedChat, chats, setSelectedChat } = chatState();
  return (
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
        <Stack overflowY="scroll" w="100%  " className="space-y-1">
          {chats.map((chat) => {
            return (
              <Box
                className="flex items-center  justify-center py-2"
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
                {!chat.isGroupChat ? (
                  <Image
                    borderRadius="full"
                    boxSize="30px"
                    src={
                      chat.users[0]?._id === loggedUser?._id
                        ? chat.users[1]?.img.secure_url
                        : chat.users[0]?.img.secure_url
                    }
                  />
                ) : (
                  <Tooltip label="Group Chat" hasArrow placement="top-end">
                    <Image borderRadius="full" boxSize="30px" src={chatLogo} />
                  </Tooltip>
                )}
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
  );
};

export default UserChatDetails;
