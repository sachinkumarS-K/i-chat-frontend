import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFuction }) => {
  return (
    <Box
      onClick={() => handleFuction(user._id)}
      px={3}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      className="font-semibold  bg-green-300 text-white flex items-center"
      varient="solid"
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
