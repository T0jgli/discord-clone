import React from "react";
import {
    selectChannelDesc,
    selectChannelId,
    selectChannelName,
    selectlanguage,
    selectmutedchannels,
    selectsidebarmobile,
    selectsidebarmobileright,
    setmutedchannels,
    setsidebarmobile,
    setsidebarmobileright,
} from "../../lib/redux/AppSlice";
import { useDispatch, useSelector } from "react-redux";

import { MdNotifications } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { MdOutlineSearch } from "react-icons/md";
import { MdHelp } from "react-icons/md";
import { MdClose } from "react-icons/md";

import { Fade } from "@mui/material";
import { MdMenu } from "react-icons/md";
import { MdPeople } from "react-icons/md";

const ChatHeader = ({ searchtext, setsearchtext }) => {
    const dispatch = useDispatch();

    const language = useSelector(selectlanguage);
    const sidebarmobile = useSelector(selectsidebarmobile);
    const sidebarmobileright = useSelector(selectsidebarmobileright);

    const channelid = useSelector(selectChannelId);
    const channelname = useSelector(selectChannelName);
    const channeldesc = useSelector(selectChannelDesc);

    const mutedchannels = useSelector(selectmutedchannels);

    const setMutedChannels = () => {
        if (mutedchannels) {
            localStorage.setItem("mutedChannels", JSON.stringify([...mutedchannels, channelid]));
            dispatch(
                setmutedchannels({
                    mutedchannels: [...mutedchannels, channelid],
                })
            );
        } else {
            localStorage.setItem("mutedChannels", JSON.stringify([channelid]));
            dispatch(
                setmutedchannels({
                    mutedchannels: [channelid],
                })
            );
        }
    };

    const setUnMutedChannels = () => {
        localStorage.setItem("mutedChannels", JSON.stringify(mutedchannels.filter((e) => e !== channelid)));
        dispatch(
            setmutedchannels({
                mutedchannels: mutedchannels.filter((e) => e !== channelid),
            })
        );
    };

    return (
        <>
            <div className="chatheader__sidebarbtn">
                <MdMenu
                    size="2.1875rem"
                    onClick={() => {
                        dispatch(
                            setsidebarmobile({
                                sidebarmobile: !sidebarmobile,
                            })
                        );
                    }}
                />
            </div>
            <div className="chatheader__sidebarbtn users">
                <MdPeople
                    size="2.1875rem"
                    onClick={() => {
                        dispatch(
                            setsidebarmobileright({
                                sidebarmobileright: !sidebarmobileright,
                            })
                        );
                    }}
                />
            </div>

            <div className="chatheader">
                <div className="chatheader__left">
                    <h3 className={mutedchannels?.includes(channelid) ? "mutedchannel" : "notmutedchannel"}>
                        <span>#</span>
                        {channelname}
                    </h3>
                    {channelname && (
                        <>
                            <hr className="" />
                            <p className={mutedchannels?.includes(channelid) ? "mutedchannel" : "notmutedchannel"}>{channeldesc}</p>
                        </>
                    )}
                </div>
                {channelid && (
                    <Fade in={Boolean(channelid)}>
                        <div className="chatheader__right">
                            <div className="chatheader__search">
                                <input
                                    aria-label={language === "en" ? "Search field input" : "Keresőmező"}
                                    value={searchtext}
                                    type="text"
                                    onChange={(e) => setsearchtext(e.target.value)}
                                    placeholder={language === "hu" ? "Keresés" : "Search"}
                                />
                                {searchtext ? (
                                    <MdClose
                                        style={{ cursor: "default", opacity: "0.5" }}
                                        className="search__MdClose"
                                        onClick={() => setsearchtext("")}
                                    />
                                ) : (
                                    <MdOutlineSearch style={{ opacity: "0.5", cursor: "default" }} />
                                )}
                            </div>
                            {mutedchannels?.includes(channelid) ? (
                                <MdNotificationsNone
                                    onClick={() => {
                                        setUnMutedChannels();
                                    }}
                                />
                            ) : (
                                <MdNotifications
                                    onClick={() => {
                                        setMutedChannels();
                                    }}
                                />
                            )}

                            <MdHelp onClick={() => window.open("https://support.discord.com/hc/en-us", "_blank")} />
                        </div>
                    </Fade>
                )}
            </div>
        </>
    );
};

export default ChatHeader;
