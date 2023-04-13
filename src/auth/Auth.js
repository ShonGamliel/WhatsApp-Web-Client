import React from "react";
import axios from "axios";
import "./Auth.css";
import { login, register } from "../server/Server";

export default function Auth({ setUser }) {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [loginusername, setLoginusername] = React.useState();
  const [loginpassword, setLoginPassword] = React.useState();
  const [error, setError] = React.useState(false);

  return (
    <div id="auth-dialog">
      {error ? <div className="error-box">{error}</div> : <></>}

      <input id="main-checkbox" type="checkbox" />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          register(username, password).then((res) => {
            if (res.data.error) {
              setError(res.data.message);
              setTimeout(() => setError(false), 6000);
            } else {
              setUser(res.data.user);
            }
          });
        }}
        id="register-form"
        className="main-form"
      >
        <div id="main-logo">ChatiFy</div>
        <input type="text" placeholder="Username" name="username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
        <label htmlFor="main-checkbox">Already have an account?</label>
      </form>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          login(loginusername, loginpassword).then((res) => {
            if (res.data.error) {
              setError(res.data.message);
              setTimeout(() => setError(false), 6000);
            } else {
              console.log(res.data);
              setUser(res.data.user);
            }
          });
        }}
        id="login-form"
        className="main-form"
      >
        <div id="main-logo">ChatiFy</div>
        <input type="text" placeholder="Username" name="username" onChange={(e) => setLoginusername(e.target.value)} />
        <input type="password" placeholder="Password" name="password" onChange={(e) => setLoginPassword(e.target.value)} />
        <button type="submit">Login</button>
        <label htmlFor="main-checkbox">Don't have an account?</label>
      </form>
    </div>
  );
}
