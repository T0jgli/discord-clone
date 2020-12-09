import React, { useEffect, useState } from 'react'
import "./Sidebar.css"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import SettingsIcon from "@material-ui/icons/Settings"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
    Avatar, Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField, Switch,
    FormControlLabel, Paper, Tabs, Tab, IconButton, Tooltip
} from '@material-ui/core'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import CloseIcon from '@material-ui/icons/Close';

import { selectUser } from '../../features/userSlice'
import { selectlanguage, selectsidebarmobile, setsidebarmobile } from '../../features/AppSlice'
import { useDispatch, useSelector } from 'react-redux'
import db, { auth } from '../../firebase/firebase'
import firebase from "firebase/app"
import { Scrollbars } from 'react-custom-scrollbars';

import Snackbars from '../Snackbars'
import Userdialog from '../Userdialog/Userdialog'
import SidebarCategories from "./SidebarCategories"
import { a11yProps, TabPanel } from "../../features/Tabhelper"
import SwipeableViews from 'react-swipeable-views';

function Sidebar ({ setsignouttoast }) {
    const user = useSelector(selectUser)
    const language = useSelector(selectlanguage)
    const sidebarmobile = useSelector(selectsidebarmobile)
    const [categoriemenu, setcategoriemenu] = useState(false)
    const [deleteprompt, setdeleteprompt] = useState(false)
    const [usersmenu, setusersmenu] = useState(false)

    const [categoriedeletederror, setcategoriedeletederror] = useState(false)

    const [categoriecreated, setcategoriecreated] = useState(false)
    const [categorieprivateprompt, setcategorieprivateprompt] = useState({
        prompt: false,
        type: null
    })
    const [categoriedeleted, setcategoriedeleted] = useState(false)

    const [settingsdialog, setsettingsdialog] = useState(false)

    const [categoriedeleteprompt, setcategoriedeleteprompt] = useState({
        prompt: false,
        id: null
    })

    const [mobile, setmobile] = useState(false)
    const [tab, settab] = useState(0)
    const [categorieprivate, setcategorieprivate] = useState(false)
    const [newusername, setnewusername] = useState(user.displayname)

    const [categories, setcategories] = useState([])

    const [channerror, setchannerror] = useState(false)
    const [categoriename, setcategoriename] = useState("")
    const dispatch = useDispatch()

    const [menu, setmenu] = useState(null)
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
        if (tab === 0)
            if (categoriename) {
                let ref = db.collection("categories").doc()
                ref.set({
                    id: ref.id,
                    categoriename: categoriename,
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                    createdby: user.uid,
                    private: categorieprivate
                })
                setcategoriecreated(true)
            }
            else {
                setchannerror(true)
            }
        setcategoriemenu(false)
        setcategoriename("")
    }


    const u = firebase.auth().currentUser
    const handleeditcategoriename = (e, id) => {
        db.collection("categories").doc(id).update({
            categoriename: e.target.value.replace(/\s\s+/g, ' ')
        })
    }
    const handleeditusernamedone = () => {
        if (newusername !== user.displayname) {
            u.updateProfile({
                displayName: newusername.replace(/\s\s+/g, ' ')
            }).then(window.location.reload(false))
            db.collection("users").doc(user.uid).update({
                displayname: newusername.replace(/\s\s+/g, ' ')
            })
        }
    }

    const handlecategorieprivate = (what, id) => {
        db.collection("categories").doc(id).update({
            private: what === "public" ? (false) : (true)
        }).then(setcategorieprivateprompt({ prompt: true, type: what }))
    }

    const handledeleteuser = async () => {
        db.collection("users").doc(user.uid).delete().then(await u.delete())
        window.close()
    }

    return (
        <>
            <div className={mobile ? sidebarmobile ? ("sidebar__mobile sidebar__div") : ("sidebar__mobileopen sidebar__div") : ("")} style={{ flex: mobile ? ("0") : ("0.25") }}>
                <div className={"sidebar"}>
                    <div className="sidebar__top" onClick={(e) => { if (Boolean(menu)) setmenu(null); else setmenu(e.currentTarget) }}>
                        <h3 style={{ cursor: "pointer" }}>Discord CLoNe by tojglEE</h3>
                        <ExpandMoreIcon className={Boolean(menu) ? ("sidebar__menuiconshowed sidebar__menuicon") : ("sidebar__menuicon")} />
                        <Menu
                            anchorEl={menu}
                            className="sidebar__menu"
                            open={Boolean(menu)}
                            onClose={() => setmenu(null)}
                        >
                            <MenuItem className="menu__itemflex" onClick={() => {
                                if (mobile && !sidebarmobile) {
                                    dispatch(setsidebarmobile({
                                        sidebarmobile: true
                                    }))
                                }
                                setcategoriemenu(true)
                            }}>
                                <div className="menu__text">
                                    {language === "hu" ? ("Kategóriák") : ("Categories")}
                                </div>
                                <FolderIcon />
                            </MenuItem>
                            <MenuItem className="menu__itemflex" onClick={() => {
                                if (mobile && !sidebarmobile) {
                                    dispatch(setsidebarmobile({
                                        sidebarmobile: true
                                    }))
                                }
                                setusersmenu(true)
                            }}>
                                <div className="menu__text">
                                    {language === "hu" ? ("Felhasználók") : ("Users")}
                                </div>
                                <PeopleAltIcon />
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
                        if (mobile && !sidebarmobile) {
                            dispatch(setsidebarmobile({
                                sidebarmobile: true
                            }))
                        }
                    }} className="sidebar__channels">
                        <Scrollbars autoHide autoHideDuration={2000} renderThumbVertical={props => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}>
                            {categories.map(categorie => {
                                if (categorie) {
                                    return (
                                        <SidebarCategories mobile={mobile} categorieid={categorie.id} key={categorie.id} categorie={categorie.categorie} categoriename={categoriename}
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
                            <SettingsIcon onClick={() => setsettingsdialog(true)} />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={categoriemenu} onClose={() => setcategoriemenu(false)}>
                <DialogContent>
                    <Paper>
                        <Tabs
                            centered
                            variant="fullWidth"
                            value={tab}
                            onChange={(e, val) => settab(val)}
                            aria-label="simple tabs example">
                            <Tab icon={<AddCircleIcon />} label={language === "hu" ? ("Létrehozás") : ("Create")} {...a11yProps(0)} />
                            <Tab icon={<EditIcon />} label={language === "hu" ? ("Szerkesztés") : ("Edit")} {...a11yProps(1)} />
                        </Tabs>
                    </Paper>
                </DialogContent>
                <SwipeableViews
                    axis="x"
                    index={tab}
                    onChangeIndex={(i) => settab(i)}
                >
                    <TabPanel value={tab} index={0}>
                        <DialogTitle style={{ margin: "5px" }}>
                            {language === "hu" ? ("Add meg a kategória nevét!") : ("Write a channel categorie name!")}
                        </DialogTitle>
                        <ArrowDropDownIcon />
                        <form style={{ margin: "10px" }} onSubmit={(e) => { e.preventDefault(); handleaddcategorie(categoriename) }}>
                            <TextField variant="filled" autoFocus={mobile ? false : true} value={categoriename} fullWidth
                                onChange={(e) => setcategoriename(e.target.value)} label="Név" />
                            <FormControlLabel style={{ marginTop: "15px", fontWeight: "bold" }} control={
                                <Switch color="primary"
                                    checked={categorieprivate} onChange={() => setcategorieprivate(!categorieprivate)} />
                            } label={language === "hu" ? ("Privát") : ("Private")} />
                        </form>
                    </TabPanel>

                    <TabPanel value={tab} index={1}>
                        <DialogTitle style={{ margin: "5px" }}>
                            {language === "hu" ? ("Kategóriák szerkesztése") : ("Edit categories")}
                        </DialogTitle>
                        <ArrowDropDownIcon />
                        {categories.map((categorie, index) => {
                            if (categorie && user.uid === categorie.categorie.createdby) {
                                const id = categorie.categorie.id
                                return (
                                    <form key={id} style={{ margin: "10px" }} onSubmit={(e) => { e.preventDefault(); handleaddcategorie() }}>
                                        <div style={{ margin: "10px 0 10px 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Tooltip placement="left" title={language === "hu" ? categorie.categorie.private ? ("Privát") : ("Publikus") :
                                                categorie.categorie.private ? ("Private") : ("Public")}>
                                                <IconButton style={{ color: "white", opacity: "0.5" }}>
                                                    {categorie.categorie.private ? (
                                                        <LockIcon onClick={() => handlecategorieprivate("public", id)} />
                                                    ) : (
                                                            <LockOpenIcon onClick={() => handlecategorieprivate("private", id)} />
                                                        )}
                                                </IconButton>
                                            </Tooltip>

                                            <TextField label="" variant="filled" value={categorie.categorie.categoriename} onChange={(e) => handleeditcategoriename(e, id)} />
                                            <Tooltip placement="right" title={language === "hu" ? ("Törlés") : ("Delete")}>
                                                <IconButton style={{ color: "gray" }} onClick={() => setcategoriedeleteprompt({ prompt: true, id: categorie.categorie.id })}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </form>
                                )
                            }

                            else if (index + 1 === categories.length)
                                return (
                                    <p style={{ opacity: "0.5" }}>Nincs általad létrehozott kategória</p>
                                )
                            else return null
                        })}
                    </TabPanel>
                </SwipeableViews>

                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setcategoriemenu(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => handleaddcategorie(categoriename)}>
                        {tab === 0 ? language === "hu" ? ("Létrehoz") : ("Create") : language === "hu" ? ("Kész") : ("Done")}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={categoriedeleteprompt.prompt} onClose={() => setcategoriedeleteprompt({ prompt: false })}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Biztosan törlöd a kategóriát?") : ("Are you sure you want to delete this category?")}
                    </DialogTitle>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setcategoriedeleteprompt({ prompt: false })}>{language === "hu" ? ("Nem") : ("No")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={async () => {
                            db.collection("categories").doc(categoriedeleteprompt.id).collection("channels").get().then(data => {
                                if (data.docs.length > 0) {
                                    setcategoriedeletederror(true)
                                    setcategoriedeleteprompt(false)
                                    setcategoriemenu(false)
                                }
                                else
                                    db.collection("categories").doc(categoriedeleteprompt.id).delete().then(() => {
                                        setcategoriedeleted(true)
                                        setcategoriedeleteprompt(false)
                                        setcategoriemenu(false)
                                    })
                            })
                        }}>{language === "hu" ? ("Igen") : ("Yes")}</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={settingsdialog} onClose={() => setsettingsdialog(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Beállítások") : ("Settings")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form style={{ marginTop: "20px" }} onSubmit={(e) => { e.preventDefault(); handleeditusernamedone(); setsettingsdialog(false) }}>
                        <TextField label={language === "hu" ? ("Felhasználónév") : ("Username")}
                            variant="outlined" value={newusername} onChange={(e) => { if (e.target.value) setnewusername(e.target.value) }} />
                    </form>
                    <br />
                    <Tooltip title={language === "hu" ? ("Fiók törlése") : ("Delete account")}>
                        <IconButton onClick={() => { setdeleteprompt(true) }} style={{ backgroundColor: "red", margin: "20px", color: "rgb(225, 225, 225)" }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setsettingsdialog(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}
                    </Button>

                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => { handleeditusernamedone(); setsettingsdialog(false) }}>{language === "hu" ? ("Kész") : ("Done")}</Button>

                </DialogActions>
            </Dialog>

            <Dialog open={usersmenu} onClose={() => setusersmenu(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hu" ? ("Felhasználók") : ("Users")}
                    </DialogTitle>
                    <DialogContent>

                    </DialogContent>
                </DialogContent>
                <div className="dialog__closeicon">
                    <IconButton onClick={() => setusersmenu(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>

            </Dialog>


            <Dialog onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handledeleteuser()
                }
                if (e.key === "Escape" || e.key === "Backspace") {
                    setdeleteprompt(false)
                }
            }} open={deleteprompt} onClose={() => setdeleteprompt(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hu" ? ("Biztosan törlöd a felhasználói fiókot?") : ("Are you sure you want to delete this user account?")}
                    </DialogTitle>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => { setdeleteprompt(false); setdialog(false) }}>{language === "hu" ? ("Nem") : ("No")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={async () => handledeleteuser()}>{language === "hu" ? ("Igen") : ("Yes")}</Button>
                </DialogActions>
            </Dialog>


            <Userdialog dialog={dialog} setdialog={setdialog} user={user} avatar={true} />

            <Snackbars
                categoriecreated={categoriecreated}
                setcategoriedeletederror={setcategoriedeletederror}
                categoriedeletederror={categoriedeletederror}
                setcategoriecreated={setcategoriecreated}
                channerror={channerror}
                setchannerror={setchannerror}
                setcategoriedeleted={setcategoriedeleted}
                categoriedeleted={categoriedeleted}
                categorieprivateprompt={categorieprivateprompt}
                setcategorieprivateprompt={setcategorieprivateprompt}
            />
        </>
    )
}

export default Sidebar