export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};
export const getSenderDetails = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// export const isSameSender = (message, m, i, userId) => {
//   return (
//     i < message.length - 1 &&
//     (message[i + 1].sender._id !== m.sender._id ||
//       message[i + 1].sender._id === undefined) &&
//     message[i].sender.id !== userId
//   );
// };

// export const isLastMessage = (messages, i, userId) => {
//   i === messages.length - 1 &&
//     messages[messages.length - 1].sender._id &&
//     messages[messages.length - 1].sender._id !== userId;
// };

export const isSameSender = (messages, m, i, userId) => {
  let flag = true;
  if (i == 0) return true;
  if (i + 1 == messages.length) return true;
  if (messages[i].sender?._id === messages[i + 1].sender?._id) {
    flag = false;
  } else flag = true;
  return flag;
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
