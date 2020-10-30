import React, { useEffect, useState } from 'react'
import "./Chat.css"

import AddCircleIcon from '@material-ui/icons/AddCircle'
import GifIcon from '@material-ui/icons/Gif'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Fade, Tooltip } from '@material-ui/core'

import { selectUser } from '../../features/userSlice'
import { selectChannelId, selectChannelName, selectfocus, selectlanguage, selectuploadvalue, setuploadvalue, setfilenamesinchannel, selectcategorieid } from '../../features/AppSlice'
import { useSelector, useDispatch } from 'react-redux'
import db, { storage } from '../../firebase/firebase'
import firebase from "firebase/app"
import { Scrollbars } from 'react-custom-scrollbars';
import FlipMove from 'react-flip-move';

import ChatHeader from "./ChatHeader"
import Message from './Message'
import Snackbars from '../Snackbars'
import Fslightboxes from "./Fslightboxes"
import Emoji from "./Emoji"

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Chat = () => {
    const hiddenFileInput = React.useRef(null);
    const chatmessage = React.useRef(null)
    const endchat = React.useRef(null)
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const language = useSelector(selectlanguage)
    const channelid = useSelector(selectChannelId)
    const categorieid = useSelector(selectcategorieid)

    const channelname = useSelector(selectChannelName)
    const focus = useSelector(selectfocus)
    const uploadvalue = useSelector(selectuploadvalue)
    const classes = useStyles();

    const [input, setinput] = useState("");
    const [messages, setmessages] = useState([]);
    const [image, setimage] = useState(null);
    const [loading, setloading] = useState(false)
    const [emojidialog, setemojidialog] = useState(false)
    const [copystate, setcopystate] = useState(false)
    const [delmessagesuccess, setdelmessagesuccess] = useState(false)
    const [lightbox, setlightbox] = useState({
        toggler: false, url: null, user: null, timestamp: null
    })
    const [filesizeerror, setfilesizeerror] = useState(false)
    const todaysdate = new Date().toLocaleString("hu-HU").replace(/\s/g, '').split('.').join("").split(':').join("")

    useEffect(() => {
        if (channelid) {
            db.collection("categories").doc(categorieid).collection("channels")
                .doc(channelid)
                .collection("messages")
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot =>
                    setmessages(snapshot.docs.map(doc => doc.data())))
            if (focus) {
                chatmessage.current.focus()
            }
        }
    }, [channelid, categorieid, focus])
    useEffect(() => {
        if (channelname) {
            if (focus) {
                chatmessage.current.focus()
            }
        }
    }, [channelname, focus])

    useEffect(() => {
        if (messages) {
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

    }, [messages, dispatch])

    const sendmessage = e => {
        if (image) {
            if (image.size > 52428800) {
                setfilesizeerror(true)
                setimage(null)
            } else {
                if (image.type.includes("image")) {
                    setloading(true)
                    const uploadtask = storage.ref(`images/${image.name + "__" + todaysdate}`).put(image);
                    uploadtask.on("state_changed", snapshot => {
                        dispatch(setuploadvalue({ uploadvalue: (snapshot.bytesTransferred / image.size) * 100 }))
                    }, error => console.log(error), () => {
                        storage.ref("images").child(image.name + "__" + todaysdate).getDownloadURL().then(url => {
                            let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc()
                            ref.set({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                message: input,
                                user: user,
                                imageurl: url,
                                imagename: image.name + "__" + todaysdate,
                                id: ref.id
                            })
                        }).then(() => setloading(false))
                    })
                }
                else {
                    setloading(true)
                    const uploadtask = storage.ref(`files/${image.name + "__" + todaysdate}`).put(image)

                    uploadtask.on("state_changed", snapshot => {
                        dispatch(setuploadvalue({ uploadvalue: (snapshot.bytesTransferred / image.size) * 100 }))
                    }, error => console.log(error), () => {
                        storage.ref("files").child(image.name + "__" + todaysdate).getDownloadURL().then(url => {
                            let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc()
                            ref.set({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                message: input,
                                user: user,
                                fileurl: url,
                                filename: image.name + "__" + todaysdate,
                                id: ref.id
                            })
                        }).then(() => setloading(false))
                    })
                }
            }
        }
        else {
            let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc()
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
    return (
        <>
            {emojidialog && (
                <Emoji fade={emojidialog} input={input} setinput={setinput} />

            )}

            <div className="chat" onClick={() => { if (emojidialog) setemojidialog(false) }}>
                {loading && (
                    <Backdrop className={classes.backdrop} open={loading}>
                        <CircularProgress color="inherit" variant="static" value={uploadvalue} />
                    </Backdrop>
                )}
                <ChatHeader channelname={channelname} />
                <Scrollbars renderThumbVertical={props => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}>
                    <div className="chat__messages" id="messages">
                        <FlipMove enterAnimation="fade" leaveAnimation="none">
                            {messages.map(message => {
                                return (
                                    <Message setcopystate={setcopystate} setlightbox={setlightbox} filename={message.filename} fileurl={message.fileurl}
                                        id={message.id} setdelmessagesuccess={setdelmessagesuccess}
                                        imageurl={message.imageurl} key={message.timestamp} message={message.message}
                                        timestamp={message.timestamp} user={message.user} imagename={message.imagename}
                                    />
                                )
                            })}
                        </FlipMove>
                    </div>
                    <div ref={endchat} style={{ overflowX: "hidden" }}></div>
                </Scrollbars>
                <div className="chat__input">
                    <Tooltip title={language === "hu" ? ("Fájl hozzáadása") : ("Add file")}
                        disableHoverListener={!channelid}
                        disableFocusListener={!channelid}
                        disableTouchListener={!channelid}
                        placement="top"
                    >
                        <AddCircleIcon className={channelid ? ("chat__inputfilebutton") : ("")} fontSize="large" onClick={() => hiddenFileInput.current.click()} />
                    </Tooltip>
                    <form onSubmit={(e) => { e.preventDefault(); if (input || image) { sendmessage(e) } }}>
                        <input value={input} ref={chatmessage}
                            placeholder={image ? (image.name) : channelid ? language === "hu" ? ("Üzenet: #" + channelname) : ("Message: #" + channelname) :
                                language === "hu" ? ("Válassz csatornát") : ("Select a channel")}
                            disabled={!channelid} onChange={(e) => setinput(e.target.value)} />
                        <input disabled={!channelid} type="file"
                            ref={hiddenFileInput} onChange={(e) => { if (e.target.files[0]) { setimage(e.target.files[0]) } }} style={{ display: "none" }} />
                    </form>
                    <div className="chat__inputicons">
                        <GifIcon fontSize="large" />
                        <EmojiEmotionsIcon fontSize="large" onClick={() => { if (channelid) setemojidialog(true) }} />
                    </div>
                </div>
            </div>
            <Snackbars delmessagesuccess={delmessagesuccess} setdelmessagesuccess={setdelmessagesuccess} copystate={copystate} setcopystate={setcopystate}
                filesize={image?.size} setfilesizeerror={setfilesizeerror} filesizeerror={filesizeerror} />
            <Fslightboxes channelname={channelname} lightbox={lightbox} setlightbox={setlightbox} />
        </>
    )
}

export default Chat
