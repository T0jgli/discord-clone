import React, { useRef, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    Grow,
    Avatar,
    makeStyles,
    Backdrop,
    CircularProgress,
} from "@material-ui/core";
import { selectlanguage, setsnackbar } from "../../lib/redux/AppSlice";
import { selectUser } from "../../lib/redux/userSlice";
import db, { storage } from "../../lib/firebase";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import firebase from "firebase/app";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import ImageResizer from "../../lib/helpers/ImageResizer";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

const SettingsDialog = ({ setsettingsdialog, settingsdialog, setconfirmprompt }) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const photoChangeRef = useRef(null);
    const language = useSelector(selectlanguage);
    const user = useSelector(selectUser);
    const [newusername, setnewusername] = useState(user.displayname);
    const [newimage, setnewimage] = useState(null);
    const [uploadvalue, setuploadvalue] = useState(0);
    const [loading, setloading] = useState(false);

    const u = firebase.auth().currentUser;

    const handleeditusernamedone = async () => {
        if (newimage) {
            const uploadtask = storage.ref(`profilePictures/${user.email}__currentPhoto`).put(newimage);
            setloading(true);
            uploadtask.on(
                "state_changed",
                (snapshot) => {
                    setuploadvalue((snapshot.bytesTransferred / newimage.size) * 100);
                },
                (error) => console.log(error),
                async () => {
                    setloading(false);
                    const newPhotoUrl = await storage.ref(`profilePictures/${user.email}__currentPhoto`).getDownloadURL();
                    db.collection("users").doc(user.uid).update({
                        photoUrl: newPhotoUrl,
                    });
                    u.updateProfile({
                        photoURL: newPhotoUrl,
                    });
                    if (newusername === user.displayname || !newusername) window.location.reload(false);
                }
            );
        }
        if (!newusername) {
            setnewusername(user.displayname);
            return dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "error",
                        hu: "Nem kéne név nélkül részt venni a rendezvényen",
                        en: "I don't think you should do this without a name",
                    },
                })
            );
        }
        if (newusername !== user.displayname) {
            try {
                await u.updateProfile({
                    displayName: newusername.replace(/\s\s+/g, " "),
                });
                await db
                    .collection("users")
                    .doc(user.uid)
                    .update({
                        newusername: newusername.replace(/\s\s+/g, " "),
                    });
                window.location.reload(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handledeleteuser = async () => {
        try {
            await db.collection("users").doc(user.uid).delete();
            await u.delete();
            window.close();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {loading && (
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" variant="determinate" value={uploadvalue} />
                </Backdrop>
            )}

            <Dialog TransitionComponent={Grow} open={settingsdialog} onClose={() => setsettingsdialog(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "5px" }}>{language === "hu" ? "Beállítások" : "Settings"}</DialogTitle>
                    <ArrowDropDownIcon />
                    <div className="settingsdialog__avatardiv">
                        <img src={newimage ? URL.createObjectURL(newimage) : user.photo} className="settingsdialog__avatar" />
                        <div className="editicon">
                            <EditIcon onClick={() => photoChangeRef.current.click()} />
                        </div>

                        <input
                            type="file"
                            ref={photoChangeRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                                if (e.target.files[0]) {
                                    if (!e.target.files[0].type.includes("image"))
                                        return dispatch(
                                            setsnackbar({
                                                snackbar: {
                                                    open: true,
                                                    type: "error",
                                                    filesizeerror: true,
                                                    hu: `Csak kép lehet a profilképed`,
                                                    en: `Your profile picture should be a picture`,
                                                },
                                            })
                                        );
                                    if (e.target.files[0]?.size < 52428800) {
                                        const img = await ImageResizer(e.target.files[0]);
                                        setnewimage(img);
                                    } else
                                        dispatch(
                                            setsnackbar({
                                                snackbar: {
                                                    open: true,
                                                    type: "error",
                                                    filesizeerror: true,
                                                    hu: `A fotó mérete ${formatBytes(
                                                        e.target.files[0].size
                                                    )}, amely meghaladja a maximális méretet! (50 MB)`,
                                                    en: `Photo size is ${formatBytes(
                                                        e.target.files[0].size
                                                    )}, which exceeds the maximum size! (50 MB)`,
                                                },
                                            })
                                        );
                                }
                            }}
                        />
                    </div>
                    <form
                        style={{ marginTop: "20px" }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleeditusernamedone();
                            setsettingsdialog(false);
                        }}
                    >
                        <TextField
                            label={language === "hu" ? "Felhasználónév" : "Username"}
                            variant="outlined"
                            value={newusername}
                            onChange={(e) => {
                                setnewusername(e.target.value);
                            }}
                        />
                    </form>
                    <br />
                    <Tooltip title={language === "hu" ? "Fiók törlése" : "Delete account"}>
                        <IconButton
                            onClick={() => {
                                setconfirmprompt({
                                    en: "Are you sure you want to delete this user account?",
                                    hu: "Biztosan törlöd a felhasználói fiókot?",
                                    open: true,
                                    enter: handledeleteuser,
                                });
                            }}
                            style={{
                                backgroundColor: "red",
                                margin: "20px",
                                color: "rgb(225, 225, 225)",
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }} onClick={() => setsettingsdialog(false)}>
                        {language === "hu" ? "Mégse" : "Cancel"}
                    </Button>

                    <Button
                        style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => {
                            handleeditusernamedone();
                            setsettingsdialog(false);
                        }}
                    >
                        {language === "hu" ? "Kész" : "Done"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SettingsDialog;
