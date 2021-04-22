import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    channelId: null,
    channelName: null,
    onlineUsers: {},
    channelDesc: null,
    categorieid: null,
    language: localStorage.getItem("language") || "hu",
    mutedchannels: JSON.parse(localStorage.getItem("mutedChannels")),
    filenamesinchannel: [],
    imagenamesinchannel: [],
    sidebarmobile: window.innerWidth < 768,
    snackbar: {},
  },
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelId = action.payload.channelId;
      state.channelName = action.payload.channelName;
      state.categorieid = action.payload.categorieid;
      state.channelDesc = action.payload.channelDesc;
    },
    setlanguage: (state, action) => {
      state.language = action.payload.language;
    },
    setfilenamesinchannel: (state, action) => {
      state.filenamesinchannel = action.payload.filenamesinchannel;
      state.imagenamesinchannel = action.payload.imagenamesinchannel;
    },
    setsidebarmobile: (state, action) => {
      state.sidebarmobile = action.payload.sidebarmobile;
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
} = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;
export const selectChannelDesc = (state) => state.app.channelDesc;

export const selectcategorieid = (state) => state.app.categorieid;
export const selectsidebarmobile = (state) => state.app.sidebarmobile;
export const selectsnackbar = (state) => state.app.snackbar;
export const selectmutedchannels = (state) => state.app.mutedchannels;

export const selectlanguage = (state) => state.app.language;
export const selectfilenamesinchannel = (state) => state.app.filenamesinchannel;
export const selectOnlineUsers = (state) => state.app.onlineUsers;

export const selectimagenamesinchannel = (state) =>
  state.app.imagenamesinchannel;

export default appSlice.reducer;
