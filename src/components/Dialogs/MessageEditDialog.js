import { IconButton, Paper, Popover, Tooltip } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectlanguage } from "../../lib/redux/AppSlice";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";

const MessageEditDialog = ({ editpopper, seteditpopper, deletefunc, video, setedit, edit, setconfirmprompt }) => {
    const language = useSelector(selectlanguage);

    return (
        <Popover
            anchorOrigin={{
                vertical: "center",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "right",
            }}
            onClose={() => seteditpopper(null)}
            open={Boolean(editpopper)}
            anchorEl={editpopper}
            disablePortal
        >
            <Paper style={{ background: "transparent" }} className="message__editmenu">
                {!video && (
                    <Tooltip title={language === "hu" ? "Üzenet szerkeszrése" : "Edit message"} placement="bottom">
                        <IconButton
                            onClick={() => {
                                setedit(!edit);
                                seteditpopper(null);
                            }}
                        >
                            <MdModeEdit style={{ color: "grey" }} />
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title={language === "hu" ? "Üzenet törlése" : "Delete message"} placement="bottom">
                    <IconButton
                        onClick={() => {
                            setconfirmprompt({
                                hu: "Biztosan törlöd az üzenetet?",
                                en: "Are you sure you want to delete this message?",
                                open: true,
                                enter: deletefunc,
                            });
                        }}
                    >
                        <MdDelete style={{ color: "grey" }} />
                    </IconButton>
                </Tooltip>
            </Paper>
        </Popover>
    );
};

export default MessageEditDialog;
