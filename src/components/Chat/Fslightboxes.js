import React from 'react'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function Fslightboxes({lightbox, setlightbox, channelname}) {
    return (
        <>
            {lightbox.toggler && (
            <Lightbox 
                mainSrc={lightbox.url}
                onCloseRequest={() => {setlightbox({toggler: false, url: null})}}
                imageCaption={`#${channelname} - ${lightbox.user} -- ${new Date(lightbox.timestamp?.toDate()).toLocaleString("hu-HU")}`}
            />
            )}
            
        </>
    )
}

export default Fslightboxes
