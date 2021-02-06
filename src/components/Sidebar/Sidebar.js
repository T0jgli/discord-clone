import React, { useEffect, useState } from 'react'

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import SettingsIcon from "@material-ui/icons/Settings"
import {
    Avatar, LinearProgress
} from '@material-ui/core'
import { selectUser } from '../../lib/userSlice'
import { selectsidebarmobile } from '../../lib/AppSlice'
import { useDispatch, useSelector } from 'react-redux'
import db from '../../lib/firebase'
import { Scrollbars } from 'react-custom-scrollbars';

import Userdialog from '../Dialogs/UserDialog'
import SidebarCategories from "./SidebarCategories"
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import Navbar from './Navbar';
import CategorieDialog from '../Dialogs/CategorieDialog';
import SettingsDialog from '../Dialogs/SettingsDialog';
import AllusersDialog from '../Dialogs/AllusersDialog';

const Sidebar = () => {
    const dispatch = useDispatch()

    const user = useSelector(selectUser)
    const sidebarmobile = useSelector(selectsidebarmobile)

    const [categoriemenu, setcategoriemenu] = useState(false)
    const [usersmenu, setusersmenu] = useState(false)
    const [settingsdialog, setsettingsdialog] = useState(false)
    const [confirmprompt, setconfirmprompt] = useState({
        en: null,
        hu: null,
        open: false,
        enter: null,
    })

    const [mobile] = useState(window.innerWidth < 768)
    const [categories, setcategories] = useState([])
    const [categoriename, setcategoriename] = useState("")
    const [menu, setmenu] = useState(null)
    const [dialog, setdialog] = useState({
        open: false
    })


    useEffect(() => {
        const cleanup = db.collection("categories").orderBy("created", "asc").onSnapshot(snapshot => {
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
        return () => cleanup()

    }, [dispatch, user.uid])


    return (
        <>
            <div
                className={mobile ? sidebarmobile ? ("sidebar__mobile sidebar__div") : ("sidebar__mobileopen sidebar__div") : ("sidebar__div")}>
                <div className={"sidebar"}>
                    <div className="sidebar__top" onClick={(e) => {
                        if (Boolean(menu))
                            setmenu(null);
                        else setmenu(e.currentTarget)
                    }}>
                        <h3 style={{ cursor: "pointer" }}>Discord CLoNe by tojglEE</h3>
                        <ExpandMoreIcon className={Boolean(menu) ? ("sidebar__menuiconshowed sidebar__menuicon") : ("sidebar__menuicon")} />
                        <Navbar menu={menu} setmenu={setmenu} setcategoriemenu={setcategoriemenu} setusersmenu={setusersmenu} />
                    </div>
                    <div className="sidebar__channels">
                        <Scrollbars autoHide autoHideDuration={2000} renderThumbVertical={props => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}>
                            {categories.length > 0 ?
                                categories.filter(c => c).map(
                                    categorie => {
                                        return (
                                            <SidebarCategories categorieid={categorie.id} key={categorie.id}
                                                categorie={categorie.categorie}
                                            />
                                        )
                                    }
                                )
                                : (
                                    <div className="sidebar__channels__loading">
                                        <LinearProgress color="primary" />
                                    </div>
                                )}

                        </Scrollbars>
                    </div>
                    <div className="sidebar__profile">
                        <Avatar src={user.photo} onClick={() => setdialog({
                            open: true,
                            user: user
                        })} alt="Avatar picture" />
                        <div className="sidebar__profileinfo">
                            <h3 style={{ cursor: "pointer" }} onClick={() => setdialog({
                                open: true,
                                user: user
                            })}
                            >{user.displayname}</h3>
                            <p>#{user.uid.substring(0, 5)}</p>
                        </div>
                        <div className="sidebar__profileicons">
                            <SettingsIcon onClick={() => setsettingsdialog(true)} />
                        </div>
                    </div>
                </div>

            </div>




            <AllusersDialog usersmenu={usersmenu} setusersmenu={setusersmenu} />

            <SettingsDialog setconfirmprompt={setconfirmprompt} settingsdialog={settingsdialog} setsettingsdialog={setsettingsdialog} />

            <CategorieDialog categoriemenu={categoriemenu} setcategoriemenu={setcategoriemenu}
                categoriename={categoriename} setcategoriename={setcategoriename} categories={categories}
                confirmprompt={confirmprompt} setconfirmprompt={setconfirmprompt}
            />

            <ConfirmDialog confirmprompt={confirmprompt} setconfirmprompt={setconfirmprompt} />

            <Userdialog dialog={dialog} setdialog={setdialog} avatar={true} />
        </>
    )
}

export default Sidebar
