import { useState } from "react";
import * as A from "./auth";

interface LoginInterface {
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void;
  allUsers: A.user[];
  setAllUsers: (value: A.user[]) => void;
}

export function Login({
  setCurrentPage,
  allUsers,
  setAllUsers,
}: LoginInterface) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signUp, setSignUp] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  let codeBlock = null;
  if (!signUp) {
    codeBlock = (
      <>
        <button
          className="submit"
          type="submit"
          onClick={async () => {
            await A.validateLogin(
              username,
              password,
              allUsers,
              setCurrentPage,
              setError,
            );
          }}
        >
          LOG IN
        </button>

        <button className="sign-up" onClick={() => setSignUp(true)}>
          SIGN UP
        </button>
      </>
    );
  } else {
    codeBlock = (
      <>
        <button
          className="sign-up"
          onClick={async () => {
            setSignUp(false);
            await A.saveUser(
              username,
              password,
              setError,
              allUsers,
              setAllUsers,
              setCurrentPage,
            );
          }}
        >
          SIGN UP
        </button>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            value={username}
            onChange={handleUsernameInput}
            placeholder="Username"
            className="username-input"
            required
          ></input>
          <input
            type="password"
            value={password}
            onChange={handlePasswordInput}
            placeholder="Password"
            className="password-input"
            required
          ></input>
        </div>

        {codeBlock}
        {error && <p>{`Error: ${error.message}`}</p>}
      </div>
    </>
  );
}
