import "./ForgetPasswordPage.css";
const ForgetPasswordPage = () => {
  function handleBtn() {}

  return (
    <div className="forget-page-div">
      <h1>Daily Task Manager</h1>
      <div className="email-div">
        <h3>Email:</h3>
        <input tpye="text" placeholder="Enter Email Here" />
      </div>
      <button onClick={handleBtn}>Reset Password</button>
    </div>
  );
};

export default ForgetPasswordPage;
