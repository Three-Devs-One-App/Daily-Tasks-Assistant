function Profile({setPage,sessionStatus}){
    const handleClickLogout = () => {
        sessionStatus((currentValue) => !currentValue);
        fetch('http://localhost:8080/Logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
        console.log('fontend logout')
        setPage("Login");
      };


    return(
        <div>
            <h1>Testing Page</h1>
            <button id='Logout' onClick = {handleClickLogout}> Logout </button>
        </div>
    );
}
export default Profile;