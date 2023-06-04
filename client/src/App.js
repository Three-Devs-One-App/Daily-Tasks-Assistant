import React from "react";
import { useEffect, useState } from "react";
import IntroPage from './AppComponent/AppComponent.js';
import Signup from './AppComponent/SignUp.js';
import Profile from './AppComponent/Profile.js';
import ForgetPasswordPage from "./AppComponent/ForgetPasswordPage/ForgetPasswordPage.js";
import './App.css'
function App() {

  const [state, setState] = useState('Intro');//debug use for default setting signup page

  const [user,setuser] = useState({})
    const handleClickSignUp = () => {
        setState('SignUp');
      }
    const handleClickAlreadySignUp = () => {
        setState('Al-SignUp');
      }
    const handleClickForget = () =>{
        setState('Forget');
    }
      const handleUserSignUp = (inputData) => {
        setuser(inputData);
        setState('profile');
        
        fetch('http://localhost:8080/user', {
          method: 'POST', //communicate to backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputData),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

  return (
    <div className="App">
      {state === 'Intro' && <IntroPage signupClicked={handleClickSignUp} forgetClicked={handleClickForget}/>}
      {state === 'SignUp' && <Signup alreadysignclick={handleClickAlreadySignUp}  submitSignclick={handleUserSignUp}/>}
      {state === 'Al-SignUp' && <IntroPage signupClicked={handleClickSignUp} forgetClicked={handleClickForget}/>}
      {state === 'profile' && <Profile user={user} />}
      {state==='Forget'&&<ForgetPasswordPage />}
    </div>
  );//the al-signup is temperaily change to intro page now
}

export default App;
