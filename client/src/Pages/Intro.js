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
    setPage("ForgetPassword");
  };

  return (
    <div className="AppComponent">
      <h1 className="page-title">Daily Task Assistant</h1>
      <h2>Plan, Executive and Evaluate</h2>
      <h3>
        By:{<br />}Jiaqi Cheng{<br />}Zuxiang Wang{<br />}Siliang Lihuang
      </h3>
      <button
        className="intro-button"
        id="signup"
        onClick={handleSignUpClicked}
      >
        Get Started
      </button>
      <button
        className="intro-button"
        id="signin"
        onClick={handleSignInClicked}
      >
        Sign In
      </button>
      <button
        className="intro-button"
        id="forgetP"
        onClick={handleForgetClicked}
      >
        Forget Password
      </button>
    </div>
  );
}

export default IntroPage;
