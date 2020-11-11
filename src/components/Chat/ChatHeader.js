import React from 'react'
import { selectlanguage, selectsidebarmobile, setsidebarmobile } from "../../features/AppSlice"
import { useDispatch, useSelector } from 'react-redux'

import NotificationsIcon from '@material-ui/icons/Notifications'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'
import CloseIcon from '@material-ui/icons/Close';
import { Sling as Hamburger } from 'hamburger-react'

function ChatHeader ({ channelname, searchtext, setsearchtext }) {
    const language = useSelector(selectlanguage)
    const sidebarmobile = useSelector(selectsidebarmobile)
    const dispatch = useDispatch()


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
                    <h3>
                        <span>#</span>{channelname}
                    </h3>
                    <NotificationsIcon />
                </div>
                <div className="chatheader__right">
                    <div className="chatheader__search">
                        <input value={searchtext} onChange={(e) => setsearchtext(e.target.value)} disabled={!channelname} placeholder={language === "hu" ? ("Keresés") : ("Search")} />
                        {searchtext ? (
                            <CloseIcon className="search__closeicon" onClick={() => setsearchtext("")} />
                        ) : (
                                <SearchRoundedIcon style={{ opacity: "0.5" }} />
                            )}

                    </div>
                    <HelpRoundedIcon onClick={() => window.open("https://support.discord.com/hc/en-us", "_blank")} />
                </div>
            </div>
        </>
    )
}

export default ChatHeader