import React from "react";
import { useEffect, useState } from "react";
import "./AppComponent.css";

function IntroPage() {
  return (
    <div className="AppComponent">
      <h1>Daily Task Assistant</h1>
      <h2>Plan, Executive and Evaluate</h2>
      <h3>
        By:{<br />}Jiaqi Cheng{<br />}Zuxiang Wang{<br />}Siliang Lihuang
      </h3>
      <button id="signup">Get Started</button>
      <button id="signin">Sign In</button>
    </div>
  );
}

export default IntroPage;
