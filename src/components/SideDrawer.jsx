import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useId, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { chatState } from "../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import ChatLoading from "./loader/ChatLoading";
import UserListItem from "./UserListItem";
import { frontendUrl, header } from "../utils/constant";
import { getSender } from "../utils/chatHelper";
const SideDrawer = () => {
  const {
    user,
    selectedChat,
    chats,
    setChats,
    setSelectedChat,
    setFetchAgain,
    fetchAgain,
    notification,
    setNotification,
  } = chatState();
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setSelectedChat("");
    setChats([]);
    navigate("/");
    setFetchAgain(!fetchAgain);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  async function handleSearch() {
    setLoading(true);
    if (!search) {
      toast.error("Please enter something in search !!");
    }
    try {
      const { data } = await axios.get(
        `${frontendUrl}api/v1/user?search=${search}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      setSearchState(data.data);
      setLoading(false);
    } catch (error) {}
  }

  async function accessChat(userId) {
    setLoadingChat(true);
    try {
      const { data } = await axios.post(
        `${frontendUrl}api/v1/chat`,
        { userId },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      if (!chats.find((c) => c._id === data.data._id)) {
        setChats([data.data, ...chats]);
      }
      console.log(chats);
      setSelectedChat(data.data);
    } catch (error) {
      // Handle error
    }
    setLoadingChat(false);
    onClose();
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            onClick={onOpen}
            variant="ghoast"
            className="flex items-center gap-1"
          >
            {" "}
            <IoIosSearch className="text-3xl" />{" "}
            <Text display={{ base: "none", md: "flex" }}>Search User</Text>
          </Button>
        </Tooltip>

        <Text className="text-3xl text-center" fontFamily="Work sans">
          i-chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" margin={1} />
              <MenuList pl={2}>
                {!notification.length && "No new messages"}
                {notification.map((n, id) => (
                  <MenuItem key={id}>
                    {n.chat.isGroupChat
                      ? `new message in ${n.chat.chatName}`
                      : `New message from ${getSender(user, n.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.img?.secure_url}
              />
            </MenuButton>
            <MenuList>
              {user && (
                <ProfileModel user={user}>
                  {" "}
                  <MenuItem>My Profile</MenuItem>
                </ProfileModel>
              )}
              <MenuDivider />
              <MenuItem onClick={() => logoutHandler()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex " pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => handleSearch()}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchState.length > 0 &&
              searchState?.map((userData) => {
                return (
                  <UserListItem
                    key={userData._id}
                    user={userData}
                    handleFunction={(d) => accessChat(d)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
