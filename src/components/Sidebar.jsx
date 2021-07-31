import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChats from "./SidebarChats";
import "./Sidebar.css";
import db, { auth } from "../Firebase";
import { actionTypes } from "../reducer";
import { StateContext } from "../StateProvider";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { toastNotificationStyle } from "./homepage/Navbar";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const Sidebar = () => {
  const { state, dispatch } = useContext(StateContext);
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchEl = useRef("");
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  // EFFCT FOR GETTING ROOMS DETAILS FROM FIREBASE
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // HANDLE CLICK FOR OPTION BUTTON IN SIDEBAR HEADER
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // HANDLE CLOSE FOR OPTION BUTTON IN SIDEBAR HEADER LOGOUT MENU
  const handleClose = () => {
    setAnchorEl(null);
  };

  // LOG OUT THE CURRENT USER
  const logOut = () => {
    setAnchorEl(null);
    dispatch({
      type: actionTypes.LOG_OUT,
      payload: {
        loading: true,
        error: false,
      },
    });
    auth
      .signOut()
      .then(() => {
        dispatch({ type: actionTypes.SUCCESS, payload: { user: null } });
        history.push("/");
        toast.success(`You have logged out.`, { toastNotificationStyle });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.ERROR,
          payload: {
            error: true,
            loading: false,
          },
        });
        toast.error(`You have been logged out. ${err.message} `, {
          toastNotificationStyle,
        });
      });
  };

  // HANDLING SEARCH
  const handleSearch = () => {
    setSearchTerm(searchEl.current.value);
    if (searchTerm !== "") {
      const searchedRoomList = rooms.filter((room) => {
        return Object.values(room.data)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(searchedRoomList);
    } else {
      setSearchResults(rooms);
    }
  };

  // CUSTOM STYLES FOR SIDEBAR HEADER ICONS
  const sidebarIconStyles = {
    fontSize: "2rem",
    fontWeight: "400",
  };

  return (
    <div className={`sidebar`}>
      <div className="sidebar__header">
        <div className="sidebar__headerLeftIcons">
            <Avatar src={state.user?.photoURL} className="avatar__icon" title={state.user?.displayName} />
        </div>
        <div className="sidebar__headerRight">
          <IconButton
            className="sidebar__headerIcons"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            title="More Options"
          >
            <MoreVertIcon style={sidebarIconStyles} />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={logOut} style={{ fontSize: "1.5rem" }}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input
            ref={searchEl}
            placeholder="Search or start a new chat"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <PerfectScrollbar>
        <div className="sidebar__chats">
          <SidebarChats addNewChat />
          {searchTerm.length < 1
            ? rooms.map((room) => {
                return (
                  <SidebarChats
                    key={room.id}
                    id={room.id}
                    name={room.data.name}
                  />
                );
              })
            : searchResults.map((room) => {
                return (
                  <SidebarChats
                    key={room.id}
                    id={room.id}
                    name={room.data.name}
                  />
                );
              })}
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default Sidebar;
