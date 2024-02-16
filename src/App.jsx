import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import ChatProvider, { chatState } from "./context/ChatProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ChakraProvider>
      <ChatProvider>
        <Outlet />
      </ChatProvider>
      <Toaster />
    </ChakraProvider>
  );
};

export default App;
