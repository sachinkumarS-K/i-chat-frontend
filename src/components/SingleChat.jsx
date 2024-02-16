import React, { useEffect, useState } from "react";
import { chatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderDetails } from "../utils/chatHelper";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import toast from "react-hot-toast";
import axios from "axios";
import { header } from "../utils/constant";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
const SingleChat = () => {
  const { user, selectedChat, setSelectedChat } = chatState();
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const ENDPOINT = "http://localhost:8000";
  let selectedChatCompare;
  const [socket, setSocket] = useState("");

  async function typingHandler(e) {
    setNewMessages(e.target.value);
  }
  let sockett;
  useEffect(() => {
    sockett = io(ENDPOINT);
    setSocket(sockett);
    sockett.emit("setup", user);
    sockett.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetChats();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    console.log("1");
    sockett.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
    console.log("2");
  }, []);

  async function fetChats() {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/message/${selectedChat._id}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      console.log(socket);
      setMessages((pre) => [...data.data]);
      socket.emit("join chat", selectedChat._id);
      console.log("join", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setLoading(false);
  }

  async function sendMessage(e) {
    if (e.key === "Enter" && newMessages) {
      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/v1/message",
          { content: newMessages, chatId: selectedChat._id },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );

        setMessages((pre) => [...pre, data.data]);
        setNewMessages("");

        sockett.emit("new message", data.data);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }
  return (
    <div className="text-black  w-[100%] h-[100%] ">
      {selectedChat ? (
        <div className="h-full">
          <div className="pb-3  px-2 flex w-full justify-between items-center">
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
              icon={<ArrowBackIcon />}
            />

            {!selectedChat.isGroupChat ? (
              <>
                <p className="text-3xl tracking-wider font-semibold">
                  {" "}
                  {getSender(user, selectedChat.users)}
                </p>
                <ProfileModel
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                <p className="text-2xl tracking-normal font-normal">
                  {selectedChat.chatName.toUpperCase()}
                </p>

                <UpdateGroupChatModel />
              </>
            )}
          </div>
          <Box
            display="flex"
            flexDir="column"
            borderRadius="lg"
            overflowY="hidden"
            h="92%"
            w="100%"
            p={3}
            bg="#E8E8E8"
            justifyContent="end"
          >
            {loading ? (
              <Spinner
                alignSelf="center"
                margin="auto"
                size="xl"
                w={20}
                h={20}
              />
            ) : (
              <div className="flex flex-col overflow-y-scroll ">
                <ScrollableChat message={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} mt={3}>
              <Input
                variant="filled"
                bg="E0E0E0"
                placeholder="Enter a message...."
                onChange={typingHandler}
                value={newMessages}
              />
            </FormControl>
          </Box>
        </div>
      ) : (
        <Box h="100%" className="flex items-center justify-center">
          <Text className="text-3xl pb-3 font-medium">
            Click on a user to start Chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
