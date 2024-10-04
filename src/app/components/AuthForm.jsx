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
    name: !name ? "" : name,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log(bodyData);
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    });

    if (!response.ok) {
      const errorData = await response.json(); // Hämta felmeddelandet från servern
      console.log("Error Status:", response.status); // Logga statuskoden
      console.log("Error Message:", errorData.message); // Logga felmeddelandet
      throw new Error(errorData.message || "An error occurred");
    }

    const data = await response.json();
    localStorage.setItem("@library/token", data.token);
    auth.setToken(data.token);
    router.push("/items");
    return;

    setError("Invalid login credentials");
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <div className="form__group">
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
  );
}

export default AuthForm;
