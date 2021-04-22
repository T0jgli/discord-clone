import React, { useEffect, useState, lazy, Suspense } from "react";
import "./App.scss";
import db, { auth } from "./lib/firebase";
const Sidebar = lazy(() => import("./components/Sidebar/Sidebar"));
const Chat = lazy(() => import("./components/Chat/Chat"));
const Login = lazy(() => import("./components/Login/Login"));
const Snackbars = lazy(() => import("./components/Snackbars"));

import Loading from "./components/Loading/Loading";
import Theme from "./components/Theme";
import firebase from "firebase/app";

import { useDispatch, useSelector } from "react-redux";
import { selectUser, login, logout } from "./lib/userSlice";
import { selectlanguage, setOnlineUsers } from "./lib/AppSlice";
import { ThemeProvider } from "@material-ui/core";
import { motion } from "framer-motion";
import { pageVariants } from "./components/Animation";
import socketIOClient from "socket.io-client";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const language = useSelector(selectlanguage);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    const cleanup = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        let dname = authuser.displayName;
        if (!authuser.displayName) {
          dname = authuser.email;
        }
        dispatch(
          login({
            uid: authuser.uid,
            photo: authuser.photoURL,
            email: authuser.email,
            displayname: dname,
          })
        );
      } else {
        dispatch(logout());
      }
      setloading(false);
    });
    window.document.documentElement.lang = language;

    return () => cleanup();
  }, [dispatch, language]);

  useEffect(() => {
    if (user) {
      const socket = socketIOClient(process.env.REACT_APP_SOCKETURL);

      socket.emit("onlineUser", {
        details: user.uid,
      });

      socket.on("usersChanged", ({ onlineUsers }) => {
        dispatch(
          setOnlineUsers({
            onlineUsers,
          })
        );
      });

      const docref = db.collection("users").doc(user.uid);
      docref.get().then((doc) => {
        if (doc.exists) {
          docref.update({
            lastlogin: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          docref.set({
            email: user.email,
            photoUrl: user.photo,
            displayname: user.displayname,
            lastlogin: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <ThemeProvider theme={Theme}>
      <Suspense fallback={<Loading />}>
        <motion.div
          className="app"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {!loading ? (
            user ? (
              <>
                <Sidebar />
                <Chat />
              </>
            ) : (
              <Login />
            )
          ) : (
            <Loading />
          )}
          <Snackbars />
        </motion.div>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
