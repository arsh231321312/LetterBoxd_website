
import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import { Link, Navigate } from 'react-router-dom';
import './App.css';
import eye_closed from './pictures/eye_closed.png';
import darkSun from './pictures/sun.png';
import sun from './pictures/sunBright.png';
import './APictures.css'
import { setGlobalState, useGlobalState } from "./GlobalVars";



export function SignUpForm() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [PasswordRepeat, setPassRepeat] = useState("");
  const [hashedUser, setHashedUser] = useState("");
  const [hashedPass, setHashedPass] = useState("");
  const [hashedEmail, setHashedEmail] = useState("");
  const [errorMessageExistsEmail, setErrorMessageExistsEmail] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessageExistsUser, setErrorMessageExistsUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState("");
  const [errorMessageExistsPass, setErrorMessageExistsPass] = useState(false);
  const [errorMessagePass, setErrorMessagePass] = useState("");
  const [revealPassword, setRevealPassword] = useState(true);
  const [ErrorPassMismatch, setErrorPassMismatch] = useState(false);
  const [PassMismatchMSG, setPassMismatchMSG] = useState("");
  const [gotoMainPage, setGotoMainPage] = useState(false);
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerCol] = useGlobalState("headerColor");
  const [loginFail, setLoginFail] = useState(false);
  const [loginFailMSG, setLoginFailMSG] = useState("");
  
  function eye_change() {
    if (revealPassword) {
      setRevealPassword(false);
    } else {
      setRevealPassword(true);
    }
  }
  function handleSubmit(e) {
    let errorMessageExistsUserScope = false;
    let errorMessageExistsEmailScope = false;
    let passwordMismatchScope = false;
    e.preventDefault();
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
      errorMessageExistsUserScope = true;
    } else {
      setErrorMessageExistsUser(false);
    }
    if (email.length < 6) {
      setErrorMessageEmail("Email must be at least 6 characters long");
      setErrorMessageExistsEmail(true);
      errorMessageExistsEmailScope = true;
    } else if (email.includes('@') === false) {
      setErrorMessageEmail("Email must contain an '@' symbol");
      setErrorMessageExistsEmail(true);
      errorMessageExistsEmailScope = true;
    } else {
      setErrorMessageExistsEmail(false);
    }

    if (password === PasswordRepeat) {
      setErrorPassMismatch(false);
    } else {
      setPassMismatchMSG("Passwords do not match");
      setErrorPassMismatch(true);
      passwordMismatchScope = true;
    }
    if (errorMessageExistsUserScope || errorMessageExistsEmailScope || passwordMismatchScope) {
      return;
    }

    const data = {
      username: hashedUser,
      password: hashedPass,
      email: hashedEmail,
      type: "register"
    }

    fetch('http://localhost:5000/3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'failure') {

          setGotoMainPage(false);
          setLoginFail(true);
          setLoginFailMSG(data.message);

        } else {
          setGlobalState('authenticated',true)
          setGlobalState('account',hashedUser)
          setLoginFail(false);
          setGotoMainPage(true);
        }

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  function handleChangeUser(e) {
    const user = e.target.value;
    setUser(user);
    setHashedUser(CryptoJS.SHA256(user).toString());


  }
  function handleChangeEmail(e) {
    const email = e.target.value;
    setEmail(email);
    setHashedEmail(CryptoJS.SHA256(email).toString());
    if (email.includes('@') === true) {
      setErrorMessageExistsEmail(false);
    }

  }
  function handleChangePass(e) {
    const pass = e.target.value;
    setPass(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());
    if (pass.length < 8) {
      setErrorMessagePass("Password must be at least 8 characters long");
      setErrorMessageExistsPass(true);
    } else if (pass.search(/(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*/) < 0) {
      setErrorMessagePass("Password must contain at least one number, one uppercase letter, and one special character");
      setErrorMessageExistsPass(true);
    } else {
      setErrorMessageExistsPass(false);
    }
    // if (password === PasswordRepeat) {
    //   setErrorPassMismatch(false);
    // }else {
    //   setPassMismatchMSG("Passwords do not match");
    //   setErrorPassMismatch(true);

    // }

  }
  function handleChangePassRepeat(e) {
    const pass = e.target.value;
    setPassRepeat(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());
    // if (password === PasswordRepeat) {
    //   setErrorPassMismatch(false);
    // }else {
    //   setPassMismatchMSG("Passwords do not match");
    //   setErrorPassMismatch(true);

    // }

  }

  function handleInvalid(event) {
    event.preventDefault(); // Prevent the form from submitting
  }


  return (

    <div className="page" style={{ backgroundColor: backgroundColor }}>
      {gotoMainPage && <Navigate to="/mainPage" />}
      <Box>
        <div>
          <h1 style={{ position: "relative", color: headerCol }} > Register</h1>
        </div>
        <div>
          <form className="form" onSubmit={handleSubmit}>

            <UsernameInput username={username} handleChangeUser={handleChangeUser} handleInvalid={handleInvalid} />
            <div className="errorMSG">
              {errorMessageExistsUser && <span>{errorMessageUser}</span>}
            </div>
            <PasswordInput password={password} handleChangePass={handleChangePass} handleInvalid={handleInvalid} eye_change={eye_change} revealPassword={revealPassword} />


            <div className="errorMSG">
              {errorMessageExistsPass && (
                <span>{errorMessagePass}</span>
              )}
            </div>
            <PasswordInput password={PasswordRepeat} handleChangePass={handleChangePassRepeat} handleInvalid={handleInvalid} eye_change={eye_change} revealPassword={revealPassword} />


            <div className="errorMSG">
              {ErrorPassMismatch && (
                <span >{PassMismatchMSG}</span>
              )}
            </div>

            <EmailInput email={email} handleChangeEmail={handleChangeEmail} handleSubmit={handleSubmit} />

            <div className="errorMSG">
              {errorMessageExistsEmail && (
                <span>{errorMessageEmail}</span>
              )}
            </div>

            <div>
              <button type="submit" className="submitButton" style={{ backgroundColor: backgroundColor }}>Submit</button>

            </div>
            <br />
            {loginFail && <span className="errorMSG">{loginFailMSG}</span>}
          </form>
        </div>
        <br />
        <div className="divExistingACC">
          <span style={{ color: backgroundColor }}>
            Have an account?
          </span>
          <span>
            <Link to="/Login" style={{ textDecoration: 'none', marginLeft: "5px", color: "blue" }}>
              Sign in
            </Link>

          </span>
        </div>




      </Box>

    </div>)


}

export function FrontPage() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerColor] = useGlobalState("headerColor");
  const [darkMode] = useGlobalState('DarkMode');
  const [wordColor] = useGlobalState('wordColor');
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;



  function dark_mode() {
    if (darkMode) {

      setGlobalState('DarkMode', false);
      setGlobalState('headerColor', '#708090');
      setGlobalState('wordColor', 'black');
      setGlobalState("backgroundColor", '#f0eee9');
    } else {

      setGlobalState('DarkMode', true);
      setGlobalState('headerColor', '#07000f');
      setGlobalState('wordColor', 'white');
      setGlobalState("backgroundColor", '#1f2833');
    }
  }
  return (
    <div>
      <div className='page' style={{ backgroundColor: backgroundColor }}>
        <header className="header" style={{ backgroundColor: headerColor }}>
          <div>
            <h1 style={{ color: wordColor, width: '75vw' }}>ARSH'S WEBSITE!!!</h1>
          </div>

          <div className="headerOptions">

            <span style={{
              marginRight: "1.1718vw",
              color: 'white',
              fontSize: '2.377vh'
            }}>
              <Link to="/Register" style={{ color: wordColor, textDecoration: 'none' }}>
                Register
              </Link>
            </span>
            <div>

              <span style={{
                color: 'white',
                fontSize: '2.377vh'
              }}>
                <Link to="/Login" style={{ color: wordColor, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </span>




            </div>
            <div>
              {(darkMode) &&
                <img src={darkSun} alt="light mode" className="dark_mode" onClick={dark_mode}></img>
              }
              {
                (!darkMode) &&
                <img src={sun} alt="dark mode" className="dark_mode" onClick={dark_mode} ></img>
              }

            </div>
          </div>
        </header>
        <h3 style={{ color: '#f0eee9', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', position: 'relative' }}>WOOOOOO!!</h3>
        <h3>
          {viewportHeight} x {viewportWidth}
        </h3>
      </div>
    </div>
  )
}
export function SignInForm() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [wordColor] = useGlobalState("wordColor");
  const [password, setPassword] = useState("");
  const [hashedPass, setHashedPass] = useState("");
  const [username, setUsername] = useState("");
  const [hashedUser, setHashedUser] = useState("");
  const [errorMessageExistsUser, setErrorMessageExistsUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState("");
  const [errorMessageExistsPass, setErrorMessageExistsPass] = useState(false);
  const [errorMessagePass, setErrorMessagePass] = useState("");
  const [revealPassword, setRevealPassword] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  const [loginFailMSG, setLoginFailMSG] = useState("");
  const [gotoMainPage, setGotoMainPage] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();


    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
    } else {
      setErrorMessageExistsUser(false);
    }
    if (errorMessageExistsUser) {
      return;
    }


    const data = {
      username: hashedUser,
      password: hashedPass,
      email: emailExists,
      type: "signin"
    }

    fetch('http://localhost:5000/3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'failure') {

          setGotoMainPage(false);
          setLoginFailMSG(data.message);
          setLoginFail(true);

        } else {
          setGlobalState('authenticated',true)
          setGlobalState("usesEmail",emailExists)
          setGlobalState('account',hashedUser)
          setLoginFail(false);
          setGotoMainPage(true);
        }

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }
  function eye_change() {
    if (revealPassword) {
      setRevealPassword(false);
    } else {
      setRevealPassword(true);
    }
  }

  function handleChangeUser(e) {
    const user = e.target.value;
    setUsername(user);
    setHashedUser(CryptoJS.SHA256(user).toString());
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
    } else {
      setErrorMessageExistsUser(false);
    }
    if (username.includes('@') === true) {
      setEmailExists(true);
    } else {
      setEmailExists(false);
    }
  }
  function handleInvalid(event) {
    event.preventDefault(); // Prevent the form from submitting
  }
  function handleChangePass(e) {
    const pass = e.target.value;
    setPassword(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());
    if (pass.length < 8) {
      setErrorMessagePass("Password must be at least 8 characters long");
      setErrorMessageExistsPass(true);
    } else if (pass.search(/(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*/) < 0) {
      setErrorMessagePass("Password must contain at least one number, one uppercase letter, and one special character");
      setErrorMessageExistsPass(true);
    } else {
      setErrorMessageExistsPass(false);
    }
  }

  return (

    <div className="page" style={{ backgroundColor: backgroundColor }}>
      {gotoMainPage && <Navigate to="/mainPage" />}
      <Box>
        <div>
          <h1 style={{ position: 'relative', color: backgroundColor }} > Sign In</h1>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <UsernameInput username={username} handleChangeUser={handleChangeUser} handleInvalid={handleInvalid} />
          <div className="errorMSG">
            {errorMessageExistsUser && <span>{errorMessageUser}</span>}
          </div>
          <PasswordInput password={password} handleChangePass={handleChangePass} handleInvalid={handleInvalid} eye_change={eye_change} revealPassword={revealPassword} />
          <div className="errorMSG">
            {errorMessageExistsPass && (
              <span>{errorMessagePass}</span>
            )}
          </div>
          <div>
            <button type="submit" className="submitButton" style={{ backgroundColor: backgroundColor, color: wordColor }}>Submit</button>
          </div>
          <div style={{ width: '303px', textAlign: 'center', position: 'relative', left: '10%' }}>
            <br />
            {loginFail && <span className="errorMSG" style={{ width: 'auto', minWidth: '303px' }}>{loginFailMSG}</span>}
          </div>
        </form>
        <div>

          <span style={{ position: 'relative', left: '-100px' }}>
            <Link to="/resetPassword" style={{ textDecoration: 'none', marginLeft: "5px", color: "blue" }}>
              Forgot Password?
            </Link>

          </span>

          <span style={{ position: 'relative', left: '96px' }}>
            <Link to="/Register" style={{ textDecoration: 'none', marginLeft: "5px", color: "blue" }}>
              Register
            </Link>

          </span>
        </div>

      </Box>
    </div>
  )
}
const Box = ({ children, width, height, backgroundColor }) => {
  return <div className="box" style={{ width, height, backgroundColor }}>{children}</div>;
};


export function ResetPasswordForm() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerCol] = useGlobalState("headerColor");

  const [username, setUsername] = useState("");
  const [hashedUser, setHashedUser] = useState("");
  const [errorMessageExistsUser, setErrorMessageExistsUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState("");

  const [errorPassMismatch, setErrorPassMismatch] = useState(false);
  const [PassMismatchMSG, setPassMismatchMSG] = useState("");
  const [password, setPassword] = useState("");
  const [hashedPass, setHashedPass] = useState("");
  const [PasswordRepeat, setPassRepeat] = useState("");
  const [revealPassword, setRevealPassword] = useState(true);
  const [errorMessageExistsPass, setErrorMessageExistsPass] = useState(false);
  const [errorMessagePass, setErrorMessagePass] = useState("");
  const [resetPassFail, setResetPassFail] = useState(false);
  const [resetPassFailMSG, setResetPassFailMSG] = useState("");

  const [gotoLoginPage, setGotoLoginPage] = useState(false);
  function eye_change() {
    if (revealPassword) {
      setRevealPassword(false);
    } else {
      setRevealPassword(true);
    }
  }
  function handleSubmit(e) {
    let errorMessageExistsUserScope = false;
    let passwordMismatchScope = false;
    let emailExists = false;
    e.preventDefault();
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
      errorMessageExistsUserScope = true;
    } else {
      setErrorMessageExistsUser(false);
      errorMessageExistsUserScope = false;
    }
    if (username.includes('@') === true) {
      emailExists = true;
    } else {
      emailExists = false;
    }

    if (password === PasswordRepeat) {
      setErrorPassMismatch(false);

    } else {
      setPassMismatchMSG("Passwords do not match");
      setErrorPassMismatch(true);
      passwordMismatchScope = true;
    }
    if (errorMessageExistsUserScope || passwordMismatchScope) {
      return;
    }
    const data = {
      username: hashedUser,
      password: hashedPass,
      email: emailExists,
      type: "changePassword"
    }

    fetch('http://localhost:5000/3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'failure') {
          setResetPassFail(true);
          setResetPassFailMSG(data.message);
        } else {
          setGotoLoginPage(true);
        }

      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function handleChangeUser(e) {
    const user = e.target.value;
    setUsername(user);
    setHashedUser(CryptoJS.SHA256(user).toString());
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
    } else {
      setErrorMessageExistsUser(false);
    }

  }
  function handleInvalid(e) {
    e.preventDefault();
  }
  function handleChangePass(e) {
    const pass = e.target.value;
    setPassword(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());
    if (pass.length < 8) {
      setErrorMessagePass("Password must be at least 8 characters long");
      setErrorMessageExistsPass(true);
    } else if (pass.search(/(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*/) < 0) {
      setErrorMessagePass("Password must contain at least one number, one uppercase letter, and one special character");
      setErrorMessageExistsPass(true);
    } else {
      setErrorMessageExistsPass(false);
    }
  }
  function handleChangePassRepeat(e) {
    const pass = e.target.value;
    setPassRepeat(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());
    if (password === PasswordRepeat) {
      setErrorPassMismatch(false);
    } else {
      setPassMismatchMSG("Passwords do not match");
      setErrorPassMismatch(true);
    }
  }
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>
      {gotoLoginPage && <Navigate to="/Login" />}
      <Box >

        <div>
          <h1 style={{ position: "relative", color: headerCol }} >Change Password</h1>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <UsernameInput username={username} handleChangeUser={handleChangeUser} handleInvalid={handleInvalid} />
          <div className="errorMSG">
            {errorMessageExistsUser && <span>{errorMessageUser}</span>}
          </div>
          <PasswordInput password={password} handleChangePass={handleChangePass} handleInvalid={handleInvalid} eye_change={eye_change} revealPassword={revealPassword} />
          <div className="errorMSG">
            {errorMessageExistsPass && <span>{errorMessagePass}</span>}
          </div>
          <PasswordInput password={PasswordRepeat} handleChangePass={handleChangePassRepeat} handleInvalid={handleInvalid} eye_change={eye_change} revealPassword={revealPassword} />
          <div className="errorMSG">
            {errorPassMismatch && <span>{PassMismatchMSG}</span>}
          </div>
          <div>
            <button type="submit" className="submitButton" style={{ backgroundColor: backgroundColor }}>Submit</button>
          </div>
          <div>
            {resetPassFail && <span className="errorMSG">{resetPassFailMSG}</span>}
          </div>
        </form>
        <span style={{ position: 'relative', left: '0px' }}>
          <Link to="/Login" style={{ textDecoration: 'none', marginLeft: "5px", color: "blue" }}>Sign in</Link>
        </span>

      </Box>
    </div>
  )
}

function UsernameInput({ username, handleChangeUser, handleInvalid }) {
  return (
    <div className="divInputBox" >
      <input
        className="inputBox"
        type="username"
        value={username}
        size="40"
        height="40px"
        maxLength={40}
        minLength={6}
        placeholder="Username"
        onInput={handleChangeUser}
        onInvalid={handleInvalid}

        required
      />
      <br />

    </div>
  )
}

function PasswordInput({ password, handleChangePass, handleInvalid, eye_change, revealPassword }) {
  return (
    <div className="divInputBox">
      <input
        type={revealPassword && "password"}
        className="inputBox"
        value={password}
        size="40"
        height="40px"
        pattern="(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*"
        maxLength={40}
        minLength={8}
        placeholder={"Password123!"}
        onInput={handleChangePass}
        onInvalid={handleInvalid}
        required
      />
      <br />
      {(revealPassword) &&
        <img src={eye_closed} alt="password_eye_open" className="password_eye" onClick={eye_change}></img>
      }
      {(!revealPassword) &&
        <img src={'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-eye-512.png'} alt="password_eye_closed" className="password_eye" onClick={eye_change}></img>
      }
    </div>
  )
}
function EmailInput({ email, handleChangeEmail, handleSubmit }) {
  return (
    <div className="divInputBox">
      <input
        className="inputBox"
        type="email"
        value={email}
        size="40"
        height="40px"
        placeholder={"Example@gmail.com"}
        onInput={handleChangeEmail}
        maxLength={40}
        minLength={6}
        title="Must contain at least one number and one uppercase letter"
        onInvalid={handleSubmit}
        required

      />
    </div>
  )
}

export function MainPage() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerCol] = useGlobalState("headerColor");
  // const [darkMode] = useGlobalState('DarkMode');
  const [wordColor] = useGlobalState('wordColor');
  const [divSearchBarClass, setDivSearchBarClass] = useState("searchBox")
  const [searchBarClass, setSearchBarClass] = useState("searchBar")
  const [LetterUser, setLetterUser] = useState("");
  const [showUserData, setShowUserData] = useState(false);
  const [dataset, setDataset] = useState([])
  const [previousMoviesButton, setPreviousMoviesButton] = useState(false);
  const [acc] = useGlobalState('account')
  const [em] = useGlobalState('usesEmail')
  // function dark_mode() {
  //   if (darkMode) {

  //     setGlobalState('DarkMode', false);
  //     setGlobalState('headerColor', '#708090');
  //     setGlobalState('wordColor', 'black');
  //     setGlobalState("backgroundColor", '#f0eee9');
  //   } else {

  //     setGlobalState('DarkMode', true);
  //     setGlobalState('headerColor', '#07000f');
  //     setGlobalState('wordColor', 'white');
  //     setGlobalState("backgroundColor", '#1f2833');
  //   }
  // }

  function handleSubmit(e) {
    e.preventDefault();


    const data = {
      username: LetterUser,
      account: acc,
      emailExists: em,
      type: "LetterUser"
    }
    fetch('http://localhost:5000/3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'failure') {

          alert(data.message);

        } else {

          setDivSearchBarClass("changeSeachBox")
          setSearchBarClass('changeSearchBar')
          setDataset(data.data)
          setShowUserData(true)




        }

      })
      .catch((error) => {
        console.error('Error:', error);
      });



    setLetterUser("")
  }
  function showPrevMovies() {
    setPreviousMoviesButton(!previousMoviesButton);
  }
  return (
    <div>
      <div className='page' style={{ backgroundColor: backgroundColor }}>

        <header className="header" style={{ backgroundColor: headerCol, display: 'flex', alignItems: 'center' }}>

          <div>
            <h1 style={{ color: wordColor, width: '75vw' }}>LetterBoxd WatchList</h1>
          </div>
        </header>


        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: showUserData ? 'flex-start' : 'center', width: '100%' }}>
  {showUserData && (
    <div style={{ marginLeft: '6vh' }}>
      <button style={{ display: 'flex', alignItems: 'center', width: '20vw', justifyContent: 'center' }} onClick={showPrevMovies}>
        My Previous Suggestions
      </button>
    </div>
  )}
  {/* <form onSubmit={handleSubmit} style={{ justifyContent: 'center', position: showUserData ? 'relative' : 'static', left: showUserData ? '6.3vw' : '0' }}>
    <div className={divSearchBarClass}>
      <input
        value={LetterUser}
        className={searchBarClass}
        size="60"
        height="40px"
        maxLength={30}
        minLength={6}
        placeholder="Enter LetterBoxed Username"
        onChange={(e) => setLetterUser(e.target.value)}
        required
      />
    </div>
  </form> */}
  <form onSubmit={handleSubmit} style={{ display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
    <div className={divSearchBarClass} >
      <input
        value={LetterUser}
        className={searchBarClass}
        size="60"
        height="6.339vh"
        maxLength={30}
        minLength={6}
        placeholder="Enter LetterBoxed Username"
        onChange={(e) => setLetterUser(e.target.value)}
        required
      />
    </div>
  </form>
</div>

        <div style={{ display: 'flex', height: '100%' }}>
          {previousMoviesButton && (
            <div style={{ padding: '5px', position: 'absolute', height: '80vh', maxHeight: '100vh', overflowY: 'auto' }} className="hide-scrollbar">
              {/* First div with fixed width of 50px */}
              <div style={{
                width: '25vw',
                height: '100%',
                overflowY: 'auto', // Change overflow to overflowY
                wordWrap: 'break-word',
                backgroundColor: 'grey',
                borderRight: '5px solid black',
                borderRadius: '10px'
              }} className="hide-scrollbar">
                {/* previous movies selected from user */}
                <h1 style={{ color: wordColor }}>{window.innerHeight}</h1>
                <h1 style={{ color: wordColor }}>{window.innerWidth}</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}>Previous Movies</h1>
                <h1 style={{ color: wordColor }}> Movies</h1>
              </div>
            </div>
          )}

          {/* Second div that takes up the remaining space */}
          <div style={{ width: '100%', maxWidth: '100vw', textAlign: 'center' }}>


            {showUserData && (
              <div style={{ overflowY: 'auto'  }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <img style={{ padding: '5px'}} src={dataset['posterImg']} alt="Poster" />
                  <div style={{ width: '600px' }}>
                    <h1 style={{ color: wordColor }}>{dataset['title']}</h1>
                    <p style={{ color: wordColor }}>{dataset['tagline']}</p>
                    <p style={{ color: wordColor }}>{dataset['description']}</p>
                    <ExternalLink url={dataset['whereToWatch']} />
                  </div>
                </div>
                <VideoPlayer src={dataset['trailer']} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

function VideoPlayer({ src }) {

  return (
    <div className="video-container">
      <iframe
        width="560"
        height="315"
        src={src}
        title="Trailer"
        style={{ border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

    </div>
  );
};

function ExternalLink({ url }) {
  return (
    <div>
      <h1 style={{ color: 'white' }}>Where To Watch</h1>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
        Visit External Site
      </a>
    </div>
  );
};