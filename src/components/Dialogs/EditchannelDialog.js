import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button, IconButton, Dialog, DialogContent, DialogTitle, DialogActions, Tooltip, Grow, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { selectfilenamesinchannel, selectimagenamesinchannel, selectlanguage, setChannelInfo, setfilenamesinchannel, setsnackbar } from '../../lib/AppSlice';
import db, { storage } from '../../lib/firebase'
import { selectUser } from '../../lib/userSlice';

const EditchannelDialog = ({ channel, dialog, setdialog, id, categorieid, setconfirmprompt }) => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    const language = useSelector(selectlanguage)
    const filenamesinchannel = useSelector(selectfilenamesinchannel)
    const imagenamesinchannel = useSelector(selectimagenamesinchannel)

    const [newname, setnewname] = useState(channel.channelname)
    const [newdesc, setnewdesc] = useState(channel.description)
    const [onlyMeCanWrite, setonlyMeCanWrite] = useState(false)


    const deletefunc = () => {
        if (user.uid !== channel.createdby) return dispatch(setsnackbar({
            snackbar: {
                open: true,
                type: "error",
                hu: "Nincs jogod ehhez!",
                en: "You are not authorized to do that!"
            }
        }))

        const docref = db.collection("categories").doc(categorieid).collection("channels").doc(id)

        filenamesinchannel.forEach(file => {
            let ref = storage.ref().child("files/" + file)
            ref.delete()
        })
        imagenamesinchannel.forEach(file => {
            let ref = storage.ref().child("images/" + file)
            ref.delete()
        })

        docref.collection("messages").get().then(res => res.forEach(el => el.ref.delete()))
        docref.delete()
        dispatch(
            setChannelInfo({
                channelId: null, channelName: null, categorieid: null, channelDesc: null
            }),
            setfilenamesinchannel({
                filenamesinchannel: [],
                imagenamesinchannel: []
            }),
            setsnackbar({
                snackbar: {
                    open: true,
                    type: "warning",
                    hu: "Csatorna sikeresen törölve!",
                    en: "Channel deleted!"
                }
            }))
    }

    const editfunc = async () => {
        if (user.uid !== channel.createdby) return dispatch(setsnackbar({
            snackbar: {
                open: true,
                type: "error",
                hu: "Nincs jogod ehhez!",
                en: "You are not authorized to do that!"
            }
        }))

        const docref = db.collection("categories").doc(categorieid).collection("channels").doc(id)
        if (newname !== channel.channelname || newdesc !== channel.channeldesc) {
            if (newname.length < 1) return dispatch(setsnackbar({
                snackbar: {
                    open: true,
                    type: "error",
                    hu: "Azért ehhez meg kéne adni egy nevet is!",
                    en: "I think you should write a name first!"
                }
            }))
            docref.update({
                channelname: newname.trim(),
                description: newdesc.trim() || ""
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
                {/* <h4 style={{ margin: "20px auto 5px auto", color: "gray" }}>Üzenetek küldése</h4>

                <FormControlLabel style={{ marginTop: "15px", fontWeight: "bold" }} control={
                    <Switch color="primary"
                        checked={onlyMeCanWrite} onChange={() => setonlyMeCanWrite(!onlyMeCanWrite)} />
                } label={onlyMeCanWrite ? ("Csak én") : ("Mindenki")} /> */}

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
