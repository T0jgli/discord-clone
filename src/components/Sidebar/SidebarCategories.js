import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grow, TextField } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import db from '../../lib/firebase';
import firebase from "firebase/app"
import { selectlanguage, setChannelInfo, setsnackbar } from '../../lib/AppSlice';
import SideBarChannel from './SideBarChannel';

const hiddencategories = JSON.parse(localStorage.getItem("hiddenCategories"))

const SidebarCategories = ({ user, categorie, categorieid, mobile }) => {
    const dispatch = useDispatch()

    const language = useSelector(selectlanguage)
    const [channels, setchannel] = useState([])
    const [promptstate, setpromptstate] = useState(false)
    const [hide, sethide] = useState(hiddencategories ? hiddencategories.includes(categorieid) ? true : false : false)
    const [channelname, setchannelname] = useState("")
    const [channeldesc, setchanneldesc] = useState("")

    useEffect(() => {
        db.collection("categories").doc(categorieid).collection("channels").orderBy("created", "asc").onSnapshot((snapshot) =>
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
                description: channeldesc,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                createdby: user.uid
            }).then((e) => {
                dispatch(setChannelInfo({
                    channelId: e.id,
                    channelName: channelname.replace(/\s\s+/g, ' '),
                    channelDesc: channeldesc,
                    categorieid: categorieid
                }))
                setchannelname("");
                setchanneldesc("")
                dispatch(setsnackbar({
                    snackbar: {
                        open: true,
                        type: "success",
                        hu: "Csatorna létrehozva!",
                        en: "Channel created!"
                    }
                }))
                setpromptstate(false);
            })
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
                <div className="sidebar__header" onClick={() => {
                    sethide(!hide);
                    if (!hide)
                        if (hiddencategories)
                            localStorage.setItem("hiddenCategories", JSON.stringify([
                                ...hiddencategories, categorieid
                            ]))
                        else
                            localStorage.setItem("hiddenCategories", JSON.stringify([
                                categorieid
                            ]))
                    else
                        localStorage.setItem("hiddenCategories", JSON.stringify(hiddencategories.filter(e => e !== categorieid)))

                }}>
                    <ExpandMoreIcon className={hide ? ("sidebar__categorieiconshowed sidebar__menuicon") : ("sidebar__menucion")} />
                    <h5>{categorie.categoriename}</h5>
                </div>
                <AddIcon onClick={() => setpromptstate(true)} />
            </div>

            <div className="sidebar__channelslist">
                {!hide && channels.map(({ id, channel }) => (
                    <SideBarChannel channeldesc={channel.description} categorieid={categorieid} user={user} key={id}
                        channelname={channel.channelname} createdby={channel.createdby} id={id} />
                ))}

            </div>

            <Dialog onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleaddchannel()
                }
                if (e.key === "Escape") {
                    setpromptstate(false)
                }
            }} TransitionComponent={Grow} open={promptstate} onClose={() => setpromptstate(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>
                        {language === "hu" ? ("Csatorna létrehozása") : ("Create a channel!")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form style={{ margin: "10px" }} onSubmit={(e) => { e.preventDefault(); handleaddchannel(channelname) }}>
                        <TextField variant="filled" autoFocus={mobile ? false : true} value={channelname} fullWidth
                            onChange={(e) => setchannelname(e.target.value)} label={language === "hu" ? ("Név") : ("Name")} />
                        <TextField variant="filled" style={{ marginTop: "30px" }} value={channeldesc} fullWidth
                            onChange={(e) => setchanneldesc(e.target.value)} label={language === "hu" ? ("Leírás") : ("Description")} />

                    </form>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setpromptstate(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => handleaddchannel()}>{language === "hu" ? ("Létrehoz") : ("Create")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SidebarCategories
