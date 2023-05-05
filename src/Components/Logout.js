import React from "react";
import { GoogleLogout } from "react-google-login";
const clientId =
  "304100857027-4i4mnus9d1nloiagkbmn6s6jdb2gojf6.apps.googleusercontent.com";

const Logout = ({ handleLogout }) => {
  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Sign Out"
        onLogoutSuccess={handleLogout}
      ></GoogleLogout>
    </div>
  );
};

export default Logout;
