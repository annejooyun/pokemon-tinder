export type user = {
  username: string;
  passwordHash: string;
};

export async function saveUser(
  username: string,
  password: string,
  setError: (value: Error) => void,
  allUsers: user[],
  setAllUsers: (value: user[]) => void,
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void,
): Promise<void> {
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

  const passwordHash = await hashPassword(password);

  const newUser: user = { username: username, passwordHash: passwordHash };
  setAllUsers([...allUsers, newUser]);
  setCurrentPage("app");
}

export async function validateLogin(
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
  }

  // Verify password against stored hash
  const isValid = await verifyPassword(password, user.passwordHash);

  if (isValid) {
    setCurrentPage("app");
  } else {
    setError(new Error("Wrong password"));
  }
}

export async function hashPassword(password: string): Promise<string> {
  // Convert password to bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export async function verifyPassword(
  inputPassword: string,
  storedHash: string,
): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}
