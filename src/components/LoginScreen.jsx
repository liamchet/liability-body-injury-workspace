import { useState } from "react";
import PulseBrand from "./PulseBrand";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onLogin({ username, password });
  };

  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <PulseBrand variant="login" />
        <h1>ברוכים הבאים</h1>
        <p>התחברות למערכת פנימית להצגת פרופיל תביעה</p>
        <label>שם משתמש<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>
        <label>סיסמה<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
        <button className="login-button" type="submit">כניסה למערכת</button>
      </form>
    </main>
  );
}
