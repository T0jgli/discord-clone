import AddCircleIcon from '@material-ui/icons/AddCircle'
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
import GifIcon from '@material-ui/icons/Gif'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'

import React, { useEffect, useState } from 'react'
import "./Chat.css"
import ChatHeader from "./ChatHeader"
import Message from './Message'
import { selectUser } from '../../features/userSlice'
import { selectChannelId, selectChannelName } from '../../features/AppSlice'
import { useSelector } from 'react-redux'
import db, { storage } from '../../firebase/firebase'
import firebase from "firebase/app"
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Scrollbars } from 'react-custom-scrollbars';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Chat({ language }) {
    const user = useSelector(selectUser)
    const channelid = useSelector(selectChannelId)
    const channelname = useSelector(selectChannelName)
    const [input, setinput] = useState("");
    const [messages, setmessages] = useState([]);
    const [image, setimage] = useState(null);
    const hiddenFileInput = React.useRef(null);
    const [loading, setloading] = useState(false)
    const classes = useStyles();

    useEffect(() => {
        if (channelid) {

            db.collection("channels")
                .doc(channelid)
                .collection("messages")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) =>
                    setmessages(snapshot.docs.map((doc) => doc.data()))
                );
        }

    }, [channelid])

    const sendmessage = e => {
        if (image) {
            if (image.type === "image/png" || image.type === "image/jpg" || image.type === "image/jpeg" || image.type === "image/bmp" || image.type === "image/gif") {
                setloading(true)
                const uploadtask = storage.ref(`images/${image.name}`).put(image);
                uploadtask.on("state_changed", snapshot => { }, error => console.log(error), () => {
                    storage.ref("images").child(image.name).getDownloadURL().then(url => {
                        db.collection("channels").doc(channelid).collection("messages").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: input,
                            user: user,
                            imageurl: url,
                        })
                    }).then(() => setloading(false))
                })
            }
            else {
                setloading(true)
                console.log(loading)
                const uploadtask = storage.ref(`files/${image.name}`).put(image);
                uploadtask.on("state_changed", snapshot => { }, error => console.log(error), () => {
                    storage.ref("files").child(image.name).getDownloadURL().then(url => {
                        db.collection("channels").doc(channelid).collection("messages").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: input,
                            user: user,
                            fileurl: url,
                            filename: image.name
                        })
                    }).then(() => setloading(false))
                })
            }
        }
        else {
            db.collection("channels").doc(channelid).collection("messages").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user,
            })
        }

        setimage(null)
        setinput("");
    }
    return (
        <div className="chat">
            {loading && (
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <ChatHeader language={language} channelname={channelname} />
            <Scrollbars renderThumbVertical={props => <div style={{backgroundColor: "#212121", borderRadius: "5px"}}/>}>
                <div className="chat__messages">
                    {messages.map(message => (
                        <Message language={language} filename={message.filename} fileurl={message.fileurl} imageurl={message.imageurl} key={message.timestamp} message={message.message}
                            timestamp={message.timestamp} user={message.user} />
                    ))}
                </div>
            </Scrollbars>
            <div className="chat__input">
                <AddCircleIcon className="chat__inputfilebutton" fontSize="large" onClick={() => hiddenFileInput.current.click()} />
                <form onSubmit={(e) => { e.preventDefault(); if (input) { sendmessage(e) } }}>
                    <input value={input}
                        placeholder={image ? (image.name) : channelid ? language === "hun" ? ("Üzenet: #" + channelname) : ("Message: #" + channelname) :
                            language === "hun" ? ("Válassz csatornát") : ("Select a channel")}
                        disabled={!channelid} onChange={(e) => setinput(e.target.value)} />
                    <input disabled={!channelid} type="file"
                        ref={hiddenFileInput} onChange={(e) => { if (e.target.files[0]) { setimage(e.target.files[0]) } }} style={{ display: "none" }} />
                </form>
                <div className="chat__inputicons">
                    <CardGiftcardIcon fontSize="large" />
                    <GifIcon fontSize="large" />
                    <EmojiEmotionsIcon fontSize="large" />
                </div>
            </div>
        </div>
    )
}

export default Chat
