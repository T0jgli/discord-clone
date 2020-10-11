import React, { useEffect, useState } from 'react';
import { auth } from "./firebase/firebase"
import "./App.css"
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat'
import Login from './components/Login/Login'
import Loading from "./components/Loading/Loading"
import { getCookie, setCookie } from "./features/Cookiehelper"

import { useDispatch, useSelector } from 'react-redux';
import { selectUser, login, logout } from "./features/userSlice"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true)
  const [language, setlanguage] = useState("eng")
  const [logintoast, setlogintoast] = useState(false)
  const [signouttoast, setsignouttoast] = useState(false)

  useEffect(() => {
    auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        dispatch(login({
          uid: authuser.uid,
          photo: authuser.photoURL,
          email: authuser.email,
          displayname: authuser.displayName
        }))
      }
      else {
        dispatch(logout())
      }
    })
  }, [dispatch])


  useEffect(() => {
    if (user) {
      setloading(false)
    }
    else {
      setTimeout(() => {
        setloading(false)
      }, 1500);
    }
  }, [user])

  useEffect(() => {
    if (getCookie("language") === "hun") {
      setlanguage("hun");
    }
  }, [])

  return (
    <div className="app">
      {user ? (
        <>
          {logintoast && (
            <Snackbar
              open={logintoast} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlogintoast(false) }}>
              <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlogintoast(false) }}
                severity="success">{language === "hun" ? ("Sikeres bejelentkezés!") : ("Successful login!")}
              </Alert>
            </Snackbar>)}

          <Sidebar language={language} setsignouttoast={setsignouttoast} />
          <Chat language={language} />
        </>
      ) : loading ? (<Loading />) : (<Login settoast={setlogintoast} getCookie={getCookie} setCookie={setCookie} language={language} />)}

      {signouttoast && (
        <Snackbar open={signouttoast} autoHideDuration={2000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setsignouttoast(false) }}>
          <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setsignouttoast(false) }}
            severity="warning">{language === "hun" ? ("Sikeres kijelentkezés!") : ("Successful sign out!")}
          </Alert>
        </Snackbar>)}
    </div>
  );
}

export default App;
