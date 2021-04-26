import { Button, Grow, IconButton, TextField, Tooltip } from "@material-ui/core";
import { Autocomplete, ToggleButton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectlanguage, setsnackbar } from "../../lib/redux/AppSlice";
import { languages } from "../../lib/syntaxHighlighterLanguages.json";
import CodeIcon from "@material-ui/icons/Code";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteIcon from "@material-ui/icons/Delete";
import AttachmentIcon from "@material-ui/icons/Attachment";
import ImageIcon from "@material-ui/icons/Image";

const ChatBottomActions = ({
    chatBottomPopup,
    hiddenFileInput,
    isCodeMessage,
    setIsCodeMessage,
    setselectedProgrammingLanguageArray,
    selectedProgrammingLanguageArray,
    image,
    setimage,
}) => {
    const language = useSelector(selectlanguage);
    const dispatch = useDispatch();

    return (
        <>
            {chatBottomPopup && (
                <>
                    <Grow in={Boolean(chatBottomPopup)}>
                        <div className="chat__filediv">
                            <Button onClick={() => hiddenFileInput.current.click()} style={{ fontWeight: "bold", padding: "11px" }}>
                                {language === "en" ? "File / Photo upload" : "Fájl / Kép feltöltés"}
                                <AttachFileIcon style={{ paddingLeft: "5px" }} />
                            </Button>

                            <div className="divider" />
                            <ToggleButton
                                value={isCodeMessage}
                                onChange={() => {
                                    setIsCodeMessage(!isCodeMessage);
                                    setselectedProgrammingLanguageArray(null);
                                }}
                                selected={isCodeMessage}
                                style={{ fontWeight: "bold", color: "white" }}
                            >
                                {language === "en" ? "Upload code" : "Kód feltöltése"}

                                <CodeIcon style={{ paddingLeft: "5px" }} />
                            </ToggleButton>
                        </div>
                    </Grow>
                    {isCodeMessage && (
                        <Grow in={Boolean(isCodeMessage)}>
                            <Autocomplete
                                options={languages}
                                style={{ width: 300 }}
                                value={selectedProgrammingLanguageArray}
                                onChange={(_, newInputValue) => {
                                    setselectedProgrammingLanguageArray(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField variant="outlined" {...params} label={language === "en" ? "Programming language" : "Programnyelv"} />
                                )}
                            />
                        </Grow>
                    )}
                </>
            )}

            {image && (
                <Grow in={Boolean(image)}>
                    <div className="chat__filediv" style={{ paddingRight: "0" }}>
                        <Tooltip title={image.name}>
                            {image?.type.includes("image") ? (
                                <ImageIcon style={{ cursor: "default" }} />
                            ) : (
                                <AttachmentIcon style={{ cursor: "default" }} />
                            )}
                        </Tooltip>
                        <Tooltip title={language === "hu" ? "Fájl törlése" : "Delete file"} placement="right">
                            <IconButton
                                onClick={() => {
                                    setimage(null);
                                    dispatch(
                                        setsnackbar({
                                            snackbar: {
                                                open: true,
                                                type: "info",
                                                hu: `${image?.type.includes("image") ? "Fénykép" : "Fájl"} törölve.`,
                                                en: `${image?.type.includes("image") ? "Photo" : "File"} deleted.`,
                                            },
                                        })
                                    );
                                }}
                            >
                                <DeleteIcon style={{ color: "lightgray" }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Grow>
            )}
        </>
    );
};

export default ChatBottomActions;
