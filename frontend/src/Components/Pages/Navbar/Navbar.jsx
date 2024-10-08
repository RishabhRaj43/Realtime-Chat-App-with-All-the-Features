import { faComments as faCommentsRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faAddressBook,
  faBars,
  faComments as faCommentsSolid,
  faPeopleGroup,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProfile from "../../../Zustand/useProfile";
import axios from "axios";
import toast from "react-hot-toast";
import useSocket from "../../../Zustand/useSocket";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId, logout } = useProfile();
  const socket = useSocket((state) => state.socket);

  const toggleSidebar = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setTimeout(() => {
        toast.success("Logged out successfully");
      }, 1000);

      socket.emit("disconnected-user", {
        senderId: userId,
      });

      socket.emit("disconnected-from-group", { senderId: userId });

      logout();
    } catch (error) {
      console.log(error);
      toast.error("Error logging out");
    }
  };

  useEffect(() => {
    socket.emit("connected-user", { senderId: userId });
  }, [socket, userId]);

  return (
    <div className="flex">
      <div
        className={`flex fixed flex-col justify-between h-screen bg-green-500 transition-all duration-300 ease-in-out transform z-10 ${
          sidebarOpen ? "w-[150px] translate-x-0" : "w-[50px] translate-x-0"
        }`}
      >
        <div className="my-8">
          <div
            className="flex justify-center items-center mt-0 mb-9 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FontAwesomeIcon icon={!sidebarOpen ? faBars : faXmark} size="xl" />
          </div>
          <Link to={`/${userId}/getChat`} onClick={() => setOpen(false)}>
            <div className="flex justify-center items-center my-8">
              <FontAwesomeIcon icon={faCommentsRegular} size="xl" />
              <h3 className={`${!sidebarOpen && "hidden"} p-2 text-2xl `}>
                Chat
              </h3>
            </div>
          </Link>

          <Link to={`/${userId}/getGroups`} onClick={() => setOpen(false)}>
            <div className="flex justify-center items-center my-8">
              <FontAwesomeIcon icon={faPeopleGroup} size="xl" />
              <h3 className={`${!sidebarOpen && "hidden"} p-2 text-2xl`}>
                Groups
              </h3>
            </div>
          </Link>
        </div>
        <div>
          <Link to={`/save-contact`} onClick={() => setOpen(false)}>
            <div className="flex justify-center items-center my-8 cursor-pointer">
              <FontAwesomeIcon icon={faAddressBook} size="xl" />
              <h3 className={`${!sidebarOpen && "hidden"} p-2 text-2xl`}>
                Contact
              </h3>
            </div>
          </Link>
          <div
            className="flex justify-center items-center my-8 cursor-pointer"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faUser} size="xl" />
            <h3 className={`${!sidebarOpen && "hidden"} p-2 text-2xl`}>User</h3>
          </div>
        </div>
      </div>

      {/* Sidebar */}

      <div
        className={`absolute bg-slate-200 mb-3 shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? "left-40" : "left-16"
        } bottom-0 rounded-3xl ${
          dropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="flex flex-col justify-center items-center p-2">
          <li className="my-2">
            <Link
              to={`/profile/${userId.toString()}`}
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li className="my-2">
            <Link onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
