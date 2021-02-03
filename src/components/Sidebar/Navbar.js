import { Menu, MenuItem } from '@material-ui/core';
import React from 'react'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { auth } from '../../lib/firebase'
import { selectlanguage, setChannelInfo, setsnackbar } from '../../lib/AppSlice'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import FolderIcon from '@material-ui/icons/Folder';
const Navbar = ({ menu, setmenu, setcategoriemenu, setusersmenu }) => {
    const dispatch = useDispatch();
    const language = useSelector(selectlanguage)

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
            <MenuItem className="menu__itemflex" onClick={() => {
                setcategoriemenu(true)
            }}>
                <div className="menu__text">
                    {language === "hu" ? ("Kategóriák") : ("Categories")}
                </div>
                <FolderIcon />
            </MenuItem>
            <MenuItem className="menu__itemflex" onClick={() => {
                setusersmenu(true)
            }}>
                <div className="menu__text">
                    {language === "hu" ? ("Felhasználók") : ("Users")}
                </div>
                <PeopleAltIcon />
            </MenuItem>

            <MenuItem className="menu__itemflex" onClick={() => {
                auth.signOut();
                dispatch(setChannelInfo({
                    channelId: null,
                    channelName: null,
                    categorieid: null,
                    channelDesc: null
                }))
                dispatch(setsnackbar({
                    snackbar: {
                        open: true,
                        type: "warning",
                        signout: true,
                        hu: "Sikeres kijelentkezés!",
                        en: "Successful sign out!"
                    }
                }))
            }}>
                <div className="menu__text">
                    {language === "hu" ? ("Kijelentkezés") : ("Sign out")}
                </div>
                <ExitToAppIcon />
            </MenuItem>

        </Menu>
    )
}

export default Navbar
