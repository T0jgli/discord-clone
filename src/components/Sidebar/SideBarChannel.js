import React, { useState, useEffect } from 'react'

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button, IconButton, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';


import { useDispatch, useSelector } from 'react-redux'
import { selectChannelName, setChannelInfo, selectlanguage, selectfilenamesinchannel, setfilenamesinchannel, selectimagenamesinchannel } from '../../features/AppSlice'
import db, { storage } from '../../firebase/firebase'

function SideBarChannel({ id, channelname, createdby, user, setchanneldeleted, categorieid }) {
    const channel = useSelector(selectChannelName)
    const language = useSelector(selectlanguage)
    const filenamesinchannel = useSelector(selectfilenamesinchannel)
    const imagenamesinchannel = useSelector(selectimagenamesinchannel)
    const dispatch = useDispatch()

    const [delbutton, setdelbutton] = useState(false)
    const [dialog, setdialog] = useState(false)
    const [deleteprompt, setdeleteprompt] = useState(false)
    const [newname, setnewname] = useState(channelname)

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
        setchanneldeleted(true)
    }

    const editfunc = () => {
        if (newname != channelname && newname.replace(/\s/g, '').length) {
            db.collection("categories").doc(categorieid).collection("channels").doc(id).update({
                channelname: newname
            })
            dispatch(setChannelInfo({
                channelName: newname, channelId: id, focus: true
            }))
        }
        setdialog(false)
        setnewname(channelname)
    }

    useEffect(() => {
        let mounted = false;
        if (channelname !== channel && !mounted) {
            setdelbutton(false)
        }
        return () => { mounted = true };

    }, [channel])

    return (
        <>
            <div onMouseEnter={() => setdelbutton(true)} onMouseLeave={() => { if (channelname !== channel) { setdelbutton(false) } }}
                className={channelname === channel ? ("sidebarchannel activechannel") : ("notactivechannel sidebarchannel")} onClick={() => {
                    setdelbutton(true); dispatch(setChannelInfo({
                        channelId: id, channelName: channelname, categorieid: categorieid
                    }))
                }}>
                <h4><span>#</span>{channelname}</h4>
                {delbutton && createdby === user.uid ? (
                    <>
                        <IconButton onClick={() => setdialog(true)} className="delicon" style={{ color: "gray" }}>
                            <EditIcon />
                        </IconButton>
                    </>) : (null)}

            </div>
            <Dialog onKeyDown={(e) => {
                if (e.key === "Escape") {
                    setdialog(false)
                }
            }} open={dialog} onClose={() => setdialog(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hun" ? ("Csatorna szerkesztése") : ("Channel edit")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <DialogContentText>
                        <form onSubmit={(e) => { e.preventDefault(); editfunc() }} style={{ marginTop: "20px" }}>
                            <TextField
                                label={language === "hun" ? ("Név") : ("Name")}
                                defaultValue={channelname}
                                variant="outlined"
                                value={newname} onChange={(e) => setnewname(e.target.value)}
                            />
                        </form>
                        <br />
                        <IconButton onClick={() => setdeleteprompt(true)} style={{ backgroundColor: "red", margin: "20px", color: "rgb(225, 225, 225)" }}>
                            <DeleteIcon />
                        </IconButton>
                    </DialogContentText>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setdialog(false)}>{language === "hun" ? ("Mégse") : ("Cancel")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={async () => { await editfunc() }}>{language === "hun" ? ("Kész") : ("Done")}</Button>
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
                        {language === "hun" ? ("Biztosan törlöd a csatornát?") : ("Are you sure you want to delete this channel?")}
                    </DialogTitle>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => { setdeleteprompt(false); setdialog(false) }}>{language === "hun" ? ("Nem") : ("No")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={async () => { await deletefunc() }}>{language === "hun" ? ("Igen") : ("Yes")}</Button>
                </DialogActions>
            </Dialog>



        </>
    )
}

export default SideBarChannel
