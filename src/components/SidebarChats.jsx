import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { DeleteOutlined } from "@material-ui/icons";
import "./SidebarChats.css";
import db from "../Firebase";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { toastNotificationStyle } from "./homepage/Navbar";

const SidebarChats = ({ id, name, addNewChat }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");

  // To show the last message on hthe sidebar chats
  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  // To generate some random avatars
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    return () => {
      setSeed("");
    };
  }, []);

  const createChat = async () => {
    const roomName = prompt("Please enter a name for the chat room ");

    if (roomName) {
      // Do some database stuff...
      try {
        await db.collection("rooms").add({
          name: roomName,
        });
        toast.success(`Chat Created Successfully. `, {
          toastNotificationStyle,
        });
      } catch (error) {
        toast.error(`Failed to create chat. ${error} `, {
          toastNotificationStyle,
        });
      }
    }
  };

  const deleteChat = () => {
    try {
      confirmAlert({
        title: "Delete this chat",
        message: "Are you sure ?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              await db.collection("rooms").doc(id).delete();
              toast.success(`Successfully Deleted. `, {
                toastNotificationStyle,
              });
            },
          },
          {
            label: "No",
            onClick: () => null,
          },
        ],
      });
    } catch (error) {
      toast.error(`Cannot be Deleted. `, { toastNotificationStyle });
    }
  };

  // RECENT MESSAGE TO BE DISPLAYED ON THE CHAT ROOMS LIST
  const sliceMessage = (targetMessage) => {
    const num = 20;
    if (targetMessage?.message) {
      if (targetMessage.message.includes("base64")) {
        return (targetMessage.message = "Photo");
      } else if (targetMessage.message.length >= num) {
        return targetMessage.message.slice(0, num) + "...";
      } else {
        return targetMessage.message;
      }
    }
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <Link to={`/rooms/${id}`}>
        <div className="sidebarChat__info">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <div className="sidebarChat__infoText">
            <h2>{name}</h2>
            <p>{sliceMessage(messages[0])}</p>
          </div>
        </div>
      </Link>
      <div className="optionBtn">
        <IconButton onClick={deleteChat} title="Delete">
          <DeleteOutlined style={{ fontSize: "2rem", color: "#EFEFEF" }} />
        </IconButton>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat addNewChat">
      <h2>Add New Chat</h2>
      <AddCircleOutlineIcon />
    </div>
  );
};

export default SidebarChats;
