import React, { useEffect, useState } from "react";
import useProfile from "../../../../Zustand/useProfile";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const GetGroups = () => {
  const { userId } = useProfile();
  const [allGroups, setAllGroups] = useState([]);
  const [GroupHandle, setGroupHandle] = useState("");
  const [createGroupName, setCreateGroupName] = useState("");
  const [joinGroupHandle, setJoinGroupHandle] = useState("");

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/group/${userId}/getGroups`,
          { withCredentials: true }
        );
        setAllGroups(res.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    getGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      if (!createGroupName.trim() || !GroupHandle.trim()) {
        toast.error("Group name cannot be empty");
        return;
      }
      if (GroupHandle.trim().includes("@")) {
        toast.error("Group name cannot contain @");
        return;
      }
      if (GroupHandle.trim().includes(" ")) {
        toast.error("Group name cannot contain spaces");
        return;
      }
      const res = await axios.post(
        `http://localhost:8000/group/${userId}/createGroup`,
        {
          groupHandle: "@" + GroupHandle.trim(),
          groupName: createGroupName.trim(),
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setCreateGroupName("");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8000/group/${userId}/joinGroup`,
        {
          groupHandle: "@" + joinGroupHandle.trim(),
        },
        { withCredentials: true }
      );
      setAllGroups(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-between h-1/6 p-3">
        <h1 className="text-6xl text-center font-bold">All Groups</h1>
        <div className="felx flex-col space-y-2">
          <form onSubmit={handleCreateGroup}className="space-x-2">
            <input
              type="text"
              className=" p-2 rounded"
              placeholder="Group Handle"
              value={GroupHandle}
              onChange={(e) => setGroupHandle(e.target.value)}
            />
            <input
              type="text"
              className=" p-2 rounded"
              placeholder="Group Name"
              value={createGroupName}
              onChange={(e) => setCreateGroupName(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
              Create Group
            </button>
          </form>

          {/** Fot Joining */}
          <form onSubmit={handleJoinGroup} className="space-x-2">
            <input
              type="text"
              className=" p-2 rounded"
              placeholder="Group Handle"
              value={joinGroupHandle}
              onChange={(e) => setJoinGroupHandle(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
              Join Group
            </button>
          </form>
        </div>
      </div>
      <div className="space-y-2 p-3">
        {allGroups.map((group) => (
          <Link
            to={`/${userId}/groupchat/${group._id}`}
            className="w-full bg-gray-100 rounded-3xl p-4 flex flex-col justify-center "
          >
            <div
              key={group._id}
              className="w-full flex flex-col justify-center "
            >
              <h1 className="text-3xl font-semibold">{group.groupName}</h1>
              <h1>{group.groupHandle}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GetGroups;
