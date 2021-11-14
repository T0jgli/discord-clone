import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
}));

const UploadLoading = ({ uploadvalue, loading }) => {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" variant="determinate" value={uploadvalue} />
        </Backdrop>
    );
};

export default UploadLoading;
