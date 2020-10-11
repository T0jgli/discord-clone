import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"
import MicIcon from "@material-ui/icons/Mic"
import HeadsetIcon from "@material-ui/icons/Headset"
import SettingsIcon from "@material-ui/icons/Settings"

import SideBarChannel from './SideBarChannel'
import { Avatar } from '@material-ui/core'
import { selectUser } from '../../features/userSlice'
import { useSelector } from 'react-redux'
import db, { auth } from '../../firebase/firebase'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

function Sidebar({ language, setsignouttoast }) {
    const user = useSelector(selectUser)
    const [channels, setchannel] = useState([])
    const [hide, sethide] = useState(false)

    useEffect(() => {
        db.collection("channels").onSnapshot((snapshot) =>
            setchannel(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    channel: doc.data(),
                }))
            )
        )
    }, [])
    const handleaddchannel = () => {
        let channelname;
        if (language === "hun") {
            channelname = prompt("Írj be egy új csatorna nevet")
        }
        else {
            channelname = prompt("Enter a new channel name")
        }

        if (channelname) {
            db.collection("channels").add({
                channelname: channelname
            })
        }
    }


    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <h3>Discord CLoNe by tojglEE</h3>
                <ExpandMoreIcon />
            </div>
            <div className="sidebar__channels">
                <div className="sidebar__channelsheader">
                    <div className="sidebar__header" onClick={() => sethide(!hide)}>
                        {hide ? (<KeyboardArrowRightIcon />) : (<ExpandMoreIcon />)}
                        <h5>{language === "hun" ? ("SZÖVEG CSATORNÁK") : ("TEXT CHANNELS")}</h5>
                    </div>
                    <AddIcon onClick={handleaddchannel} />
                </div>
                <div className="sidebar__channelslist">
                    {hide ? (null) : channels.map(({ id, channel }) => (
                        <SideBarChannel key={id} channelname={channel.channelname} id={id} />
                    ))}

                </div>
            </div>
            <div className="sidebar__profile">
                <Avatar onClick={() => {auth.signOut(); setsignouttoast(true)}} src={user.photo} />
                <div className="sidebar__profileinfo">
                    <h3>{user.displayname}</h3>
                    <p>#{user.uid.substring(0, 5)}</p>
                </div>
                <div className="sidebar__profileicons">
                    <MicIcon />
                    <HeadsetIcon />
                    <SettingsIcon />
                </div>
            </div>
        </div>
    )
}

export default Sidebar
