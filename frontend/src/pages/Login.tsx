import React, {useState, useContext} from "react";
import API from "../api/axios";
import {AuthContext} from "../context/AuthContext";
import {useNavigate, Link} from "react-router-dom";
import {useNotify} from "../components/NotificationBus";

export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const {login} = useContext(AuthContext);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const notify = useNotify();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {data} = await API.post("/auth/login", {email, password});
      login(data.token, data.user);
      notify({
        title: "Successfully logged in",
        message: `Welcome ${email}`,
      });
      nav("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md my-40 mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sign in to manage receipts and export reports
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          New to Smart Receipts?{" "}
          <Link to="/register" className="text-brand-500 font-medium">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
