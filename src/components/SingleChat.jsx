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
import Lottie from "react-lottie";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderDetails } from "../utils/chatHelper";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import toast from "react-hot-toast";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../assets/ani.json";
import { frontendUrl } from "../utils/constant";
let socket;
const SingleChat = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    setFetchAgain,
    fetchAgain,
  } = chatState();
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const ENDPOINT = "https://ichat-bj06.onrender.com";
  let selectedChatCompare;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(frontendUrl);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.off("setup");
      socket.disconnect();
    };
  }, []);
  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetChats();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  console.log("noti", notification);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log(newMessageRecieved);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //something else
        console.log(notification);
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((pre) => [...pre, newMessageRecieved]);
      }
    });
  });

  async function fetChats() {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${frontendUrl}api/v1/message/${selectedChat._id}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
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
        let chatt = newMessages;
        setNewMessages("");

        const { data } = await axios.post(
          `${frontendUrl}api/v1/message`,
          { content: chatt, chatId: selectedChat._id },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );
        socket.emit("stop typing", selectedChat._id);
        socket.emit("new message", data.data);
        setMessages((pre) => [...pre, data.data]);
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
              {isTyping ? (
                <div className="w-14 mb-2 ml-0">
                  <Lottie options={defaultOptions} />
                </div>
              ) : (
                <></>
              )}
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
