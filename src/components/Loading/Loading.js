import React from 'react'
import "./Loading.css"
import CircularProgress from '@material-ui/core/CircularProgress';

function Loading() {
    return (
        <div className="loading">
            <CircularProgress size={100}/>
        </div>
    )
}

export default Loading
