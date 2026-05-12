import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      /*
        STEP 1:
        Get CSRF cookie from Django
      */

      await fetch(
        "http://127.0.0.1:8000/api/csrf/",
        {
          credentials: "include",
        }
      );

      /*
        STEP 2:
        Login request
      */

      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      /*
        SUCCESS
      */

      if (data.success) {

        if (data.role === "resident") {

          navigate("/resident");

        } else if (data.role === "staff") {

          navigate("/staff");

        } else if (data.role === "manager") {

          navigate("/manager");
        }

      } else {

        setError(data.detail || "Login failed");
      }

    } catch (error) {

      console.error(error);

      setError("Server error");
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="mb-4">
        Login
      </h2>

      <form onSubmit={handleLogin}>

        <div className="mb-3">

          <label className="form-label">
            Username
          </label>

          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

        </div>

        {
          error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )
        }

        <button
          type="submit"
          className="btn btn-primary"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;