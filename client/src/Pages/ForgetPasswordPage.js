import "./Pages.css";
const ForgetPasswordPage = () => {
  function handleBtn(e) {
    e.preventDefault();

    const inpElem = document.getElementById("enterEmail");

    fetch("http://localhost:8080/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: inpElem.value }),
    })
      .then(async (res) => {
        window.alert(
          "If the input emails exists, a reset link has been sent to your inbox, be sure to check if spam folder"
        );
      })
      .catch((err) => {
        console.log(err);
        window.alert("An error has occured while processing this request");
      });

    inpElem.value = "";
  }

  return (
    <div className="forget-page-div">
      <h1 className="page-title">Daily Task Assistant</h1>
      <h3 id="e3">Email:</h3>
      <form className="intro-form" onSubmit={handleBtn}>
        <input
          className="intro-input"
          id="enterEmail"
          type="text"
          placeholder="Enter Email Here"
        />
        <button className="intro-button" id="ResetButton" onClick={handleBtn}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
