import React from "react";
import { useState, useEffect } from "react";



const Login = (setActualUsername) => {
  const [username, setUsername] = useState("")
  const [loggedIn, setLoggedIn] = useState("")

  const handleLogin = (event) => {
    event.preventDefault();
    setLoggedIn(username);
    setActualUsername["setActualUsername"](username);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setLoggedIn("");
    setUsername("");
    setActualUsername["setActualUsername"]("");  
  }

  return<>
    {!loggedIn ?
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter User"
        />
        <button type="submit">Login</button>
      </form> :
      <form onSubmit={handleLogout}>
        <input
          type="text"
          value={username}
          readOnly
        />
        <button type="submit">Logout</button>
      </form>
    }
  </>
}

export default Login