import React, { useEffect, useState } from 'react';
import "./App.scss"
import db, { auth } from "./lib/firebase"
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat'
import Login from './components/Login/Login'
import Loading from "./components/Loading/Loading"
import Snackbars from "./components/Snackbars"
import Theme from './components/Theme';
import firebase from "firebase/app"

import { useDispatch, useSelector } from 'react-redux';
import { selectUser, login, logout } from "./lib/userSlice"
import { selectlanguage } from "./lib/AppSlice"
import { ThemeProvider } from '@material-ui/core';

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser)
  const language = useSelector(selectlanguage)

  const [loading, setloading] = useState(true)

  useEffect(() => {
    auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        let dname = authuser.displayName;
        if (!authuser.displayName) {
          dname = authuser.email
        }
        dispatch(login({
          uid: authuser.uid,
          photo: authuser.photoURL,
          email: authuser.email,
          displayname: dname
        }))
      }
      else {
        dispatch(logout())
      }
      setloading(false)

    })
    window.document.documentElement.lang = language
  }, [dispatch, language])


  useEffect(() => {
    if (user) {
      const docref = db.collection("users").doc(user.uid)
      docref.get().then(doc => {
        if (doc.exists) {
          docref.update({
            lastlogin: firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
        else {
          docref.set({
            email: user.email,
            photoUrl: user.photo,
            displayname: user.displayname,
            lastlogin: firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
    }

  }, [user])

  return (
    <ThemeProvider theme={Theme}>
      <div className="app">
        {!loading ? user ? (
          <>
            <Sidebar />
            <Chat />
          </>
        ) : (
            <Login />
          ) : (
            <Loading />
          )}
        <Snackbars />
      </div>
    </ThemeProvider>
  );
}

export default App;
