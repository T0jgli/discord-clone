import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { useDispatch, useSelector } from 'react-redux';

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import db from '../../lib/firebase';
import firebase from "firebase/app"
import { selectlanguage, setChannelInfo, setsnackbar } from '../../lib/AppSlice';
import SidebarChannelList from './SidebarChannelList';

const SidebarCategories = ({ user, categorie, categorieid, mobile }) => {
    const dispatch = useDispatch()

    const language = useSelector(selectlanguage)

    const [channels, setchannel] = useState([])
    const [promptstate, setpromptstate] = useState(false)
    const [hide, sethide] = useState(false)
    const [channelname, setchannelname] = useState("")

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
                channelname: channelname.replace(/\s\s+/g, ' '),
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
                dispatch(setsnackbar({
                    snackbar: {
                        open: true,
                        type: "success",
                        hu: "Csatorna létrehozva!",
                        en: "Channel created!"
                    }
                }))
            })
            setpromptstate(false);
        }
        else {
            dispatch(setsnackbar({
                snackbar: {
                    open: true,
                    type: "error",
                    hu: "Azért ehhez meg kéne adni egy nevet is!",
                    en: "I think you should write a name first!"
                }
            }))
        }

    }

    return (
        <>
            <div className="sidebar__channelsheader">
                <div className="sidebar__header" onClick={() => sethide(!hide)}>
                    <ExpandMoreIcon className={hide ? ("sidebar__categorieiconshowed sidebar__menuicon") : ("sidebar__menucion")} />
                    <h5>{categorie.categoriename}</h5>
                </div>
                <AddIcon onClick={() => setpromptstate(true)} />
            </div>
            <SidebarChannelList categorieid={categorieid} channels={channels} hide={hide} user={user} />

            <Dialog open={promptstate} onClose={() => setpromptstate(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Add meg a csatorna nevét!") : ("Write a channel name!")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form style={{ margin: "10px" }} onSubmit={(e) => { e.preventDefault(); handleaddchannel(channelname) }}>
                        <TextField variant="filled" autoFocus={mobile ? false : true} value={channelname} fullWidth
                            onChange={(e) => setchannelname(e.target.value)} label="Név" />
                    </form>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setpromptstate(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => handleaddchannel(channelname)}>{language === "hu" ? ("Létrehoz") : ("Create")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SidebarCategories
