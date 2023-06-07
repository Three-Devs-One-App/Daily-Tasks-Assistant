import React from 'react';
import './AppComponent.css';

function IntroPage({signupClicked,SignInClicked,forgetClicked}){

    
    return(
    <div className="AppComponent">
        <h1>Daily Task Assistant</h1>
        <h2>Plan, Executive and Evaluate</h2>
        <h3>
            By:{<br />}Jiaqi Cheng{<br />}Zuxiang Wang{<br />}Siliang Lihuang
        </h3>
        <button id="signup" onClick={signupClicked}>Get Started</button>
        <button id="signin" onClick={SignInClicked}>Sign In</button>
        <button id="forgetP" onClick={forgetClicked}>Forget Password</button>
    </div>
    );
}

export default IntroPage;