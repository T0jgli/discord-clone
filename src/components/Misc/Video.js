import React from "react";
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";

const VideoComp = ({ src, title }) => {
    return (
        <>
            <Plyr
                source={{
                    type: "video",
                    title: title,
                    sources: [
                        {
                            src: src,
                            type: "video/mp4",
                        },
                    ],
                }}
            />
        </>
    );
};

export default React.memo(VideoComp);
