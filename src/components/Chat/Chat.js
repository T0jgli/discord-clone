import React, { useEffect, useState } from 'react'
import "./Chat.css"

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

import { selectUser } from '../../features/userSlice'
import { selectChannelId, selectChannelName, selectfocus, selectlanguage, selectuploadvalue, setuploadvalue, setfilenamesinchannel, selectcategorieid, selectsidebarmobile, setsidebarmobile } from '../../features/AppSlice'
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
import { FileDrop } from 'react-file-drop'

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
    const sidebarmobile = useSelector(selectsidebarmobile)
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
    const [filedelete, setfiledelete] = useState({
        prompt: false,
        type: ""
    })

    const [emojidialog, setemojidialog] = useState(false)
    const [copystate, setcopystate] = useState(false)

    const [delmessagesuccess, setdelmessagesuccess] = useState(false)
    const [searchtext, setsearchtext] = useState("")
    const [lightbox, setlightbox] = useState({
        toggler: false, url: null, user: null, timestamp: null
    })
    const [filesizeerror, setfilesizeerror] = useState({
        prompt: false,
        size: null
    })
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

    const sendmessage = () => {
        if (image) {
            if (image.type.includes("image")) {
                setloading(true)
                const uploadtask = storage.ref(`images/${image.name.replace(".", "__" + todaysdate + ".")}`).put(image);
                uploadtask.on("state_changed", snapshot => {
                    dispatch(setuploadvalue({ uploadvalue: (snapshot.bytesTransferred / image.size) * 100 }))
                }, error => console.log(error), () => {
                    storage.ref("images").child(image.name.replace(".", "__" + todaysdate + ".")).getDownloadURL().then(url => {
                        let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc()
                        ref.set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: input,
                            user: user,
                            imageurl: url,
                            imagename: image.name.replace(".", "__" + todaysdate + "."),
                            id: ref.id
                        })
                    }).then(() => setloading(false))
                })
            }
            else {
                setloading(true)
                const uploadtask = storage.ref(`files/${image.name.replace(".", "__" + todaysdate + ".")}`).put(image)

                uploadtask.on("state_changed", snapshot => {
                    dispatch(setuploadvalue({ uploadvalue: (snapshot.bytesTransferred / image.size) * 100 }))
                }, error => console.log(error), () => {
                    storage.ref("files").child(image.name.replace(".", "__" + todaysdate + ".")).getDownloadURL().then(url => {
                        let ref = db.collection("categories").doc(categorieid).collection("channels").doc(channelid).collection("messages").doc()
                        ref.set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: input,
                            user: user,
                            fileurl: url,
                            filename: image.name.replace(".", "__" + todaysdate + "."),
                            id: ref.id
                        })
                    }).then(() => setloading(false))
                })
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
    let vane = false;

    return (
        <>
            {emojidialog && (
                <Emoji fade={emojidialog} input={input} setinput={setinput} />
            )}

            <div className="chat" onClick={() => {
                if (emojidialog)
                    setemojidialog(false)
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
                <ChatHeader searchtext={searchtext} setsearchtext={setsearchtext} channelname={channelname} />
                <Scrollbars renderThumbVertical={props => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}>
                    <div className="chat__messages" id="messages">
                        <FlipMove enterAnimation="fade" leaveAnimation="none">
                            {messages.map((message, index) => {
                                if (searchtext) {
                                    if (
                                        message?.message.includes(searchtext.toString().toLowerCase()) ||
                                        message?.user.displayname.toLowerCase().includes(searchtext.toString().toLowerCase()) ||
                                        message?.imagename?.toString().toLowerCase().includes(searchtext.toString().toLowerCase()) ||
                                        message?.filename?.toString().toLowerCase().includes(searchtext.toString().toLowerCase())
                                    ) {
                                        vane = true
                                        return (
                                            <Message setcopystate={setcopystate} setlightbox={setlightbox} filename={message.filename} fileurl={message.fileurl}
                                                id={message.id} setdelmessagesuccess={setdelmessagesuccess}
                                                imageurl={message.imageurl} key={message.timestamp} message={message.message}
                                                timestamp={message.timestamp} user={message.user} imagename={message.imagename}
                                                searched
                                            />
                                        )
                                    }
                                    else {
                                        if (index + 1 === messages.length && !vane) {
                                            return (
                                                <div className="search__notfound" onClick={() => setsearchtext("")}>
                                                    <p>{language === "hu" ? ("Nincs találat") : ("No result")}</p>
                                                </div>
                                            )
                                        }
                                        else return null
                                    }

                                }
                                else
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
                {image && (
                    <Grow in={image}>
                        <div className="chat__filediv">
                            <Tooltip title={image.name}>
                                {image?.type.includes("image") ? (
                                    <ImageIcon />
                                ) : (<AttachmentIcon />)}
                            </Tooltip>
                            <Tooltip title={language === "hu" ? ("Fájl törlése") : ("Delete file")} placement="right">
                                <IconButton onClick={() => {
                                    setimage(null)
                                    setfiledelete({
                                        prompt: true,
                                        type: language === "hu" ? image?.type.includes("image") ? ("Fénykép") : ("Fájl") : image?.type.includes("image") ? ("Photo") : ("File")
                                    })
                                }}>
                                    <DeleteIcon style={{ color: "lightgray" }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Grow>
                )}

                <FileDrop onDrop={(file) => setimage(file[0])}>
                    <div className="chat__input">
                        <Tooltip title={language === "hu" ? image ? ("Fájl lecserélése") : ("Fájl hozzáadása") : image ? ("Replace file") : ("Add file")}
                            disableHoverListener={!channelid}
                            disableFocusListener={!channelid}
                            disableTouchListener={!channelid}
                            placement="top"
                        >
                            <AddCircleIcon className={channelid ? ("chat__inputfilebutton") : ("")} fontSize="large" onClick={() => hiddenFileInput.current.click()} />
                        </Tooltip>
                        <form onSubmit={(e) => { e.preventDefault(); if (input || image) { sendmessage() } }}>
                            <input value={input} ref={chatmessage}
                                placeholder={image ? (image.name) : channelid ? language === "hu" ? ("Üzenet: #" + channelname) : ("Message: #" + channelname) :
                                    language === "hu" ? ("Válassz csatornát") : ("Select a channel")}
                                disabled={!channelid} onChange={(e) => setinput(e.target.value)} />
                            <input disabled={!channelid} type="file"
                                ref={hiddenFileInput} onChange={(e) => {
                                    if (e.target.files[0]) {
                                        if (e.target.files[0].size < 52428800) {
                                            setimage(e.target.files[0])
                                        }
                                        else
                                            setfilesizeerror({
                                                prompt: true,
                                                size: e.target.files[0].size
                                            })
                                    }

                                }} style={{ display: "none" }} />
                        </form>
                        <div className="chat__inputicons">
                            <SendRoundedIcon className={input || image ? "" : ("chat__disabledsendbtn")}
                                onClick={(e) => { if (input || image) { sendmessage() } }} />
                            <EmojiEmotionsIcon fontSize="large" onClick={() => { if (channelid) setemojidialog(true) }} />
                        </div>
                    </div>
                </FileDrop>
            </div>
            <Snackbars filedelete={filedelete} setfiledelete={setfiledelete}
                delmessagesuccess={delmessagesuccess} setdelmessagesuccess={setdelmessagesuccess} copystate={copystate} setcopystate={setcopystate}
                setfilesizeerror={setfilesizeerror} filesizeerror={filesizeerror} />
            <Fslightboxes channelname={channelname} lightbox={lightbox} setlightbox={setlightbox} />
        </>
    )
}

export default Chat
