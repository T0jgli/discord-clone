import React from 'react'
import {selectlanguage} from "../../features/AppSlice"
import { useSelector } from 'react-redux'

import NotificationsIcon from '@material-ui/icons/Notifications'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'

function ChatHeader({channelname}) {
    const language = useSelector(selectlanguage)
    return (
        <div className="chatheader">
            <div className="chatheader__left">
                <h3><span>#</span>{channelname}</h3>
            </div>
            <div className="chatheader__right">
                <NotificationsIcon/>
                <div className="chatheader__search">
                    <input placeholder={language === "hun" ? ("Keresés") : ("Search")}/>
                    <SearchRoundedIcon/>
                </div>
                <SendRoundedIcon/>
                <HelpRoundedIcon onClick={() => window.open("https://support.discord.com/hc/en-us", "_blank")}/>
            </div>
        </div>
    )
}

export default ChatHeader