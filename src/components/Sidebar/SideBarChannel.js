import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectChannelName, setChannelInfo } from '../../features/AppSlice'

function SideBarChannel({ id, channelname }) {
    const channel = useSelector(selectChannelName)
    const dispatch = useDispatch()
    return (
        <div className={channelname === channel ? ("sidebarchannel activechannel"): ("notactivechannel sidebarchannel")}onClick={() => (dispatch(setChannelInfo({
            channelId: id, channelName: channelname
        })))}>
            <h4><span>#</span>{channelname}</h4>
        </div>
    )
}

export default SideBarChannel
