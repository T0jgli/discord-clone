import React, { useEffect, useState, useRef } from 'react'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip, Grow } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import AttachmentIcon from '@material-ui/icons/Attachment';
import ImageIcon from '@material-ui/icons/Image';

import { selectUser } from '../../lib/userSlice'
import {
    selectChannelId, selectChannelName, selectlanguage, setfilenamesinchannel, selectcategorieid,
    selectsidebarmobile, setsidebarmobile, setsnackbar
} from '../../lib/AppSlice'
import { useSelector, useDispatch } from 'react-redux'
import db, { storage } from '../../lib/firebase'
import firebase from "firebase/app"
import { Scrollbars } from 'react-custom-scrollbars';

import ChatHeader from "./ChatHeader"
import Message from './Message'
import Fslightboxes from "./Fslightboxes"
import Emoji from "./Emoji"
import { FileDrop } from 'react-file-drop'
import { formatBytes } from '../../lib/FormatBytes'
import { AnimatePresence, motion } from 'framer-motion';
import { messageAnimation } from '../Animation';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function replaceAt (string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

const Chat = () => {
    const dispatch = useDispatch()
    const hiddenFileInput = useRef(null);
    const chatMessageInput = useRef(null)

    const user = useSelector(selectUser)
    const language = useSelector(selectlanguage)
    const sidebarmobile = useSelector(selectsidebarmobile)
    const channelId = useSelector(selectChannelId)
    const categorieid = useSelector(selectcategorieid)
    const channelname = useSelector(selectChannelName)

    const classes = useStyles();

    const [input, setinput] = useState("");
    const [messages, setmessages] = useState([]);
    const [image, setimage] = useState(null);
    const [filedroptext, setfiledroptext] = useState(null);
    const [uploadvalue, setuploadvalue] = useState(0);

    const [loading, setloading] = useState(false)
    const [emojidialog, setemojidialog] = useState(false)
    const [searchtext, setsearchtext] = useState("")
    const [lightbox, setlightbox] = useState({
        toggler: false, url: null, user: null, timestamp: null
    })


    useEffect(() => {
        if (channelId) {
            if (window.innerWidth > 768) {
                chatMessageInput.current.focus()
            }
            const cleanup = db.collection("categories").doc(categorieid).collection("channels")
                .doc(channelId)
                .collection("messages")
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    setmessages(snapshot.docs.map(doc => doc.data()))
                })
            return () => cleanup()
        }


    }, [channelId, categorieid])

    useEffect(() => {
        if (messages.length > 0) {
            let tempfiles = []
            let tempimages = []
            messages.map(message => {
                if (message.filename) {
                    tempfiles.push(message.filename)
                }
                if (message.imagename) {
                    tempimages.push(message.imagename)
                }
                return null
            })

            dispatch(setfilenamesinchannel({ filenamesinchannel: tempfiles, imagenamesinchannel: tempimages }))
        }
        else dispatch(setfilenamesinchannel({ filenamesinchannel: [], imagenamesinchannel: [] }))

    }, [messages, dispatch])

    const sendmessage = () => {

        if (image) {
            const today = new Date().toLocaleString("hu-HU").replace(/\s/g, '').split('.').join("").split(':').join("")
            if (image.type.includes("image")) {
                setloading(true)
                const uploadtask = storage.ref(`images/${replaceAt(image.name, image?.name.toString().lastIndexOf("."), "__" + today + ".")}`).put(image);
                uploadtask.on("state_changed", snapshot => {
                    setuploadvalue((snapshot.bytesTransferred / image.size) * 100)
                }, error => console.log(error), async () => {
                    await storage.ref("images").child(replaceAt(image.name, image?.name.toString().lastIndexOf("."), "__" + today + ".")).getDownloadURL().then(url => {
                        let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelId).collection("messages").doc()
                        ref.set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: input,
                            user: user,
                            imageurl: url,
                            imagename: replaceAt(image.name, image?.name.toString().lastIndexOf("."), "__" + today + "."),
                            id: ref.id
                        })
                    })
                    setloading(false)
                })
            }
            else {
                setloading(true)
                const uploadtask = storage.ref(`files/${replaceAt(image.name, image?.name.toString().lastIndexOf("."), "__" + today + ".")}`).put(image)

                uploadtask.on("state_changed", snapshot => {
                    setuploadvalue((snapshot.bytesTransferred / image.size) * 100)
                }, error => console.log(error), async () => {
                    await storage.ref("files").child(replaceAt(image.name, image?.name.toString().lastIndexOf("."), "__" + today + ".")).getDownloadURL().then(url => {
                        let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelId).collection("messages").doc()
                        ref.set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: input,
                            user: user,
                            fileurl: url,
                            filename: replaceAt(image.name, image?.name.toString().lastIndexOf("."), "__" + today + "."),
                            id: ref.id
                        })
                    })
                    setloading(false)
                })
            }

        }
        else {
            let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelId).collection("messages").doc()
            ref.set({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user,
                id: ref.id
            })

        }
        setimage(null)
        setinput("");
    }
    let vane = false;
    return (
        <>
            {emojidialog && (
                <Emoji fade={emojidialog} input={input} setinput={setinput} setemojidialog={setemojidialog} />
            )}

            <div className="chat" onClick={() => {
                if (!sidebarmobile && window.innerWidth < 768)
                    dispatch(setsidebarmobile({
                        sidebarmobile: true
                    }))
            }}>
                {loading && (
                    <Backdrop className={classes.backdrop} open={loading}>
                        <CircularProgress color="inherit" variant="static" value={uploadvalue} />
                    </Backdrop>
                )}
                <ChatHeader searchtext={searchtext} setsearchtext={setsearchtext} />
                <Scrollbars renderThumbVertical={props => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}>
                    <div className="chat__messages" id="messages">
                        <AnimatePresence>
                            {messages.length > 0 && messages.map((message, index) => {
                                if (searchtext) {
                                    if (
                                        message?.message.toString().toLowerCase().includes(searchtext.toString().toLowerCase()) ||
                                        message?.user.displayname.toLowerCase().includes(searchtext.toString().toLowerCase()) ||
                                        message?.imagename?.toString().toLowerCase().includes(searchtext.toString().toLowerCase()) ||
                                        message?.filename?.toString().toLowerCase().includes(searchtext.toString().toLowerCase())
                                    ) {
                                        vane = true
                                        return (
                                            <Message setlightbox={setlightbox} filename={message.filename} fileurl={message.fileurl}
                                                id={message.id}
                                                edited={message.edited}
                                                imageurl={message.imageurl} key={message.id} message={message.message}
                                                timestamp={message.timestamp} user={message.user} imagename={message.imagename}
                                                searched
                                            />
                                        )
                                    }
                                    else {
                                        if (index + 1 === messages.length && !vane) {
                                            return (
                                                <motion.div exit="exit" variants={messageAnimation} initial="initial" animate="animate"
                                                    key="notfound" className="search__notfound" onClick={() => setsearchtext("")}>
                                                    <p>{language === "hu" ? ("Nincs találat") : ("No result")}</p>
                                                </motion.div>
                                            )
                                        }
                                        else return null
                                    }

                                }
                                else
                                    return (
                                        <Message setlightbox={setlightbox} filename={message.filename} fileurl={message.fileurl}
                                            id={message.id}
                                            edited={message.edited}
                                            imageurl={message.imageurl} key={message.id} message={message.message}
                                            timestamp={message.timestamp} user={message.user} imagename={message.imagename}
                                        />

                                    )
                            })}

                        </AnimatePresence>
                    </div>
                    <div style={{ overflowX: "hidden" }}></div>
                </Scrollbars>
                {image && (
                    <Grow in={Boolean(image)}>
                        <div className="chat__filediv">
                            <Tooltip title={image.name}>
                                {image?.type.includes("image") ? (
                                    <ImageIcon style={{ cursor: "default" }} />
                                ) : (<AttachmentIcon style={{ cursor: "default" }} />)}
                            </Tooltip>
                            <Tooltip title={language === "hu" ? ("Fájl törlése") : ("Delete file")} placement="right">
                                <IconButton onClick={() => {
                                    setimage(null)
                                    dispatch(setsnackbar({
                                        snackbar: {
                                            open: true,
                                            type: "info",
                                            hu: `${image?.type.includes("image") ? ("Fénykép") : ("Fájl")} törölve.`,
                                            en: `${image?.type.includes("image") ? ("Photo") : ("File")} deleted.`
                                        }
                                    }))

                                }}>
                                    <DeleteIcon style={{ color: "lightgray" }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Grow>
                )}

                <FileDrop
                    onDragOver={(file) => setfiledroptext(language === "en" ? ("Drop the file here to upload!") : ("Húzza ide a fájlt a feltöltéshez!"))}
                    onDragLeave={() => setfiledroptext(null)}
                    onDrop={(file) => {
                        if (channelId) {
                            setimage(file[0])
                            setfiledroptext(null)
                        }
                    }}
                >
                    <div className="chat__input">
                        <Tooltip title={language === "hu" ? image ? ("Fájl lecserélése") : ("Fájl hozzáadása") : image ? ("Replace file") : ("Add file")}
                            disableHoverListener={!channelId}
                            disableFocusListener={!channelId}
                            disableTouchListener={!channelId}
                            placement="top"
                        >
                            <AddCircleIcon style={{ marginLeft: "5px" }} className={channelId ? ("chat__inputfilebutton") : ("chat__disabledsendbtn")}
                                fontSize="large" onClick={() => hiddenFileInput.current.click()} />
                        </Tooltip>
                        <form onSubmit={(e) => { e.preventDefault(); if (input || image) { sendmessage() } }}>
                            <input aria-label={language === "en" ? ("Chat message input") : ("Chat beviteli mező")}
                                value={input} autoFocus ref={chatMessageInput}
                                type="text"
                                onPaste={(e) => {
                                    if (e.clipboardData.files[0] && window.innerWidth > 768)
                                        if (e.clipboardData.files[0].size < 52428800) {
                                            setimage(e.clipboardData.files[0])
                                        }
                                        else
                                            dispatch(setsnackbar({
                                                snackbar: {
                                                    open: true,
                                                    type: "error",
                                                    filesizeerror: true,
                                                    hu: `A fájl mérete ${formatBytes(e.clipboardData.files[0].size)}, amely meghaladja a maximális méretet! (50 MB)`,
                                                    en: `File size is ${formatBytes(e.clipboardData.files[0].size)}, which exceeds the maximum size! (50 MB)`,
                                                }
                                            }))
                                }}
                                placeholder={filedroptext ? (filedroptext) : image ? (image.name) : channelId ?
                                    language === "hu" ? ("Üzenet: #" + channelname) : ("Message: #" + channelname) :
                                    language === "hu" ? ("Válassz csatornát") : ("Select a channel")}
                                disabled={!channelId} onChange={(e) => setinput(e.target.value)} />
                            <input disabled={!channelId} type="file"
                                ref={hiddenFileInput} onChange={(e) => {
                                    if (e.target.files[0]) {
                                        if (e.target.files[0]?.size < 52428800) {
                                            setimage(e.target.files[0])
                                        }
                                        else
                                            dispatch(setsnackbar({
                                                snackbar: {
                                                    open: true,
                                                    type: "error",
                                                    filesizeerror: true,
                                                    hu: `A fájl mérete ${formatBytes(e.target.files[0].size)}, amely meghaladja a maximális méretet! (50 MB)`,
                                                    en: `File size is ${formatBytes(e.target.files[0].size)}, which exceeds the maximum size! (50 MB)`,
                                                }
                                            }))
                                    }

                                }} style={{ display: "none" }} />
                        </form>
                        <div className="chat__inputicons">
                            <SendRoundedIcon className={input || image ? "" : ("chat__disabledsendbtn")}
                                onClick={(e) => { if (input || image) { sendmessage() } }} />
                            <EmojiEmotionsIcon className={channelname ? "" : ("chat__disabledsendbtn")}
                                fontSize="large" onClick={() => { if (channelId) setemojidialog(true) }} />
                        </div>
                    </div>
                </FileDrop>
            </div>

            <Fslightboxes channelname={channelname} lightbox={lightbox} setlightbox={setlightbox} />
        </>
    )
}

export default Chat
