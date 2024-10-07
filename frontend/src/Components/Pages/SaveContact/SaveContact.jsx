import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useProfile from "../../../Zustand/useProfile";

const SaveContact = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contacts, setContacts] = useState([]);

  const { userId } = useProfile();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${userId}/getContact`,
          { withCredentials: true }
        );
        console.log(res.data.contact);

        setContacts(res.data.contact);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    getContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error("Invalid phone number");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/user/${userId}/saveContact`,
        { phoneNumber: phoneNumber },
        { withCredentials: true }
      );

      setPhoneNumber("");
      window.location.reload();
      // toast.success("Contact saved successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h1 className="text-7xl font-bold text-center">Save Contact</h1>
      <div className="w-full mt-8">
        <form className="flex w-full p-3 gap-3 text-xl" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-grow border border-gray-300 rounded p-2"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </form>
      </div>
      <div className="w-full mt-8">
        {contacts.map((contact, index) => {
          const createdAtDate = new Date(contact.createdAt);

          const formattedDate = createdAtDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const formattedTime = createdAtDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className="flex w-full p-3 gap-3 text-xl" key={contact._id}>
              <h1>{index + 1}</h1>
              <h1>{contact.username}</h1>
              <h1>{contact.phoneNumber}</h1>
              <h1>{`${formattedDate} at ${formattedTime}`}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SaveContact;
