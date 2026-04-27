import { React, useState } from "react";

export type user = {
  username: string;
  password: string;
};

function validateLogin(
  username: string,
  password: string,
  allUsers: user[],
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void,
  setError: (value: Error | null) => void,
) {
  const user = allUsers.find((u) => u.username === username);
  if (!user) {
    setError(new Error(`No user with username "${username}"`));
    return;
  } else {
    if (user.password === password) {
      setCurrentPage("app");
      return;
    } else {
      setError(new Error(`Wrong password`));
      return;
    }
  }
}

function saveUser(
  username: string,
  password: string,
  setError: (value: Error) => void,
  allUsers: user[],
  setAllUsers: (value: user[]) => void,
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void,
): void {
  if (username.length === 0 && password.length === 0) {
    setError(new Error("Username and password cannot be empty"));
    return;
  }
  if (username.length === 0) {
    setError(new Error("Username cannot be empty"));
    return;
  }
  if (password.length === 0) {
    setError(new Error("Password cannot be empty"));
    return;
  }

  const newUser: user = { username: username, password: password };
  setAllUsers([...allUsers, newUser]);
  setCurrentPage("app");
}

interface LoginInterface {
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void;
  allUsers: user[];
  setAllUsers: (value: user[]) => void;
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
          onClick={() => {
            validateLogin(
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
          onClick={() => {
            setSignUp(false);
            saveUser(
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
