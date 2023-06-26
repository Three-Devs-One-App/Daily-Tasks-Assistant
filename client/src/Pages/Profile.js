import { useEffect } from "react";
function Profile({ setPage, setLoggedIn }) {
  const handleClickLogout = () => {
    fetch("http://localhost:8080/Logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // This returns a promise
      })
      .then(() => {
        console.log("fontend logout");
        setPage("Login");
        setLoggedIn(false);
      })
      .catch((error) => console.log("There was an error!", error));
  };

  useEffect(() => {
    fetch("http://localhost:8080/check-login", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.loggedIn);
        console.log("inside useeffect change");
      })
      .catch((error) => {
        console.error("Error checking login state", error);
      });
  }, []);

  return (
    <div>
      <h1>Testing Page</h1>
      <button id="Logout" onClick={handleClickLogout}>
        {" "}
        Logout{" "}
      </button>
    </div>
  );
}
export default Profile;
