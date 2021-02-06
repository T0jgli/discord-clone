import React, { useState, useEffect } from 'react'

import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import {
    setChannelInfo,
    selectmutedchannels, selectChannelId, setsidebarmobile
} from '../../lib/AppSlice'
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import EditchannelDialog from '../Dialogs/EditchannelDialog';
import { selectUser } from '../../lib/userSlice';

const SideBarChannel = ({ id, channel, categorieid }) => {
    const dispatch = useDispatch()

    const channelid = useSelector(selectChannelId)
    const mutedchannels = useSelector(selectmutedchannels)
    const user = useSelector(selectUser)

    const [delbutton, setdelbutton] = useState(false)
    const [dialog, setdialog] = useState(false)
    const [confirmprompt, setconfirmprompt] = useState({
        en: null,
        hu: null,
        open: false,
        enter: null,
    })

    useEffect(() => {
        let mounted = false;
        dispatch(setsidebarmobile({
            sidebarmobile: true
        }))

        if (id !== channelid && !mounted) {
            setdelbutton(false)
        }
        return () => { mounted = true };

    }, [channelid, id, dispatch])

    return (
        <>
            <div onMouseEnter={() => setdelbutton(true)} onMouseLeave={() => { if (id !== channelid) { setdelbutton(false) } }}
                className={id === channelid ? mutedchannels?.includes(id) ? ("sidebarchannel mutedchannelbg") :
                    ("sidebarchannel activechannel") : ("sidebarchannel notactivechannel")} onClick={() => {
                        setdelbutton(true); dispatch(setChannelInfo({
                            channelId: id, channelName: channel.channelname, categorieid: categorieid, channelDesc: channel.description
                        }))
                    }}>
                <h4 className={mutedchannels?.includes(id) ? "mutedchannel" : ("")}><span>#</span>{channel.channelname}</h4>
                {delbutton && channel.createdby === user.uid ? (
                    <IconButton onClick={() => setdialog(true)} className="delicon" style={{ color: "gray" }}>
                        <EditIcon />
                    </IconButton>
                ) : (null)}

            </div>

            <EditchannelDialog setconfirmprompt={setconfirmprompt}
                channel={channel}
                id={id} categorieid={categorieid}
                dialog={dialog} setdialog={setdialog}
            />


            <ConfirmDialog confirmprompt={confirmprompt} setconfirmprompt={setconfirmprompt} />
        </>
    )
}

export default SideBarChannel
