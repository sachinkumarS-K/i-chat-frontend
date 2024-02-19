import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { chatState } from "../../context/ChatProvider";
import { frontendUrl } from "../../utils/constant";
const Login = () => {
  const { setUser } = chatState();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function onChangeHandler(e) {
    const { value, name } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function submitHandler() {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const res = await toast.promise(
        axios.post(`${frontendUrl}api/v1/user/login`, formData),
        {
          loading: "logging in user...",
          success: "log in successfully",
          error: (data) => {
            return data.response.data.message;
          },
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      setUser({ ...res.data.user });
    } catch (error) {
      return;
    }

    setFormData({
      email: "",
      password: "",
    });
    navigate("/chat");
  }

  return (
    <VStack spacing="5px" className="text-black">
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          value={formData.email}
          onChange={(e) => onChangeHandler(e)}
          className="text-black placeholder:text-black"
          placeholder="Enter Your Email"
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={formData.password}
            onChange={(e) => onChangeHandler(e)}
            name="password"
            className="text-black placeholder:text-black"
            type={isOpen ? "text" : "password"}
            placeholder="Enter Your Password"
          ></Input>
          <InputRightElement onClick={() => setIsOpen(!isOpen)} width="5rem">
            {!isOpen ? (
              <FaRegEyeSlash className="text-2xl" />
            ) : (
              <IoEyeOutline className="text-2xl" />
            )}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <button
        onClick={submitHandler}
        className="bg-teal-300 w-full text-xl font-semibold text-white hover:bg-teal-400 transition-all duration-500 ease-in-out rounded-lg py-[8px] mt-5"
      >
        Sign in
      </button>
    </VStack>
  );
};

export default Login;
