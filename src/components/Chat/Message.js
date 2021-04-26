import React, { useRef, useState } from "react";

import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DescriptionIcon from "@material-ui/icons/Description";
import { Button, IconButton, Tooltip, TextareaAutosize } from "@material-ui/core";

import { selectcategorieid, selectChannelId, selectlanguage, setsnackbar } from "../../lib/redux/AppSlice";
import db, { storage } from "../../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Userdialog from "../Dialogs/UserDialog";
import { selectUser } from "../../lib/redux/userSlice";
import DoneIcon from "@material-ui/icons/Done";
import firebase from "firebase/app";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import { motion } from "framer-motion";
import { messageAnimation } from "../Animation";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CustomAvatar from "../Misc/CustomAvatar";
import useUserData from "../../lib/hooks/useUserData";
import Video from "../Misc/Video";
import { getdays, geturl, messagetimefunc } from "../../lib/helpers/MessageHelper";
import MessageEditDialog from "../Dialogs/MessageEditDialog";

const Message = ({
    timestamp,
    userUid,
    message,
    imageurl,
    imagename,
    fileurl,
    filename,
    id,
    setlightbox,
    searched,
    edited,
    userData,
    hasCode,
    video,
}) => {
    const dispatch = useDispatch();

    const userloggedin = useSelector(selectUser);
    const channelid = useSelector(selectChannelId);
    const categorieid = useSelector(selectcategorieid);
    const language = useSelector(selectlanguage);
    const messageRef = useRef(null);

    const [dialog, setdialog] = useState({
        open: false,
        user: null,
    });
    const [confirmprompt, setconfirmprompt] = useState({
        en: null,
        hu: null,
        open: false,
        enter: null,
    });

    const [editpopper, seteditpopper] = useState(null);
    const [edit, setedit] = useState(false);
    const messageUser = useUserData(userData);
    const [newmessage, setnewmessage] = useState(message);

    let messagetime = new Date(timestamp?.toDate());

    const copy = () => {
        if (imageurl) {
            navigator.clipboard.writeText(imageurl);
        } else {
            navigator.clipboard.writeText(fileurl);
        }
        document.execCommand("copy");
        dispatch(
            setsnackbar({
                snackbar: {
                    open: true,
                    type: "info",
                    hu: "A link vágólapra másolva!",
                    en: "Link copied to clipboard!",
                },
            })
        );
    };

    const deletefunc = () => {
        if (userUid !== userloggedin.uid)
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

        if (imageurl) {
            let ref = storage.ref().child(`images/${imagename}`);
            ref.delete();
        }
        if (fileurl) {
            let ref = storage.ref().child(`files/${filename}`);
            ref.delete();
        }
        db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc(id).delete();
        dispatch(
            setsnackbar({
                snackbar: {
                    open: true,
                    type: "success",
                    hu: "Üzenet sikeresen törölve!",
                    en: "Message deleted!",
                },
            })
        );
    };

    const editfunc = () => {
        if (newmessage !== message) {
            if (newmessage.length > 0)
                db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc(id).update({
                    message: newmessage,
                    edited: firebase.firestore.FieldValue.serverTimestamp(),
                });
            else {
                if (fileurl || imageurl) {
                    db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc(id).update({
                        message: newmessage,
                        edited: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                } else setnewmessage(message);
            }
        }
        setedit(false);
    };
    return (
        <>
            <motion.div
                key={id}
                exit="exit"
                variants={messageAnimation}
                initial="initial"
                animate="animate"
                className={searched ? "message searched" : "message"}
            >
                <CustomAvatar
                    onClick={() => {
                        setdialog({
                            open: true,
                            user: messageUser,
                        });
                    }}
                    src={messageUser?.photoUrl}
                    alt="Avatar picture "
                    thisUser={messageUser}
                />
                <div className="message__info">
                    <h4 style={{ marginBottom: hasCode ? "5px" : "0" }}>
                        <span
                            onClick={() => {
                                setdialog({
                                    open: true,
                                    user: messageUser,
                                });
                            }}
                            className="name"
                        >
                            {messageUser?.newusername || messageUser?.displayname}
                        </span>
                        {timestamp && (
                            <span className="time">
                                {getdays(messagetime) === "Today"
                                    ? language === "hu"
                                        ? "Ma " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)
                                        : "Today " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)
                                    : getdays(messagetime) === "Yesterday"
                                    ? language === "hu"
                                        ? "Tegnap " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)
                                        : "Yesterday " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)
                                    : messagetime?.toLocaleString("hu-HU")}
                            </span>
                        )}
                        {edited && (
                            <Tooltip
                                placement="right"
                                arrow
                                title={
                                    <h3 style={{ fontWeight: "400" }}>
                                        {new Date(edited?.toDate()).toLocaleString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </h3>
                                }
                            >
                                <span className="edited">{language === "hu" ? "(szerkesztve)" : "(edited)"}</span>
                            </Tooltip>
                        )}
                    </h4>

                    {!edit ? (
                        Boolean(hasCode) ? (
                            <SyntaxHighlighter customStyle={{ borderRadius: "0.4rem" }} wrapLines={true} language={hasCode} style={vs2015}>
                                {message}
                            </SyntaxHighlighter>
                        ) : (
                            <>
                                <p>
                                    <span ref={messageRef}>
                                        {geturl(message) ? (
                                            <>
                                                {geturl(message)[1]}
                                                <a rel="noopener noreferrer" href={geturl(message)[0]} className="message__url" target="_blank">
                                                    {geturl(message)[0]}
                                                </a>
                                                {geturl(message)[2]}
                                            </>
                                        ) : (
                                            message
                                        )}
                                    </span>
                                </p>
                                {video && (
                                    <>
                                        <Video src={fileurl} title={message} />
                                    </>
                                )}
                            </>
                        )
                    ) : (
                        <>
                            <form className="message__edit" onSubmit={editfunc}>
                                <TextareaAutosize
                                    value={newmessage}
                                    onChange={(e) => {
                                        setnewmessage(e.target.value);
                                    }}
                                />
                                <IconButton type="submit" size="small">
                                    <DoneIcon />
                                </IconButton>
                            </form>
                        </>
                    )}

                    {imageurl && (
                        <img
                            alt="messageImage"
                            onClick={() =>
                                setlightbox({
                                    toggler: true,
                                    url: imageurl,
                                    user: messageUser?.newusername || messageUser?.displayname,
                                    timestamp: timestamp,
                                })
                            }
                            src={imageurl}
                        />
                    )}

                    {fileurl && !video && (
                        <>
                            <a href={fileurl} rel="noreferrer" target={filename.split(".").slice(-1)[0] === "pdf" ? "_blank" : undefined} download>
                                <Button className="message__button" variant="contained">
                                    {filename.split(".").slice(-1)[0] === "pdf" ? (
                                        <DescriptionIcon fontSize="small" style={{ marginRight: "5px" }} />
                                    ) : (
                                        <InsertDriveFileIcon fontSize="small" style={{ marginRight: "5px" }} />
                                    )}
                                    {filename.split("__")[0] + "." + filename.split(".").slice(-1)[0]}
                                </Button>
                            </a>
                            <Tooltip title={language === "hu" ? "Fájl URL másolása" : "Copy file URL"} placement="right">
                                <IconButton
                                    style={{
                                        background: "transparent",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    color="default"
                                    onClick={copy}
                                >
                                    <FileCopyIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </div>
                {userUid === userloggedin.uid && (
                    <div className="message__delicon">
                        <IconButton
                            onClick={(e) => {
                                seteditpopper(e.currentTarget);
                            }}
                        >
                            <MoreVertIcon style={{ color: "grey" }} />
                        </IconButton>
                    </div>
                )}
            </motion.div>

            <MessageEditDialog
                setedit={setedit}
                edit={edit}
                video={video}
                deletefunc={deletefunc}
                editpopper={editpopper}
                seteditpopper={seteditpopper}
                setconfirmprompt={setconfirmprompt}
            />

            <ConfirmDialog confirmprompt={confirmprompt} setconfirmprompt={setconfirmprompt} />

            <Userdialog categorieid={categorieid} channelid={channelid} dialog={dialog} setdialog={setdialog} />
        </>
    );
};

export default Message;
