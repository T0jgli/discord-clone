import React, { useState, useEffect } from 'react'

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button, IconButton, Dialog, DialogContent, DialogTitle, DialogActions, Tooltip, Grow } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';


import { useDispatch, useSelector } from 'react-redux'
import {
    setChannelInfo, selectlanguage, selectfilenamesinchannel, setfilenamesinchannel, selectimagenamesinchannel,
    setsnackbar, selectmutedchannels, selectChannelId, setsidebarmobile
} from '../../lib/AppSlice'
import db, { storage } from '../../lib/firebase'

const SideBarChannel = ({ id, channelname, channeldesc, createdby, user, categorieid }) => {
    const dispatch = useDispatch()

    const channelid = useSelector(selectChannelId)
    const language = useSelector(selectlanguage)
    const mutedchannels = useSelector(selectmutedchannels)

    const filenamesinchannel = useSelector(selectfilenamesinchannel)
    const imagenamesinchannel = useSelector(selectimagenamesinchannel)

    const [delbutton, setdelbutton] = useState(false)
    const [dialog, setdialog] = useState(false)
    const [deleteprompt, setdeleteprompt] = useState(false)
    const [newname, setnewname] = useState(channelname)
    const [newdesc, setnewdesc] = useState(channeldesc)


    const deletefunc = () => {
        filenamesinchannel.map(file => {
            let ref = storage.ref().child("files/" + file)
            ref.delete()
            return null
        })
        imagenamesinchannel.map(file => {
            let ref = storage.ref().child("images/" + file)
            ref.delete()
            return null
        })

        db.collection("categories").doc(categorieid).collection("channels").doc(id).collection("messages").get().then(res => res.forEach(el => el.ref.delete()))
        db.collection("categories").doc(categorieid).collection("channels").doc(id).delete()
        dispatch(setChannelInfo({
            channelId: null, channelName: null
        }), setfilenamesinchannel({ filenamesinchannel: [], imagenamesinchannel: [] }))
        dispatch(setsnackbar({
            snackbar: {
                open: true,
                type: "warning",
                hu: "Csatorna sikeresen törölve!",
                en: "Channel deleted!"
            }
        }))
    }

    const editfunc = () => {
        if (newname !== channelname || newdesc !== channeldesc) {
            if (newname.length > 0) {
                db.collection("categories").doc(categorieid).collection("channels").doc(id).update({
                    channelname: newname.replace(/\s/g, ''),
                    description: newdesc
                })
                dispatch(setChannelInfo({
                    channelName: newname, channelId: id, categorieid: categorieid, channelDesc: newdesc
                }))
            }
            else {
                setnewname(channelname)
                setnewdesc(channeldesc)
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
        setdialog(false)
    }
    useEffect(() => {
        let mounted = false;
        dispatch(setsidebarmobile({
            sidebarmobile: true
        }))

        if (id !== channelid && !mounted) {
            setdelbutton(false)
        }
        return () => { mounted = true };

    }, [channelid, id, dispatch])

    return (
        <>
            <div onMouseEnter={() => setdelbutton(true)} onMouseLeave={() => { if (id !== channelid) { setdelbutton(false) } }}
                className={id === channelid ? mutedchannels?.includes(id) ? ("sidebarchannel mutedchannelbg") :
                    ("sidebarchannel activechannel") : ("sidebarchannel notactivechannel")} onClick={() => {
                        setdelbutton(true); dispatch(setChannelInfo({
                            channelId: id, channelName: channelname, categorieid: categorieid, channelDesc: channeldesc
                        }))
                    }}>
                <h4 className={mutedchannels?.includes(id) ? "mutedchannel" : ("")}><span>#</span>{channelname}</h4>
                {delbutton && createdby === user.uid ? (
                    <IconButton onClick={() => setdialog(true)} className="delicon" style={{ color: "gray" }}>
                        <EditIcon />
                    </IconButton>
                ) : (null)}

            </div>
            <Dialog onKeyDown={(e) => {
                if (e.key === "Escape") {
                    setdialog(false)
                }
            }} TransitionComponent={Grow} open={dialog} onClose={() => setdialog(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hu" ? ("Csatorna szerkesztése") : ("Channel edit")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form onSubmit={(e) => { e.preventDefault(); editfunc() }} style={{ marginTop: "20px" }}>
                        <TextField
                            label={language === "hu" ? ("Név") : ("Name")}
                            variant="outlined"
                            value={newname} onChange={(e) => setnewname(e.target.value)}
                        />
                        <br />
                        <TextField
                            style={{ marginTop: "30px" }}
                            label={language === "hu" ? ("Leírás") : ("Description")}
                            variant="outlined"
                            value={newdesc} onChange={(e) => setnewdesc(e.target.value)}
                        />
                    </form>
                    <br />
                    <Tooltip title={language === "hu" ? ("Csatorna törlése") : ("Delete channel")}>
                        <IconButton onClick={() => setdeleteprompt(true)} style={{ backgroundColor: "red", margin: "20px", color: "rgb(225, 225, 225)" }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setdialog(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={async () => { await editfunc() }}>{language === "hu" ? ("Kész") : ("Done")}</Button>
                </DialogActions>
            </Dialog>


            <Dialog onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    deletefunc()
                }
                if (e.key === "Escape" || e.key === "Backspace") {
                    setdeleteprompt(false)
                }
            }} open={deleteprompt} onClose={() => setdeleteprompt(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hu" ? ("Biztosan törlöd a csatornát?") : ("Are you sure you want to delete this channel?")}
                    </DialogTitle>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => { setdeleteprompt(false); setdialog(false) }}>{language === "hu" ? ("Nem") : ("No")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={async () => { await deletefunc() }}>{language === "hu" ? ("Igen") : ("Yes")}</Button>
                </DialogActions>
            </Dialog>



        </>
    )
}

export default SideBarChannel
