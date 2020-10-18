import React from 'react'
import SideBarChannel from './SideBarChannel'

function SidebarChannelList({hide, channels, user, setchanneldeleted, categorieid}) {
    return (
        <div className="sidebar__channelslist">
            {hide ? (null) : channels.map(({ id, channel }) => (
                <SideBarChannel categorieid={categorieid} setchanneldeleted={setchanneldeleted} user={user} key={id} 
                channelname={channel.channelname} createdby={channel.createdby} id={id} />
            ))}

        </div>
    )
}

export default SidebarChannelList
