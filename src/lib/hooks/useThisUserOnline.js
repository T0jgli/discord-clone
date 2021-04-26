import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../redux/AppSlice";

const useThisUserOnline = (thisUser) => {
    const onlineUsers = useSelector(selectOnlineUsers);
    const [isOnlineUser, setisOnlineUser] = useState(false);

    useEffect(() => {
        if (onlineUsers.length > 0)
            if (onlineUsers?.findIndex((user) => user.userId === (thisUser?.id || thisUser?.uid)) !== -1) setisOnlineUser(true);
            else setisOnlineUser(false);
    }, [onlineUsers, thisUser]);

    return isOnlineUser;
};

export default useThisUserOnline;
