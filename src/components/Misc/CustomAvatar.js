import { withStyles } from "@mui/styles";
import { Avatar, Badge } from "@mui/material";

import React from "react";
import useThisUserOnline from "../../lib/hooks/useThisUserOnline";

export const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "$ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}))(Badge);

const CustomAvatar = ({ src, displayname, alt, onClick, thisUser }) => {
    const isOnlineUser = useThisUserOnline(thisUser);

    if (isOnlineUser) {
        return (
            <StyledBadge
                color="secondary"
                overlap="circular"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                variant="dot"
                badgeContent=" "
            >
                <Avatar onClick={onClick} alt={alt} src={src}>
                    {!src && displayname?.substring(0, 1)}
                </Avatar>
            </StyledBadge>
        );
    }

    return (
        <Avatar onClick={onClick} alt={alt} src={src}>
            {!src && displayname?.substring(0, 1)}
        </Avatar>
    );
};

export default CustomAvatar;
