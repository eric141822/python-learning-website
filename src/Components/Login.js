import React from "react";
import { GoogleLogin } from "react-google-login";
const clientId =
  "304100857027-4i4mnus9d1nloiagkbmn6s6jdb2gojf6.apps.googleusercontent.com";

const Login = ({ handleLogin, handleFailure }) => {
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Sign in with Google"
        onSuccess={handleLogin}
        onFailure={handleFailure}
        cookiePolicy={"single_host_origin"}
        style={{ margin: "10px" }}
      />
    </div>
  );
};

export default Login;
