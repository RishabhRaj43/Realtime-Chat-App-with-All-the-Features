import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faEllipsisVertical,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import useProfile from "../../../../Zustand/useProfile";
import useSocket from "../../../../Zustand/useSocket";

const Userchat = () => {
  const { userId } = useProfile();
  const { senderId, receiverId } = useParams();
  const socket = useSocket((state) => state.socket);

  const [senderData, setSenderData] = useState({});
  const [receiverData, setReceiverData] = useState({});
  const [message, setMessage] = useState("");
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [threeDots, setThreeDots] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const senderInfo = await axios.get(
          `http://localhost:8000/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        const receiverInfo = await axios.get(
          `http://localhost:8000/user/${receiverId}`,
          {
            withCredentials: true,
          }
        );

        // console.log("senderInfo: ", senderInfo.data.);

        setBlocked(senderInfo.data.blocked);
        setSenderData(senderInfo.data);
        setReceiverData(receiverInfo.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();

    const getAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/message/${senderId}/getmessages/${receiverId}`,
          {
            withCredentials: true,
          }
        );
        setIncomingMessages(res.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    const handleOnlineUsers = (users) => {
      setReceiverData((prev) => ({
        ...prev,
        isOnline: users.includes(receiverId),
      }));
    };

    const handleNewMessages = (data) => {
      console.log("New Message: ", data);

      setIncomingMessages((prev) => [
        ...prev,
        {
          senderId: data.data.senderId,
          message: data.data.message,
        },
      ]);
    };

    const handleBlockedContact = (data) => {
      
      setBlocked(data);
      console.log("blocked: ", data);
    };

    socket.emit("connected-user", { senderId });
    socket.on("new-messages", handleNewMessages);

    socket.on("online-users", handleOnlineUsers);

    socket.on("add-blocked-contact", handleBlockedContact);

    getAllMessages();

    return () => {
      socket.off("new-messages", handleNewMessages);
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIncomingMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        message,
      },
    ]);

    socket.emit("send-message", {
      senderId,
      receiverId,
      message,
    });

    setMessage("");
  };

  const handleBlockedContact = async () => {
    setThreeDots(false);

    try {
      const res = await axios.put(
        `http://localhost:8000/user/${senderId}/blocked/${receiverId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("res: ", res);
      socket.emit("new-blocked-contact", {
        senderId,
        receiverId,
        block: !blocked.includes(receiverId),
      });
      toast.success(`${receiverData.username} ${res.data.message}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-full justify-between flex flex-col">
      <div>
        <div
          className={`w-full p-3 text-xl px-3 ${
            receiverData.isOnline ? "bg-green-300" : "bg-slate-300"
          } `}
        >
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">
              Chatting with{" "}
              <span className="text-[#006BFF]">{receiverData.username}</span>
            </h1>
            <div className="flex gap-6">
              <button className="px-3">
                <FontAwesomeIcon icon={faVideoCamera} size="lg" />{" "}
              </button>
              <button onClick={() => setThreeDots(!threeDots)}>
                <FontAwesomeIcon icon={faEllipsisVertical} size="2x" />
              </button>

              {threeDots && (
                <div className="absolute top-16 right-0 flex flex-col p-3 rounded-xl bg-slate-200 gap-2">
                  <button onClick={handleBlockedContact}>
                    {blocked && blocked.includes(receiverId)
                      ? "Unblock"
                      : "Block"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex-grow overflow-y-auto p-3`}
          style={{ maxHeight: "500px" }}
        >
          {incomingMessages.length > 0 ? (
            <div>
              {incomingMessages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.senderId === senderId ? "text-right" : "text-left"
                  }`}
                >
                  <p className={`text-xl p-3 rounded-xl`}>{message.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-semibold text-center">
                No messages yet
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="w-full mb-2">
        {blocked && blocked.includes(receiverId) ? (
          <h1 className="text-xl font-semibold text-center">User is Blocked</h1>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full text-xl">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className="border-2 border-gray-300 p-2 w-11/12 rounded-xl"
            />
            <button
              type="submit"
              className="border-2 border-gray-300 p-2 bg-green-300 w-1/12 rounded-xl"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Userchat;
