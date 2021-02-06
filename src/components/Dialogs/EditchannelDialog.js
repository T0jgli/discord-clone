import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button, IconButton, Dialog, DialogContent, DialogTitle, DialogActions, Tooltip, Grow } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { selectfilenamesinchannel, selectimagenamesinchannel, selectlanguage, setChannelInfo, setfilenamesinchannel, setsnackbar } from '../../lib/AppSlice';
import db, { storage } from '../../lib/firebase'

const EditchannelDialog = ({ channel, dialog, setdialog, id, categorieid, setconfirmprompt }) => {
    const dispatch = useDispatch()

    const language = useSelector(selectlanguage)
    const filenamesinchannel = useSelector(selectfilenamesinchannel)
    const imagenamesinchannel = useSelector(selectimagenamesinchannel)

    const [newname, setnewname] = useState(channel.channelname)
    const [newdesc, setnewdesc] = useState(channel.description)

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
        if (newname !== channel.channelname || newdesc !== channel.channeldesc) {
            if (newname.length < 1) return dispatch(setsnackbar({
                snackbar: {
                    open: true,
                    type: "error",
                    hu: "Azért ehhez meg kéne adni egy nevet is!",
                    en: "I think you should write a name first!"
                }
            }))
            db.collection("categories").doc(categorieid).collection("channels").doc(id).update({
                channelname: newname.replace(/\s/g, ''),
                description: newdesc || ""
            })
            dispatch(setChannelInfo({
                channelName: newname, channelId: id, categorieid: categorieid, channelDesc: newdesc
            }))
        }
        setdialog(false)
    }
    return (
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
                    <IconButton onClick={() => {
                        setconfirmprompt({
                            hu: "Biztosan törlöd a csatornát?",
                            en: "Are you sure you want to delete this channel?",
                            open: true,
                            enter: deletefunc
                        })
                    }} style={{ backgroundColor: "red", margin: "20px", color: "rgb(225, 225, 225)" }}>
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

    )
}

export default EditchannelDialog
