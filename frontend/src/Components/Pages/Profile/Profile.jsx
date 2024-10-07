import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Profile = () => {
  const id = useParams().id;

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    gender: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/user/${id}`, {
          withCredentials: true,
        });

        setUserData(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching user data");
      }
    };

    getUserData();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/user/${id}/update`,
        userData,
        {
          withCredentials: true,
        }
      );
      setUserData(res.data.user);
      toast.success("User data updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating user data");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownSelect = (gender) => {
    setUserData({ ...userData, gender });
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex-col items-center h-full w-full">
      <div className="h-1/5">
        <h1 className="text-7xl text-center font-bold pl-8 pt-8">
          User Profile
        </h1>
      </div>
      <hr className="w-full border-t-8 bg-orange-300 border-black border-double mt-4" />
      <div className="h-[75.8%] bg-slate-400">
        <div className="flex w-full justify-between items-center pt-8">
          <div className="w-1/2 px-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
              className="w-44 rounded-full mb-4"
            />
          </div>
          <div className="w-1/2 space-y-3">
            <div className="text-3xl flex gap-4">
              <h2 className="mb:2">Name:</h2>
              <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                className="bg-transparent"
                readOnly={false}
              />
              <FontAwesomeIcon icon={faPenToSquare} size="lg" />
            </div>
            <div className="text-3xl flex gap-4">
              <h2 className="text-3xl mb:2">Email:</h2>
              <input
                type="text"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="bg-transparent"
                readOnly={false}
              />
              <FontAwesomeIcon icon={faPenToSquare} size="lg" />
            </div>
            <div className="text-3xl flex gap-4">
              <h2 className="text-3xl mb:2">Phone:</h2>
              <input
                type="text"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
                className="bg-transparent"
                readOnly={false}
              />
              <FontAwesomeIcon icon={faPenToSquare} size="lg" />
            </div>
            <div className="text-3xl flex gap-4">
              <h2 className="text-3xl mb:2">Gender:</h2>
              <div className="relative" onClick={toggleDropdown}>
                <button className="bg-transparent text-3xl " type="button">
                  {userData.gender || "Select Gender"}
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4">
                    <ul className="py-1">
                      {["Male", "Female", "Prefer not to say"].map((gender) => (
                        <li key={gender}>
                          <button
                            className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2 w-full text-left"
                            onClick={() => handleDropdownSelect(gender)}
                          >
                            {gender}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <FontAwesomeIcon
                icon={isDropdownOpen ? faAngleUp : faAngleDown}
                className="cursor-pointer"
                size="lg"
                onClick={toggleDropdown}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
