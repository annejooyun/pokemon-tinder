import { React, useState } from "react";

type user = {
  username: string;
  password: string;
};

interface LoginInterface {
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void;
}

let allUsers = [
  { username: "AJ", password: "Mabel" },
  { username: "Herman", password: "Mabel1" },
];

function validateLogin(username: string, password: string, setCurrentPage) {
  const user = allUsers.find((u) => u.username === username);
  if (!user) {
    console.log(`No user with username ${username}`);
    return;
  } else {
    if (user.password === password) {
      setCurrentPage("app");
      return;
    } else {
      console.log("Wrong password");
      return;
    }
  }
}

export function Login({ setCurrentPage }: LoginInterface) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          value={username}
          onChange={handleUsernameInput}
          placeholder="Username"
          required
        ></input>
        <input
          type="password"
          value={password}
          onChange={handlePasswordInput}
          placeholder="Password"
          required
        ></input>
      </div>

      <div className="botton">
        <button
          className="submit"
          type="submit"
          onClick={() => validateLogin(username, password, setCurrentPage)}
        >
          LOG IN
        </button>
      </div>
      <div className="signup">
        Don't Have An Account?<a href="signup.html"> sign up</a>
      </div>
    </div>
  );
}
