import React from 'react'
import { selectChannelId, selectChannelName, selectlanguage, selectmutedchannels, selectsidebarmobile, setmutedchannels, setsidebarmobile } from "../../lib/AppSlice"
import { useDispatch, useSelector } from 'react-redux'

import NotificationsIcon from '@material-ui/icons/Notifications'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'
import CloseIcon from '@material-ui/icons/Close';
import { Sling as Hamburger } from 'hamburger-react'
import { Fade } from '@material-ui/core';


const ChatHeader = ({ searchtext, setsearchtext }) => {
    const dispatch = useDispatch()

    const language = useSelector(selectlanguage)
    const sidebarmobile = useSelector(selectsidebarmobile)
    const channelid = useSelector(selectChannelId)
    const channelname = useSelector(selectChannelName)
    const mutedchannels = useSelector(selectmutedchannels)


    const setMutedChannels = () => {
        if (mutedchannels) {
            localStorage.setItem("mutedChannels", JSON.stringify([
                ...mutedchannels, channelid
            ]))
            dispatch(setmutedchannels({
                mutedchannels: [
                    ...mutedchannels, channelid
                ]
            }))
        }
        else {
            localStorage.setItem("mutedChannels", JSON.stringify([
                channelid
            ]))
            dispatch(setmutedchannels({
                mutedchannels: [
                    channelid
                ]
            }))
        }
    }

    const setUnMutedChannels = () => {
        localStorage.setItem("mutedChannels", JSON.stringify(mutedchannels.filter(e => e !== channelid)))
        dispatch(setmutedchannels({
            mutedchannels: mutedchannels.filter(e => e !== channelid)
        }))

    }

    return (
        <>
            <div className="chatheader__sidebarbtn">
                <Hamburger rounded size={27} direction="left" toggled={!sidebarmobile} toggle={() => {
                    dispatch(setsidebarmobile({
                        sidebarmobile: !sidebarmobile
                    }))
                }} />
            </div>
            <div className="chatheader">
                <div className="chatheader__left">
                    <h3 className={mutedchannels?.includes(channelid) ? "mutedchannel" : "notmutedchannel"}>
                        <span>#</span>
                        {channelname}
                    </h3>
                </div>
                {channelid && (
                    <Fade in={Boolean(channelid)}>
                        <div className="chatheader__right">
                            <div className="chatheader__search">
                                <input
                                    value={searchtext}
                                    onChange={(e) => setsearchtext(e.target.value)}
                                    placeholder={language === "hu" ? ("Keresés") : ("Search")} />
                                {searchtext ? (
                                    <CloseIcon style={{ cursor: "default", opacity: "0.5" }} className="search__closeicon" onClick={() => setsearchtext("")} />
                                ) : (
                                        <SearchRoundedIcon style={{ opacity: "0.5", cursor: "default" }} />
                                    )}

                            </div>
                            {mutedchannels?.includes(channelid) ? (
                                <NotificationsOffIcon onClick={() => {
                                    setUnMutedChannels()
                                }} />
                            ) : (
                                    <NotificationsIcon onClick={() => {
                                        setMutedChannels()
                                    }} />
                                )}

                            <HelpRoundedIcon onClick={() => window.open("https://support.discord.com/hc/en-us", "_blank")} />
                        </div>
                    </Fade>

                )}

            </div>
        </>
    )
}

export default ChatHeader