import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useProfile from "../../../../Zustand/useProfile";
import { useParams } from "react-router-dom";
import useSocket from "../../../../Zustand/useSocket";

const GroupChat = () => {
  const { userId } = useProfile();
  const { groupId } = useParams();
  const socket = useSocket((state) => state.socket);

  const [groupInfo, setGroupInfo] = useState({});
  const [message, setMessage] = useState("");
  const [onlineMembers, setOnlineMembers] = useState([]);

  useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/group/${userId}/getGroupInfo/${groupId}`,
          { withCredentials: true }
        );
        // console.log(res.data);
        
        setGroupInfo(res.data);
      } catch (error) {
        console.log(error.response);
        toast.error(error.response.data.message);
      }
    };

    const newUserJoinedGroup = (data) => {
      // console.log("Online User: ",data);
      
      setOnlineMembers(data);
    };

    const newGroupMessage = (data)=>{
      // console.log(groupInfo);
      
      setGroupInfo((prev)=>{
        return {...prev, messages: [...prev.messages, {
          message : data.message,
          senderId : {
            _id : data.user._id,
            username : data.user.username,
            displayName : data.user.displayName,
            profilePicture : data.user.profilePicture,
            phoneNumber : data.user.phoneNumber,
            // createdAt : data.user.createdAt
          }
        }]}
      })
    }

    socket.emit("new-user-joined-group", { groupId, senderId: userId });

    socket.on("total-user-joined-group", newUserJoinedGroup);

    socket.on("new-group-message", newGroupMessage);

    getGroupInfo();

    return () => {
      socket.off("new-user-joined-group", newUserJoinedGroup);
      socket.off("new-group-message", newGroupMessage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8000/group/${userId}/sendGroupMessage/${groupId}`,
        { message },
        { withCredentials: true }
      );

      socket.emit("send-group-message", {
        groupId,
        senderId: userId,
        message,
      });

      // setGroupInfo((prev) => ({
      //   ...prev,
      //   messages: [...prev.messages, res.data],
      // }));

      setMessage("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="bg-slate-100 rounded-md">
        <h1 className="p-3 font-bold text-5xl">{groupInfo.groupName}</h1>
        <div className="flex">
          {groupInfo.members &&
            groupInfo.members.map((member) => {
              console.log("Online Members: ", onlineMembers);
              
              return (
                <div key={member._id} className={`p-2 rounded-md text-xs `}>
                  <h1
                    className={`font-semibold text-xl ${
                      onlineMembers && onlineMembers.includes(member._id)
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {member.username + ","}
                  </h1>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <div className="w-full mb-2" style={{ height: "70vh" }}>
          {groupInfo.messages &&
            groupInfo.messages.map((message) => {
              // console.log(message);
              
              return (
                <div
                  key={message.senderId._id}
                  className={`p-2 rounded-md  ${
                    message && message.senderId._id === userId
                      ? "text-right"
                      : "text-left"
                  } `}
                >
                  <p>{message.senderId.username}</p>
                  <h1 className="font-semibold text-xl">{message.message}</h1>
                  <p>{new Date(message.createdAt).toLocaleString()}</p>
                </div>
              );
            })}
        </div>
        <div className="w-full">
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
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
