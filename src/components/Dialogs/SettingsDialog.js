import React, { useState } from 'react'
import {
    Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField,
    IconButton, Tooltip, Grow
} from '@material-ui/core'
import { selectlanguage, setsnackbar } from '../../lib/AppSlice'
import { selectUser } from '../../lib/userSlice'
import db from '../../lib/firebase'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from "firebase/app"
import { useDispatch, useSelector } from 'react-redux'

const SettingsDialog = ({ setsettingsdialog, settingsdialog, setconfirmprompt }) => {
    const dispatch = useDispatch()
    const language = useSelector(selectlanguage)
    const user = useSelector(selectUser)
    const [newusername, setnewusername] = useState(user.displayname)

    const u = firebase.auth().currentUser

    const handleeditusernamedone = async () => {
        if (!newusername) {
            setnewusername(user.displayname)
            return dispatch(setsnackbar({
                snackbar: {
                    open: true,
                    type: "error",
                    hu: "Nem kéne név nélkül részt venni a rendezvényen",
                    en: "I don't think you should do this without a name"
                }
            }))
        }
        if (newusername !== user.displayname) {
            try {
                await u.updateProfile({
                    displayName: newusername.replace(/\s\s+/g, ' ')
                })
                await db.collection("users").doc(user.uid).update({
                    newusername: newusername.replace(/\s\s+/g, ' ')
                })
                window.location.reload(false)
            } catch (error) {
                console.error(error)
            }
        }
    }


    const handledeleteuser = async () => {
        try {
            await db.collection("users").doc(user.uid).delete()
            await u.delete()
            window.close()

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog TransitionComponent={Grow} open={settingsdialog} onClose={() => setsettingsdialog(false)}>
            <DialogContent>
                <DialogTitle style={{ margin: "5px" }}>
                    {language === "hu" ? ("Beállítások") : ("Settings")}
                </DialogTitle>
                <ArrowDropDownIcon />
                <form style={{ marginTop: "20px" }} onSubmit={(e) => { e.preventDefault(); handleeditusernamedone(); setsettingsdialog(false) }}>
                    <TextField label={language === "hu" ? ("Felhasználónév") : ("Username")}
                        variant="outlined" value={newusername} onChange={(e) => { setnewusername(e.target.value) }} />
                </form>
                <br />
                <Tooltip title={language === "hu" ? ("Fiók törlése") : ("Delete account")}>
                    <IconButton onClick={() => {
                        setconfirmprompt({
                            en: "Are you sure you want to delete this user account?",
                            hu: "Biztosan törlöd a felhasználói fiókot?",
                            open: true,
                            enter: handledeleteuser,
                        })
                    }} style={{ backgroundColor: "red", margin: "20px", color: "rgb(225, 225, 225)" }}>
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

    )
}

export default SettingsDialog
