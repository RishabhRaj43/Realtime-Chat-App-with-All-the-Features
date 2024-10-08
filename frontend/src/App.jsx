import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Pages/Navbar/Navbar";
import Home from "./Components/Pages/Home/Home";
import { Toaster } from "react-hot-toast";
import Login from "./Components/Pages/LoginSignup/Login";
import Signup from "./Components/Pages/LoginSignup/Signup";
import useProfile from "./Zustand/useProfile";
import Profile from "./Components/Pages/Profile/Profile";
import SaveContact from "./Components/Pages/SaveContact/SaveContact";
import UserGetChat from "./Components/Pages/ChatSection/Chats/UserGetChat";
import Userchat from "./Components/Pages/ChatSection/Chats/Userchat";
import GetGroups from "./Components/Pages/ChatSection/Groups/GetGroups";
import GroupChat from "./Components/Pages/ChatSection/Groups/GroupChat";


const App = () => {
  const { isLoggedIn } = useProfile();
  return (
    <>
      {isLoggedIn() ? (
        <div className="flex">
          <Navbar />
          <Toaster />
          <div className="pl-[50px] w-full h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path = "/:id/getChat" element = {<UserGetChat />} />
              <Route path="/:senderId/chat/:receiverId" element={<Userchat />} />
              <Route path="/:senderId/getGroups" element={<GetGroups />} />
              <Route path="/:senderId/groupchat/:groupId" element={<GroupChat />} />
              
              <Route path="/save-contact" element={<SaveContact />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <Toaster />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Signup />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
