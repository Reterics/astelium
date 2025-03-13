import {useEffect, useState} from "react";
import {useAuth} from "../../hooks/useAuth.ts";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    subscription_plan: "free",
  });

  const [loading, setLoading] = useState(false);
  const {user, login} = useAuth();
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        credentials: "include"
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        await login(form.email, form.password);
        //window.location.href = "/admin/dashboard"; // Redirect after success
      }
    } else {
      setError("Registration failed. Please check your details.");
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = '/admin/dashboard';
    }
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Create an Account</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Start managing your projects efficiently.</p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-md focus:ring-2 focus:ring-zinc-500 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-md focus:ring-2 focus:ring-zinc-500 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-md focus:ring-2 focus:ring-zinc-500 outline-none"
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
            className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-md focus:ring-2 focus:ring-zinc-500 outline-none"
          />

          <select
            name="subscription_plan"
            value={form.subscription_plan}
            onChange={handleChange}
            className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-md focus:ring-2 focus:ring-zinc-500 outline-none"
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>

          <button
            type="submit"
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Already have an account? <a href="/login" className="text-zinc-700 dark:text-zinc-300 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
