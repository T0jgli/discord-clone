import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { selectlanguage } from "../../lib/redux/AppSlice";

const ConfirmDialog = ({ confirmprompt, setconfirmprompt }) => {
    const language = useSelector(selectlanguage);
    return (
        <Dialog
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    confirmprompt.enter();
                }
                if (e.key === "Escape" || e.key === "Backspace") {
                    setconfirmprompt({ ...confirmprompt, open: false });
                }
            }}
            open={confirmprompt.open}
            onClose={() => setconfirmprompt({ ...confirmprompt, open: false })}
        >
            <DialogContent>
                <DialogTitle>{language === "hu" ? confirmprompt.hu : confirmprompt.en}</DialogTitle>
            </DialogContent>
            <DialogActions>
                <Button
                    style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                    onClick={() => {
                        setconfirmprompt({ ...confirmprompt, open: false });
                    }}
                >
                    {language === "hu" ? "Nem" : "No"}
                </Button>
                <Button
                    style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                    onClick={() => {
                        confirmprompt.enter();
                    }}
                >
                    {language === "hu" ? "Igen" : "Yes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
