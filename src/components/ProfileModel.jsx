import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        // <IconButton icon={<ViewIcon />} onClick={onOpen} />
        <div className="pr-1" onClick={onOpen}>
          <Image
            borderRadius="full"
            boxSize="40px "
            src={user.img?.secure_url}
          />
        </div>
      )}

      <Modal
        size={{ base: "sm", md: "lg" }}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent h="400px" w="90%">
          <ModalHeader
            fontSize="40px"
            className=" font-serif flex justify-center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={5}
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.img?.secure_url}
            />
            <Text fontSize={{ base: "20px", md: "30px" }}>{user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModel;
