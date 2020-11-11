import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"
import SidebarChannelList from './SidebarChannelList';
import db from '../../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import firebase from "firebase/app"
import { selectlanguage, setChannelInfo } from '../../features/AppSlice';
import Snackbars from '../Snackbars';

function SidebarCategories ({ user, setchannerror, categorie, channerror, categorieid }) {
    const language = useSelector(selectlanguage)

    const [channels, setchannel] = useState([])
    const [promptstate, setpromptstate] = useState(false)
    const [channelcreated, setchannelcreated] = useState(false)
    const [hide, sethide] = useState(false)
    const [categoriedeleteprompt, setcategoriedeleteprompt] = useState(false)

    const [channeldeleted, setchanneldeleted] = useState(false)

    const [channelname, setchannelname] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        db.collection("categories").doc(categorieid).collection("channels").orderBy("created", "desc").onSnapshot((snapshot) =>
            setchannel(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    channel: doc.data(),
                }))
            )
        )
    }, [categorieid])

    const handleaddchannel = () => {
        if (channelname) {
            db.collection("categories").doc(categorieid).collection("channels").add({
                channelname: channelname,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                createdby: user.uid
            }).then(() => {
                db.collection("categories").doc(categorieid).collection("channels").get().then
                    (doc => doc.forEach(doc => {
                        if (channelname === doc.data().channelname) {
                            dispatch(setChannelInfo({
                                channelId: doc.id, channelName: doc.data().channelname, categorieid: categorieid, focus: true
                            }))
                        }
                    }))
                setchannelname("");
                setchannelcreated(true)
            })
            setpromptstate(false);
        }
        else {
            setchannerror(true)
        }

    }

    return (
        <>
            <div className="sidebar__channelsheader">
                <div className="sidebar__header" onClick={() => sethide(!hide)}>
                    {hide ? (<KeyboardArrowRightIcon />) : (<ExpandMoreIcon />)}
                    <h5>{categorie.categoriename}</h5>
                </div>
                <AddIcon onClick={() => setpromptstate(true)} />
            </div>
            <SidebarChannelList categorieid={categorieid} channels={channels} hide={hide} user={user} setchanneldeleted={setchanneldeleted} />

            <Dialog open={promptstate} onClose={() => setpromptstate(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Add meg a csatorna nevét!") : ("Write a channel name!")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form style={{ margin: "10px" }} onSubmit={(e) => { e.preventDefault(); handleaddchannel(channelname) }}>
                        <TextField variant="filled" autoFocus value={channelname} fullWidth onChange={(e) => setchannelname(e.target.value)} label="Név" />
                    </form>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setpromptstate(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => handleaddchannel(channelname)}>{language === "hu" ? ("Létrehoz") : ("Create")}</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={categoriedeleteprompt} onClose={() => setcategoriedeleteprompt(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Biztosan törlöd a kategóriát?") : ("Are you sure you want to delete this category?")}
                    </DialogTitle>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setcategoriedeleteprompt(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => handleaddchannel(channelname)}>{language === "hu" ? ("Létrehoz") : ("Create")}</Button>
                </DialogActions>
            </Dialog>

            <Snackbars channelcreated={channelcreated} setchannelcreated={setchannelcreated} channeldeleted={channeldeleted}
                setchanneldeleted={setchanneldeleted} channerror={channerror} setchannerror={setchannerror} />

        </>
    )
}

export default SidebarCategories
