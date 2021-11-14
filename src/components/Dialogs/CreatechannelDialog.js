import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grow, TextField } from "@mui/material";
import { MdArrowDropDown } from "react-icons/md";
import db from "../../lib/firebase";
import { selectlanguage, setChannelInfo, setsnackbar } from "../../lib/redux/AppSlice";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/app";
import { selectUser } from "../../lib/redux/userSlice";

const CreatechannelDialog = ({ promptstate, setpromptstate, categorieid, onlyMeCanCreateChannel, createdby }) => {
    const dispatch = useDispatch();
    const [channelname, setchannelname] = useState("");
    const [channeldesc, setchanneldesc] = useState("");
    const user = useSelector(selectUser);

    const language = useSelector(selectlanguage);

    const handleaddchannel = () => {
        if (!channelname)
            return dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "error",
                        hu: "Azért ehhez meg kéne adni egy nevet is!",
                        en: "I think you should write a name first!",
                    },
                })
            );

        if (onlyMeCanCreateChannel && user.uid !== createdby)
            return dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "error",
                        hu: "Nincs jogod ehhez!",
                        en: "You are not authorized to do that!",
                    },
                })
            );

        db.collection("categories")
            .doc(categorieid)
            .collection("channels")
            .add({
                channelname: channelname.trim(),
                description: channeldesc,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                createdby: user.uid,
            })
            .then((e) => {
                dispatch(
                    setChannelInfo({
                        channelId: e.id,
                        channelName: channelname.trim(),
                        channelDesc: channeldesc,
                        categorieid: categorieid,
                    })
                );
                setchannelname("");
                setchanneldesc("");
                dispatch(
                    setsnackbar({
                        snackbar: {
                            open: true,
                            type: "success",
                            hu: "Csatorna létrehozva!",
                            en: "Channel created!",
                        },
                    })
                );
                setpromptstate(false);
            });
    };

    return (
        <Dialog
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleaddchannel();
                }
                if (e.key === "Escape") {
                    setpromptstate(false);
                }
            }}
            TransitionComponent={Grow}
            open={promptstate}
            onClose={() => setpromptstate(false)}
        >
            <DialogContent>
                <DialogTitle style={{ margin: "5px" }}>{language === "hu" ? "Csatorna létrehozása" : "Create a channel!"}</DialogTitle>
                <MdArrowDropDown />
                <form
                    style={{ margin: "10px" }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleaddchannel(channelname);
                    }}
                >
                    <TextField
                        variant="filled"
                        autoFocus={window.innerWidth < 768 ? false : true}
                        value={channelname}
                        fullWidth
                        onChange={(e) => setchannelname(e.target.value)}
                        label={language === "hu" ? "Név" : "Name"}
                    />
                    <TextField
                        variant="filled"
                        style={{ marginTop: "30px" }}
                        value={channeldesc}
                        fullWidth
                        onChange={(e) => setchanneldesc(e.target.value)}
                        label={language === "hu" ? "Leírás" : "Description"}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }} onClick={() => setpromptstate(false)}>
                    {language === "hu" ? "Mégse" : "Cancel"}
                </Button>
                <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }} onClick={() => handleaddchannel()}>
                    {language === "hu" ? "Létrehoz" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatechannelDialog;
