interface landingInterface {
  setCurrentPage: (
    value: "app" | "settings" | "liked" | "login" | "landing" | "signup",
  ) => void;
}

export function Landing({ setCurrentPage }: landingInterface) {
  return (
    <>
      <div className="container">
        <button className="login" onClick={() => setCurrentPage("login")}>
          LOG IN
        </button>

        <button className="sign-up" onClick={() => setCurrentPage("signup")}>
          SIGN UP
        </button>
      </div>
    </>
  );
}
