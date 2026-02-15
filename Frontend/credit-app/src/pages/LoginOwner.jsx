import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:7600/ilba/loginOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // store login info
      localStorage.setItem("ownerToken", data.token);
      localStorage.setItem("ownerEmail", email);
      localStorage.setItem(
        "ownerData",
        JSON.stringify({
          OrganisationCode: data.OrganisationCode,
          email,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        body {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          font-family: "Segoe UI", sans-serif;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-box {
          background: white;
          padding: 30px;
          width: 360px;
          border-radius: 10px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
        }

        .login-box h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #2a5298;
        }

        .login-box input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .login-box input:focus {
          outline: none;
          border-color: #2a5298;
        }

        .login-box button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: #2a5298;
          color: white;
          font-size: 15px;
          cursor: pointer;
        }

        .login-box button:disabled {
          background: #9bb0d3;
          cursor: not-allowed;
        }

        .error {
          color: red;
          font-size: 13px;
          text-align: center;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="login-container">
        <div className="login-box">
          <h2>Owner Login</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
