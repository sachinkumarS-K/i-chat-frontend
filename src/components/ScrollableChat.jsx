import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../utils/chatHelper";
import { chatState } from "../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
const ScrollableChat = ({ message }) => {
  const { user } = chatState();
  return (
    <ScrollableFeed>
      {message &&
        message.map((m, i) => (
          <div className="flex justify-start px-2 my-[6px] " key={m._id}>
            {m.sender._id !== user._id ? (
              <div className="flex items-center gap-1">
                {isSameSender(message, m, i, user._id) ? (
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    name={m.sender.name}
                    src={m.sender.img.secure_url}
                  />
                ) : (
                  <span className="mr-10"></span>
                )}
                <p className="text-lg bg-[#34d399] px-2 py-1 rounded-xl text-white">
                  {m.content}
                </p>
              </div>
            ) : (
              <div className="flex justify-end w-full">
                <p className="text-lg bg-blue-400 px-2 py-1 rounded-xl text-white">
                  {m.content}
                </p>
              </div>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
