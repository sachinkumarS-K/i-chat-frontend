import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { chatState } from "../../context/ChatProvider";
import { frontendUrl } from "../../utils/constant";
const SignUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imgUrl: "",
  });
  const navigate = useNavigate();
  const { setUser } = chatState();
  async function submitHandler(e) {
    e.preventDefault();

    const { email, password, name, imgUrl } = formData;

    if (!email || !password || !name) {
      toast.error("Please fill all the fields");
      return;
    }

    const userData = new FormData();
    userData.append("name", name);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("pic", imgUrl);
    try {
      const res = await toast.promise(
        axios.post(`${frontendUrl}api/v1/user/register`, userData),
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
      navigate("/chat");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to register user. Please try again.");
    }
  }

  function onChangeHandler(e) {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  function getImage(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      setFormData({
        ...formData,
        imgUrl: uploadedImage,
      });
    }
  }

  return (
    <VStack spacing="5px" className="text-black">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={formData.name}
          className="text-black placeholder:text-black"
          placeholder="Enter Your Name"
          name="name"
          onChange={(e) => onChangeHandler(e)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          value={formData.email}
          name="email"
          className="text-black placeholder:text-black"
          placeholder="Enter Your Email"
          onChange={(e) => onChangeHandler(e)}
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
      <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          name="pic"
          onChange={(e) => {
            getImage(e);
          }}
          p={1.5}
        />
      </FormControl>
      <button
        onClick={submitHandler}
        className="bg-blue-400 w-full text-xl font-semibold text-white hover:bg-blue-500 transition-all duration-500 ease-in-out rounded-lg py-3 mt-1.5"
      >
        Sign Up
      </button>
    </VStack>
  );
};

export default SignUp;
