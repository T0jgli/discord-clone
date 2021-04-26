import { IconButton, Paper, Popover, Tooltip } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { selectlanguage } from "../../lib/redux/AppSlice";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

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
                            <EditIcon style={{ color: "grey" }} />
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
                        <DeleteIcon style={{ color: "grey" }} />
                    </IconButton>
                </Tooltip>
            </Paper>
        </Popover>
    );
};

export default MessageEditDialog;
