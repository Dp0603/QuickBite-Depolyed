import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add registration logic here
    alert(`Name: ${name}\nEmail: ${email}\nRole: ${role}\nPassword: ${password}`);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        Register for QuickBite
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-secondary mb-1">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-secondary mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-secondary mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-secondary mb-1">Role</label>
          <select
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant Owner</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}