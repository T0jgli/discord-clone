import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectlanguage } from "../../lib/redux/AppSlice";

import { MdClose } from "react-icons/md";
import Link from "@mui/material/Link";
import { IconButton, Dialog, DialogContent, DialogContentText, DialogTitle, Grow, Fade, Avatar } from "@mui/material";
import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import hu from "timeago.js/lib/lang/hu";
import db from "../../lib/firebase";
import { StyledBadge } from "../Misc/CustomAvatar";
import useThisUserOnline from "../../lib/hooks/useThisUserOnline";

function Userdialog({ dialog, setdialog, avatar, categorieid, channelid, sidebar }) {
    const language = useSelector(selectlanguage);
    const [counter, setcounter] = useState(0);
    const [runned, setrunned] = useState(false);
    const isOnlineUser = useThisUserOnline(dialog?.user);

    const lastlogintime = new Date(dialog?.user?.lastlogin?.toDate());

    const countfunc = () => {
        if (runned) return;

        setrunned(true);
        const cleanup = db
            .collection("categories")
            .doc(categorieid)
            .collection("channels")
            .doc(channelid)
            .collection("messages")
            .onSnapshot((snapshot) =>
                snapshot.docs.map((doc) => {
                    if (doc.data().userUid === dialog?.user?.id) {
                        setcounter((counter) => counter + 1);
                    }
                    return null;
                })
            );
        return () => cleanup();
    };

    useEffect(() => {
        timeago.register("hu", hu);
        if (dialog.open) {
            if (!avatar) return countfunc();
        }
    }, [dialog]);

    return (
        <Dialog TransitionComponent={Grow} open={dialog?.open} onClose={() => setdialog({ ...dialog, open: false })}>
            <DialogContent>
                {dialog?.user?.photoUrl || dialog?.user?.photo ? (
                    <img src={dialog?.user?.photoUrl || dialog?.user?.photo} alt="userphoto" />
                ) : (
                    <Avatar className="userdialog__myavatar" src={dialog?.user?.photo}>
                        {dialog?.user?.displayname.substring(0, 1)}
                    </Avatar>
                )}

                <DialogTitle>
                    <span style={{ fontWeight: "bold" }}>{dialog?.user?.newusername || dialog?.user?.displayname}</span>
                    <br />
                    {dialog?.user?.newusername && (
                        <Fade in>
                            <span>({dialog?.user?.displayname || dialog?.user?.newusername})</span>
                        </Fade>
                    )}
                </DialogTitle>
                <DialogContentText>
                    <Link href={"mailto: " + dialog?.user?.email} color="inherit">
                        {dialog?.user?.email}
                    </Link>
                    <br />
                    <br />
                    {!avatar &&
                        (language === "hu" ? (
                            <span>
                                Összes üzenete a csatornán: <span>{counter}</span>
                            </span>
                        ) : (
                            <span>
                                All messages on the channel: <span>{counter}</span>
                            </span>
                        ))}
                    {!avatar && <br />}
                    {!sidebar &&
                        (isOnlineUser ? (
                            <StyledBadge
                                color="secondary"
                                className="userdialog-badge"
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                variant="dot"
                                badgeContent=" "
                            >
                                <span
                                    style={{
                                        marginTop: "15px",
                                        padding: "0 14px",
                                        fontWeight: "bolder",
                                        display: "inline-block",
                                    }}
                                >
                                    {language === "hu" ? "Utoljára bejelentkezve: " : "Last login: "}
                                    <TimeAgo datetime={lastlogintime.toLocaleString("hu-HU")} locale={language === "hu" ? "hu" : "en"} />
                                </span>
                            </StyledBadge>
                        ) : (
                            <span
                                style={{
                                    marginTop: "15px",
                                    padding: "0 14px",
                                    fontWeight: "bolder",
                                    display: "inline-block",
                                }}
                            >
                                {language === "hu" ? "Utoljára bejelentkezve: " : "Last login: "}
                                <TimeAgo datetime={lastlogintime.toLocaleString("hu-HU")} locale={language === "hu" ? "hu" : "en"} />
                            </span>
                        ))}
                </DialogContentText>
                {avatar && (
                    <DialogContentText style={{ color: "gray", fontStyle: "italic" }}>Uid: #{dialog?.user?.uid.substring(0, 5)}</DialogContentText>
                )}
            </DialogContent>
            <div className="dialog__closeicon">
                <IconButton onClick={() => setdialog({ ...dialog, open: false })}>
                    <MdClose />
                </IconButton>
            </div>
        </Dialog>
    );
}

export default Userdialog;
