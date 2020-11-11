import React, { useEffect, useState } from 'react'
import "./Sidebar.css"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import SettingsIcon from "@material-ui/icons/Settings"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Avatar, Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField, Switch, FormControlLabel } from '@material-ui/core'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { selectUser } from '../../features/userSlice'
import { selectlanguage, selectsidebarmobile, setsidebarmobile } from '../../features/AppSlice'
import { useDispatch, useSelector } from 'react-redux'
import db, { auth } from '../../firebase/firebase'
import firebase from "firebase/app"
import { Scrollbars } from 'react-custom-scrollbars';

import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Snackbars from '../Snackbars'
import Userdialog from '../Userdialog/Userdialog'
import SidebarCategories from "./SidebarCategories"

function Sidebar ({ setsignouttoast }) {
    const user = useSelector(selectUser)
    const language = useSelector(selectlanguage)
    const sidebarmobile = useSelector(selectsidebarmobile)
    const [categoriemenu, setcategoriemenu] = useState(false)
    const [categoriecreated, setcategoriecreated] = useState(false)
    const [mobile, setmobile] = useState(false)
    const [categorieprivate, setcategorieprivate] = useState(false)

    const [categories, setcategories] = useState([])


    const [channerror, setchannerror] = useState(false)
    const [categoriename, setcategoriename] = useState("")
    const dispatch = useDispatch()

    const [menu, setmenu] = useState(false)
    const [dialog, setdialog] = useState(false)


    useEffect(() => {
        db.collection("categories").orderBy("created", "asc").onSnapshot(snapshot => {
            setcategories(snapshot.docs.map(doc => {
                if (doc.data().private === true) {
                    if (doc.data().createdby === user.uid) {
                        return ({
                            id: doc.id,
                            categorie: doc.data()
                        })
                    }
                    else return null
                }
                else {
                    return ({
                        id: doc.id,
                        categorie: doc.data()
                    })
                }
            })
            )
        })
        if (window.innerWidth < 768) {
            dispatch(setsidebarmobile({
                sidebarmobile: true
            }))
            setmobile(true)
        }

    }, [dispatch, user.uid])

    const handleaddcategorie = () => {
        if (categoriename) {
            db.collection("categories").add({
                categoriename: categoriename,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                createdby: user.uid,
                private: categorieprivate
            })
            setcategoriemenu(false)
            setcategoriecreated(true)
        }
        else {
            setchannerror(true)
        }
        setcategoriename("")

    }
    return (
        <>
            <div className={mobile ? sidebarmobile ? ("sidebar__mobile sidebar__div") : ("sidebar__mobileopen sidebar__div") : ("")} style={{ flex: mobile ? ("0") : ("0.25") }}>
                <div className={"sidebar"}>
                    <div className="sidebar__top" onClick={() => setmenu(!menu)}>
                        <h3 style={{ cursor: "pointer" }}>Discord CLoNe by tojglEE</h3>
                        <ExpandMoreIcon className={menu ? ("sidebar__menuiconshowed sidebar__menuicon") : ("sidebar__menuicon")} />
                        <Menu anchorEl={menu} className="sidebar__menu" open={menu} onClose={() => setmenu(false)}>
                            <MenuItem className="menu__itemflex" onClick={() => { setcategoriemenu(true) }}>
                                <div className="menu__text">
                                    {language === "hu" ? ("Kategória létrehozása") : ("Create category")}
                                </div>
                                <CreateNewFolderIcon />
                            </MenuItem>
                            <MenuItem className="menu__itemflex" onClick={() => { auth.signOut(); setsignouttoast(true) }}>
                                <div className="menu__text">
                                    {language === "hu" ? ("Kijelentkezés") : ("Sign out")}
                                </div>
                                <ExitToAppIcon />
                            </MenuItem>

                        </Menu>
                    </div>
                    <div onClick={() => {
                        if (window.innerWidth < 768 && !sidebarmobile) {
                            dispatch(setsidebarmobile({
                                sidebarmobile: true
                            }))
                        }
                    }} className="sidebar__channels">
                        <Scrollbars autoHide autoHideDuration={2000} renderThumbVertical={props => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}>
                            {categories.map(categorie => {
                                if (categorie) {
                                    return (
                                        <SidebarCategories categorieid={categorie.id} key={categorie.id} categorie={categorie.categorie} categoriename={categoriename}
                                            setcategoriename={setcategoriename} categoriemenu={categoriemenu}
                                            setcategoriemenu={setcategoriemenu} setchannerror={setchannerror} channerror={channerror} user={user} />
                                    )
                                }
                                else return null
                            })}
                        </Scrollbars>
                    </div>
                    <div className="sidebar__profile">
                        <Avatar src={user.photo} onClick={() => setdialog(true)} />
                        <div className="sidebar__profileinfo">
                            <h3 style={{ cursor: "pointer" }} onClick={() => setdialog(true)}>{user.displayname}</h3>
                            <p>#{user.uid.substring(0, 5)}</p>
                        </div>
                        <div className="sidebar__profileicons">
                            <SettingsIcon />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={categoriemenu} onClose={() => setcategoriemenu(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Add meg a kategória nevét!") : ("Write a channel categorie name!")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form style={{ margin: "10px" }} onSubmit={(e) => { e.preventDefault(); handleaddcategorie(categoriename) }}>
                        <TextField variant="filled" autoFocus value={categoriename} fullWidth onChange={(e) => setcategoriename(e.target.value)} label="Név" />
                        <FormControlLabel style={{ marginTop: "15px", fontWeight: "bold" }} control={
                            <Switch color="primary"
                                checked={categorieprivate} onChange={() => setcategorieprivate(!categorieprivate)} />
                        } label={language === "hu" ? ("Privát") : ("Private")} />
                    </form>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setcategoriemenu(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => handleaddcategorie(categoriename)}>{language === "hu" ? ("Létrehoz") : ("Create")}</Button>
                </DialogActions>
            </Dialog>




            <Userdialog dialog={dialog} setdialog={setdialog} user={user} avatar={true} />

            <Snackbars categoriecreated={categoriecreated} setcategoriecreated={setcategoriecreated} channerror={channerror} setchannerror={setchannerror} />
        </>
    )
}

export default Sidebar
