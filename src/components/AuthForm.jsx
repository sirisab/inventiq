"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function AuthForm() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const bodyData = JSON.stringify({
    email,
    password,
    name,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      if (!response.ok) {
        let errorData = {};

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json(); // Hämta felmeddelandet som JSON

          if (errorData.message) {
            setError(errorData.message || "Invalid login credentials");
          } else {
            setError("An unknown error occurred");
          }
        } else {
          setError("Error: Server did not return JSON");
        }
        return;
      }
      const data = await response.json();
      localStorage.setItem("@library/token", data.token);
      auth.setToken(data.token);
      router.push("/items");
    } catch (error) {
      console.error("Caught error:", error.message);
      setError("Registration failed: " + error.message); // Visa felmeddelande till användaren
    }
  }
  return (
    <div className="auth-form-container">
      <div className="auth-fields">
        <form onSubmit={handleSubmit}>
          <div className="form__group">
            <h3>{isLogin ? "Login" : "Register"}</h3>
            <label className="form__label">Email</label>
            <input
              className="form__input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>
          <div className="form__group">
            <label className="form__label">Password</label>
            <input
              className="form__input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          {!isLogin && (
            <div className="form__group">
              <label className="form__label">Name</label>
              <input
                className="form__input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></input>
            </div>
          )}
          <button className="form__button form__button--primary">
            {isLogin ? "Login" : "Register"}
          </button>
          <button
            className="form__button form__button--secondary"
            type="button"
            onClick={(e) => {
              setIsLogin(!isLogin);
            }}
          >
            {!isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
      {error && <div className="error-message">{error}</div>}{" "}
    </div>
  );
}

export default AuthForm;
