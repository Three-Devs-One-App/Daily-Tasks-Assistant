import React from "react";
import "./Pages.css";

function IntroPage({ setPage }) {
  const handleSignUpClicked = () => {
    setPage("SignUp");
  };

  const handleSignInClicked = () => {
    setPage("Login");
  };

  const handleForgetClicked = () => {
    setPage("Forget");
  };

  return (
    <div className="AppComponent">
      <h1>Daily Task Assistant</h1>
      <h2>Plan, Executive and Evaluate</h2>
      <h3>
        By:{<br />}Jiaqi Cheng{<br />}Zuxiang Wang{<br />}Siliang Lihuang
      </h3>
      <button id="signup" onClick={handleSignUpClicked}>
        Get Started
      </button>
      <button id="signin" onClick={handleSignInClicked}>
        Sign In
      </button>
      <button id="forgetP" onClick={handleForgetClicked}>
        Forget Password
      </button>
    </div>
  );
}

export default IntroPage;
