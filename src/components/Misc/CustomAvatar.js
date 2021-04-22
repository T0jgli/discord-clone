import { Avatar, Badge } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../../lib/AppSlice";

const CustomAvatar = ({ src, displayname, alt, onClick, thisUser }) => {
  const onlineUsers = useSelector(selectOnlineUsers);

  const [isOnlineUser, setisOnlineUser] = useState(false);

  useEffect(() => {
    if (Object.values(onlineUsers).includes(thisUser?.id || thisUser?.uid))
      setisOnlineUser(true);
    else setisOnlineUser(false);
  }, [onlineUsers, thisUser]);

  if (isOnlineUser) {
    return (
      <Badge color="secondary" overlap="circle" badgeContent="">
        <Avatar onClick={onClick} alt={alt} src={src}>
          {!src && displayname?.substring(0, 1)}
        </Avatar>
      </Badge>
    );
  }

  return (
    <Avatar onClick={onClick} alt={alt} src={src}>
      {!src && displayname?.substring(0, 1)}
    </Avatar>
  );
};

export default CustomAvatar;
