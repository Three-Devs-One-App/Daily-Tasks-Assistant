import "./ForgetPasswordPage.css";
const ForgetPasswordPage = () => {
  function handleBtn() {}

  return (
    <div className="forget-page-div">
      <h1>Daily Task Assistant</h1>
      <h3 id="e3">Email:</h3>
      <input id="enterEmail" type="text" placeholder="Enter Email Here" />
      <button id="ResetButton" onClick={handleBtn}>Reset Password</button>
    </div>
  );
};

export default ForgetPasswordPage;
