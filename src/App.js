import React, { useEffect, useState } from 'react';
import db, { auth } from "./firebase/firebase"
import "./App.css"
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat'
import Login from './components/Login/Login'
import Loading from "./components/Loading/Loading"
import Snackbars from "./components/Snackbars"
import { getCookie, setCookie } from "./features/Cookiehelper"
import firebase from "firebase/app"

import { useDispatch, useSelector } from 'react-redux';
import { selectUser, login, logout } from "./features/userSlice"
import { setlanguage } from "./features/AppSlice"
import { ThemeProvider } from '@material-ui/core';
import Theme from './components/Theme';

function App() {
  const user = useSelector(selectUser)

  const dispatch = useDispatch();
  const [loading, setloading] = useState(true)
  const [logintoast, setlogintoast] = useState(false)
  const [signouttoast, setsignouttoast] = useState(false)

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

    if (localStorage.getItem("language") === "en") {
      dispatch(setlanguage({ language: "en" }))
    }

  }, [dispatch])


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
          <Snackbars logintoast={logintoast} setlogintoast={setlogintoast} />
          <Sidebar setsignouttoast={setsignouttoast} />
          <Chat />
        </ThemeProvider>
      ) : loading ? (<Loading />) : (<Login settoast={setlogintoast} getCookie={getCookie} setCookie={setCookie} />)}

      <Snackbars signouttoast={signouttoast} setsignouttoast={setsignouttoast} />

    </div>
  );
}

export default App;
