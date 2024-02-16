import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      className="transition-all duration-500 ease-in-out"
      onClick={() => handleFunction(user._id)}
      borderRadius="lg"
      mb={2}
      py={2}
      px={3}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      color="black"
      alignItems="center"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.img.secure_url}
      />
      <Box>
        <Text className="font-semibold">{user?.name}</Text>
        <Text fontSize="sm">
          <b>Email : </b>
          {user?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
