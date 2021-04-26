import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        language: localStorage.getItem("language") || "hu",
        onlineUsers: {},
        channelInformations: {
            channelId: null,
            channelName: null,
            channelDesc: null,
            categorieid: null,
            filenamesinchannel: [],
            imagenamesinchannel: [],
        },
        sidebar: {
            sidebarmobile: true,
            sidebarmobileright: true,
        },
        mutedchannels: JSON.parse(localStorage.getItem("mutedChannels")),
        snackbar: {},
    },
    reducers: {
        setChannelInfo: (state, action) => {
            state.channelInformations.channelId = action.payload.channelId;
            state.channelInformations.channelName = action.payload.channelName;
            state.channelInformations.categorieid = action.payload.categorieid;
            state.channelInformations.channelDesc = action.payload.channelDesc;
        },
        setlanguage: (state, action) => {
            state.language = action.payload.language;
        },
        setfilenamesinchannel: (state, action) => {
            state.channelInformations.filenamesinchannel = action.payload.filenamesinchannel;
            state.channelInformations.imagenamesinchannel = action.payload.imagenamesinchannel;
        },
        setsidebarmobile: (state, action) => {
            state.sidebar.sidebarmobile = action.payload.sidebarmobile;
        },
        setsidebarmobileright: (state, action) => {
            state.sidebar.sidebarmobileright = action.payload.sidebarmobileright;
        },
        setsnackbar: (state, action) => {
            state.snackbar = action.payload.snackbar;
        },
        setmutedchannels: (state, action) => {
            state.mutedchannels = action.payload.mutedchannels;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload.onlineUsers;
        },
    },
});

export const {
    setChannelInfo,
    setsidebarmobile,
    setlanguage,
    setfilenamesinchannel,
    setsnackbar,
    setmutedchannels,
    setOnlineUsers,
    setsidebarmobileright,
} = appSlice.actions;

export const selectChannelId = (state) => state.app.channelInformations.channelId;
export const selectChannelName = (state) => state.app.channelInformations.channelName;
export const selectChannelDesc = (state) => state.app.channelInformations.channelDesc;
export const selectcategorieid = (state) => state.app.channelInformations.categorieid;
export const selectfilenamesinchannel = (state) => state.app.channelInformations.filenamesinchannel;
export const selectimagenamesinchannel = (state) => state.app.channelInformations.imagenamesinchannel;

export const selectsidebarmobile = (state) => state.app.sidebar.sidebarmobile;
export const selectsidebarmobileright = (state) => state.app.sidebar.sidebarmobileright;

export const selectsnackbar = (state) => state.app.snackbar;
export const selectmutedchannels = (state) => state.app.mutedchannels;

export const selectlanguage = (state) => state.app.language;

export const selectOnlineUsers = (state) => state.app.onlineUsers;

export default appSlice.reducer;
