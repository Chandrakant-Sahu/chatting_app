import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import "./Chat.css";
import {
  AttachFile,
  MoreVert,
  InsertEmoticon,
  Send,
} from "@material-ui/icons";
import { useParams } from "react-router";
import db from "../Firebase";
import { StateContext } from "../StateProvider";
import firebase from "firebase";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { toastNotificationStyle } from "./homepage/Navbar";
import { actionTypes } from "../reducer";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Picker from "emoji-picker-react";

const Chat = () => {
  const { state, dispatch } = useContext(StateContext);
  const [input, setInput] = useState(""); // Update state for message input
  const [seed, setSeed] = useState(""); //  Update the state for avatars
  const [roomName, setRoomName] = useState(""); // Update state for the room name in chat screen
  const [messages, setMessages] = useState([]); // To store messages displayed on the chat UI
  const [showEmoji, setShowEmoji] = useState(); // Handle emoji-picker display
  const [cursorPosition, setCursorPosition] = useState(); // Set the cursor position in the message input field
  const [anchorEl, setAnchorEl] = useState(null); // For Clear chat button
  const { roomId } = useParams(); // Get the room Id from the URL
  const hiddenInputFileRef = useRef(null); // Reference to hidden file upload input field
  const messageInputRef = useRef(null); // Reference to message input field

  // To update the room name on chat screen whenever clicked on the sidebar
  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data()?.name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  // To generate some random avatars
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    return () => {
      setSeed("");
    };
  }, [roomId]);

  // To Send and Add Message into Firebase
  const sendMessage = async (e) => {
    e.preventDefault();
    const messageCollection = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages");
    try {
      await messageCollection
        .add({
          id: "",
          message: input,
          name: state.user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((docRef) => {
          messageCollection.doc(docRef.id).update({ id: docRef.id });
        });
    } catch (error) {
      dispatch({
        type: actionTypes.ERROR,
        payload: { loading: false, error: true },
      });
      toast.error(`Failed to send message ${error.message}`, {
        toastNotificationStyle,
      });
    }
    setInput("");
  };

  // HANDLE MESSAGE INPUT ON_CHANGE
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // CUSTOM STYLE FOR CHAT HEADER ICONS
  const chatHeaderIconStyles = {
    fontSize: "2rem",
    fontWeight: "500",
  };

  // CUSTOM STYLE FOR EMOJI PICKER
  const pickerStyle = {
    backgroundColor: "#fff",
    width: "100%",
    overflowY: "auto",
  };

  // FOR OPTION BUTTON ON CHAT HEADER RIGHT
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // HANDLE CLOSE FOR OPTION BUTTON ON CHAT HEADER RIGHT
  const handleClose = () => {
    setAnchorEl(null);
  };

  // CLEAR CHAT FROM THE CHAT ROOM
  const clearChat = async () => {
    handleClose();
    const messageCollection = await db
      .collection("rooms")
      .doc(roomId)
      .collection("messages");

    try {
      confirmAlert({
        title: "Delete All Messages",
        message: "Are you sure ?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              await messageCollection.onSnapshot((snapshot) =>
                snapshot.docs.forEach((doc) => {
                  messageCollection.doc(doc.id).delete();
                })
              );
              // window.location.reload();
              toast.success(`Chat Cleared Successfully. `, {
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
      toast.error(`Unable to delete chats. ${error}`, {
        toastNotificationStyle,
      });
    }
  };

  // ADDING FILE UPLOADER
  const handleMediaButtonClick = () => {
    hiddenInputFileRef.current.click();
  };

  // HANDLING SELECTED FILE AND ADDING IT TO FIREBASE
  const handleSendImage = (e) => {
    const selectedFile = e.target.files[0];
    const messageCollection = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages");

    if (!selectedFile?.type.match("image.*")) {
      alert("Please Select an image file");
    } else {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        async () => {
          try {
            await messageCollection
              .add({
                id: "",
                message: reader.result,
                name: state.user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then((docRef) => {
                messageCollection.doc(docRef.id).update({ id: docRef.id });
              });
          } catch (error) {
            dispatch({
              type: actionTypes.ERROR,
              payload: { loading: false, error: true },
            });
            toast.error(`Failed to send message ${error.message}`, {
              toastNotificationStyle,
            });
          }
        },
        false
      );

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  // HANDLE AFTER CLICKING ON AN EMOJI
  const handleEmojiClick = (e, emojiObject) => {
    const ref = messageInputRef.current;
    const emoji = emojiObject.emoji;
    ref.focus();
    const start = input.substring(0, ref.selectionStart);
    const end = input.substring(ref.selectionStart);
    const newMessage = start + emoji + end;
    setInput(newMessage);
    setCursorPosition(start.length + emoji.length);
  };

  // SET THE CURSOR POSITION TO CURRENT CURSOR POSITION
  useEffect(() => {
    messageInputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  // TOGGLE EMOJI-PICKER DISPLAY ON BUTTON CLICK
  const handleShowEmojis = () => {
    messageInputRef.current.focus();
    setShowEmoji(!showEmoji);
  };

  return (
    <div className="chat">
      {/* CHAT__HEADER */}
      <div className="chat__header">
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
          className="chat__headerImg"
        />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last Seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
          </p>
        </div>
        <div className="chat__headerRight">
          <input
            type="file"
            ref={hiddenInputFileRef}
            onChange={handleSendImage}
            multiple
            accept="image/*"
            style={{ display: "none" }}
          ></input>
          <IconButton
            onClick={handleMediaButtonClick}
            className="chat__headerIcons"
            title="Media"
          >
            <AttachFile style={chatHeaderIconStyles} />
          </IconButton>
          <IconButton
            className="chat__headerIcons"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            title="Options"
          >
            <MoreVert style={chatHeaderIconStyles} />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={clearChat}
              onClose={handleClose}
              style={{ fontSize: "1.5rem" }}
            >
              Clear Chat
            </MenuItem>
          </Menu>
        </div>
      </div>

      {/* CHAT__BODY */}
      <PerfectScrollbar>
        <div className="chat__body">
          {messages.map((message, index) => {
            let msg = "";
            if (message.message?.indexOf("base64") !== -1) {
              msg = (
                <img
                  src={message.message}
                  alt="img-file"
                  style={{ width: "20rem", height: "20rem" }}
                />
              );
            } else {
              msg = message.message;
            }

            return (
              <p
                key={index}
                id={msg.id}
                className={`chat__message ${
                  message.name === state.user?.displayName && `chat__receiver`
                } `}
              >
                <span className="chat__username">{message?.name}</span>
                {msg}
                <span className="chat__timeStamp">
                  {new Date(
                    message.timestamp?.toDate()
                  ).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
                </span>
              </p>
            );
          })}
        </div>
      </PerfectScrollbar>

      {/* CHAT__FOOTER */}
      <div className="chat__footer">
        <div className={`emoji__list ${!showEmoji && `hidden`}`}>
          <Picker onEmojiClick={handleEmojiClick} pickerStyle={pickerStyle} />
        </div>
        <IconButton
          className="chat__footerIcons"
          onClick={handleShowEmojis}
          title="Emojis"
        >
          <InsertEmoticon style={{ fontSize: "2.3rem" }} />
        </IconButton>
        <form>
          <input
            ref={messageInputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
          />
          <IconButton
            onClick={sendMessage}
            type="submit"
            className="chat__footerIcons"
            title="Send"
          >
            <Send style={{ fontSize: "2.3rem" }} />
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default Chat;
