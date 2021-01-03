import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
    return (
        <div className="loading">
            <CircularProgress variant="determinate" size={100} />
        </div>
    )
}

export default Loading
