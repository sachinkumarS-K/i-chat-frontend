import React, { useState } from "react";
import { chatState } from "../context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "./UserBadgeItem";
import toast from "react-hot-toast";
import axios from "axios";
import { header } from "../utils/constant";
import UserListItem from "./UserListItem";
const UpdateGroupChatModel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    chatState();
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const [renameLoading, setRenameLoading] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  async function handleRename() {
    if (!groupChatName) {
      toast.error("Please fil chat name field");
      return;
    }
    setRenameLoading(true);
    try {
      const { data } = await axios.put(
        "http://localhost:8000/api/v1/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        header
      );

      setSelectedChat(data.data);
    } catch (error) {
      toast.error(error.message);
    }
    setRenameLoading(false);
    setFetchAgain(!fetchAgain);
  }
  async function handleSearch(q) {
    setSearch(q);
    if (!q) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/user?search=${q}`,
        header
      );

      setSearchResult(data.data);
    } catch (error) {
      console.log(error);
      toast.error("User search failed");
    }
    setLoading(false);
  }
  async function handleRemove(userToAdd) {
    let userData = selectedChat.users.filter((u) => u._id == userToAdd);
    userData = userData[0];
    if (selectedChat.groupAdmin._id === userData._id) {
      toast.error("Only admins can add someOne");
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.put(
        `http://localhost:8000/api/v1/chat/groupRemove`,
        { chatId: selectedChat._id, userId: userData._id },
        header
      );
      console.log(data);
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
    onClose();
  }
  async function handleAddUser(userToAdd) {
    let userData = searchResult.filter((u) => u._id == userToAdd);
    userData = userData[0];
    if (selectedChat.users.find((u) => u._id === userData._id)) {
      toast.error("User already in the group");
      return;
    }
    if (selectedChat.groupAdmin._id === userData._id) {
      toast.error("Only admins can add someOne");
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.put(
        `http://localhost:8000/api/v1/chat/groupAdd`,
        { chatId: selectedChat._id, userId: userData._id },
        header
      );
      console.log(data);
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
    onClose();
  }

  return (
    <div className="relative">
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          {/* <IconButton
            className="w-10 absolute left-0 "
            onClick={() => onClose()}
            icon={<ArrowBackIcon />}
          /> */}
          <ModalHeader fontSize="35px" className=" flex justify-center ">
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Box className="flex flex-wrap justify-start items-center">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFuction={(id) => handleRemove(id)}
                />
              ))}
            </Box>

            <FormControl className="flex mt-3">
              <Input
                mb={3}
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                onClick={handleRename}
                ml={1}
                isLoading={renameLoading}
                colorScheme="teal"
                variant="solid"
              >
                Update
              </Button>
            </FormControl>
            <FormControl className="flex mt-3">
              <Input
                mb={3}
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <div className="w-full flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={(id) => handleAddUser(id)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove()}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModel;
