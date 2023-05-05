import React, { useState } from "react";
import Login from "./Login";
import Logout from "./Logout";
const Auth = () => {
  const [loginEmail, setloginEmail] = useState(
    localStorage.getItem("loginEmail")
      ? localStorage.getItem("loginEmail")
      : null
  );
  const handleFailure = (result) => {
    const error = result?.error;
    alert(error);
  };

  const handleLogin = (googleData) => {
    console.log(googleData.profileObj); // need profile obj
    setloginEmail(googleData.profileObj.email);
    localStorage.setItem("loginEmail", googleData.profileObj.email);
    localStorage.setItem("loginName", googleData.profileObj.name);
  };
  const handleLogout = () => {
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("loginName");
    setloginEmail(null);
    alert("Sign out Successful!");
  };
  return (
    <div>
      {loginEmail ? (
        <div>
          <Logout handleLogout={handleLogout} />
        </div>
      ) : (
        <div>
          <Login handleLogin={handleLogin} handleFailure={handleFailure} />
        </div>
      )}
    </div>
  );
};

export default Auth;
