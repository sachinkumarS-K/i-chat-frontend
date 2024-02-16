import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { chatState } from "../context/ChatProvider";
import axios from "axios";
import { header } from "../utils/constant";
import toast from "react-hot-toast";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = chatState();
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
      console.log(data.data);
      setSearchResult(data.data);
    } catch (error) {
      toast.error("User search failed");
    }
    setLoading(false);
  }
  async function handleSubmit() {
    if (!groupChatName || !selectedUser) {
      toast.error("Please fill all the fileds");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        header
      );
      console.log(data);
      setChats([data, ...chats]);
      onClose();
      toast.success("New group creatd");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  async function handleDelete(id) {
    const userData = selectedUser.filter((u) => u._id !== id);

    setSelectedUser([...userData]);
  }
  async function handlerGroup(userToAdd) {
    const userData = searchResult.filter((u) => u._id == userToAdd);
    if (selectedUser.includes(userData[0])) {
      toast.error("User already added");
      return;
    }
    setSelectedUser((pre) => [...pre, userData[0]]);
  }

  return (
    <div>
      <span onClick={onOpen}> {children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-[35px] flex justify-center ">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User eg: Mohit , Mayank , Sahil.."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <div className="flex gap-2 w-full flex-wrap">
              {selectedUser.map((u) => (
                <UserBadgeItem
                  user={u}
                  key={u._id}
                  handleFuction={(id) => handleDelete(id)}
                />
              ))}
            </div>

            {loading ? (
              <div></div>
            ) : (
              <div>
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={(id) => handlerGroup(id)}
                  />
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModel;
