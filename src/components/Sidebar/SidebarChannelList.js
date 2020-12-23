import React from 'react'
import SideBarChannel from './SideBarChannel'

const SidebarChannelList = ({ hide, channels, user, categorieid }) => {
    return (
        <div className="sidebar__channelslist">
            {hide ? (null) : channels.map(({ id, channel }) => (
                <SideBarChannel categorieid={categorieid} user={user} key={id}
                    channelname={channel.channelname} createdby={channel.createdby} id={id} />
            ))}

        </div>
    )
}

export default SidebarChannelList
