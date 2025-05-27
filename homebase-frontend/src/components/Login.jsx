import React from "react";

const Login = () => {

const handleClick = (e) => {
  e.preventDefault();
  // setFullFilename(filename);
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

  return<>
    <form onSubmit={handleClick}>
        <input
          type="text"
          // value={filename}
          // onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter User"
        />
        <button type="submit">Login</button>
      </form>
  </>
}

export default Login