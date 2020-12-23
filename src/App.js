import React, { useEffect, useState } from 'react';
import db, { auth } from "./lib/firebase"
import "./App.css"
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
    })
    window.document.documentElement.lang = language
  }, [dispatch, language])


  useEffect(() => {
    if (user) {
      setloading(false)
      const docref = db.collection("users").doc(user.uid)
      docref.get().then(doc => {
        if (doc.exists) {
          db.collection("users").doc(user.uid).update({
            lastlogin: firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
        else {
          db.collection("users").doc(user.uid).set({
            email: user.email,
            displayname: user.displayname,
            lastlogin: firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
    }
    else {
      setTimeout(() => {
        setloading(false)
      }, 1500);
    }
  }, [user])

  return (
    <div className="app">
      {user ? (
        <ThemeProvider theme={Theme}>
          <Sidebar />
          <Chat />
        </ThemeProvider>
      ) : loading ? (<Loading />) : (
        <ThemeProvider theme={Theme}>
          <Login />
        </ThemeProvider>
      )}

      <Snackbars />

    </div>
  );
}

export default App;
