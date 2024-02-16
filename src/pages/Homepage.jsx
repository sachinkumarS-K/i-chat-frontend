import React, { useEffect } from "react";
import bgUrl from "../assets/background.png";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
const Homepage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chat");
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center object-cover"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <Container maxW="xl" centerContent>
        <div className="flex justify-center w-full bg-gray-100 bg-opacity-30 p-3 border rounded-lg my-14 mt-10 mx-auto ">
          <p className="text-4xl font-serif ">i chat</p>
        </div>
        <div className="bg-gray-200 w-full bg-opacity-60 p-4 border rounded-lg">
          <Tabs variant="soft-rounded" colorScheme="yellow">
            <TabList className="mb-3">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default Homepage;
