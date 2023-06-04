import React from 'react';
function Profile({user}) {
    //testing purpose to show the object
    return (
      <div>
        {Object.entries(user).map(([key, value], index) => (
          <p key={index}>{key}: {value}</p>
        ))}
      </div>
    );
}

export default Profile;