import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { auth } from "../../lib/firebase";
import { selectlanguage, setChannelInfo, setsnackbar } from "../../lib/redux/AppSlice";
import { MdOutlineExitToApp } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { MdFolder } from "react-icons/md";

const Navbar = ({ menu, setmenu, setcategoriemenu }) => {
    const dispatch = useDispatch();
    const language = useSelector(selectlanguage);

    return (
        <Menu
            anchorEl={menu}
            className="sidebar__menu"
            open={Boolean(menu)}
            transitionDuration={300}
            onClose={() => {
                setmenu(null);
            }}
        >
            <MenuItem
                className="menu__itemflex"
                onClick={() => {
                    setcategoriemenu(true);
                }}
            >
                <div className="menu__text">{language === "hu" ? "Kategóriák" : "Categories"}</div>
                <MdFolder />
            </MenuItem>
            <MenuItem
                className="menu__itemflex"
                onClick={() => {
                    auth.signOut();
                    dispatch(
                        setChannelInfo({
                            channelId: null,
                            channelName: null,
                            categorieid: null,
                            channelDesc: null,
                        })
                    );
                    dispatch(
                        setsnackbar({
                            snackbar: {
                                open: true,
                                type: "warning",
                                signout: true,
                                hu: "Sikeres kijelentkezés!",
                                en: "Successful sign out!",
                            },
                        })
                    );
                }}
            >
                <div className="menu__text">{language === "hu" ? "Kijelentkezés" : "Sign out"}</div>
                <MdOutlineExitToApp />
            </MenuItem>
        </Menu>
    );
};

export default Navbar;
