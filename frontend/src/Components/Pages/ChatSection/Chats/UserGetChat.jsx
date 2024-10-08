import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSocket from "../../../../Zustand/useSocket";
import useProfile from "../../../../Zustand/useProfile";

const UserGetChat = () => {
  const { userId } = useProfile();

  const socket = useSocket((state) => state.socket);

  const [userChat, setUserChat] = useState({});
  const [blockedContact, setBlockedContact] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [existingUser, setExistingUser] = useState([]);

  useEffect(() => {
    console.log("ExistingUser: ", existingUser);

    const getUserChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${userId}/getContact`,
          {
            withCredentials: true,
          }
        );

        const obj = res.data.contact.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {});

        // setExistingUser
        // console.log("res.data: ",res.data.contact);

        setExistingUser((prev) => {
          const newSet = new Set(prev);
          res.data.contact.map((data) => {
            newSet.add(data._id);
          });
          return Array.from(newSet);
        });

        setUserChat(obj);
        setBlockedContact(res.data.blockedContact);
      } catch (error) {
        console.log(error);
      }
    };

    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${userId}/getmessages`,
          {
            withCredentials: true,
          }
        );
        // console.log("res: ", res.data);

        res.data.users.map((data) => {
          if (!userChat[data]) {
            console.log("userChat: ", data);

            setUserChat((prev) => ({
              ...prev,
              [data._id]: data,
            }));
          }
        });

        // setNewUser
      } catch (error) {
        console.log(error);
      }
    };

    const handleOnlineUsers = (users) => {
      // console.log("users: ", users);
      const validatedUsers = users.filter((user) => user !== userId);
      setOnlineUsers(validatedUsers);
    };

    const handleSeenMessages = (data) => {
      console.log("data : ", data.user);

      // setNewUser((prev) => {
      //   const newSet = new Set(prev);
      //   newSet.add(data.user._id);
      //   return Array.from(newSet);
      // });

      if (
        data.user &&
        data.user._id &&
        data.user._id !== userId &&
        !userChat[data.user._id]
      ) {
        setUserChat((prev) => ({
          ...prev,
          [data.user._id]: data.user,
        }));
      }
    };

    const handleUndeliveredMessagesArr = (data) => {
      // console.log("data.id : ",data._id);
    };

    socket.emit("connected-user", {
      senderId: userId,
    });

    socket.on("new-messages", handleSeenMessages);
    socket.on("online-users", handleOnlineUsers);
    socket.on("unseen-message-arr", handleUndeliveredMessagesArr);

    getUserChat();
    getMessages();

    return () => {
      socket.off("new-messages", handleSeenMessages);
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, userId]);
  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      {Object.keys(userChat).length === 0 ? (
        <div>
          <h1 className="text-4xl" >No Contact found</h1>
        </div>
      ) : (
        Object.values(userChat).map((user) => (
          // console.log("Users: ", newUser),
          <Link to={`/${userId}/chat/${user._id}`} key={user._id}>
            <div
              className={`w-full ${
                blockedContact.includes(user._id) ? "bg-red-300" : "bg-blue-300"
              } rounded-3xl ${
                blockedContact.includes(user._id)
                  ? "hover:bg-red-400"
                  : "hover:bg-blue-400"
              }`}
            >
              <div className="p-4">
                <h1
                  className={`text-2xl font-semibold 
                  ${existingUser.includes(user._id) ? "" : "hidden"}
                  `}
                >
                  {user.displayName}
                </h1>
                <p className="text-sm">{user.phoneNumber}</p>
                {onlineUsers.includes(user._id) && (
                  <p className="text-xs text-green-950">Online</p>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default UserGetChat;
