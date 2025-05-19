import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [err, setErr] = useState('');

  const validate = () => {
    const { name, email, password, address } = form;
    const errors = [];

    if (!name || name.length < 20 || name.length > 60) {
      errors.push("Name must be between 20 and 60 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
      errors.push("Password must be 8–16 characters, and include at least 1 uppercase and 1 special character.");
    }

    if (!address || address.length > 400) {
      errors.push("Address must be 400 characters or less.");
    }

    return errors.length ? errors.join('\n') : null;
  };

  const submit = async e => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);

    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      alert('Registered!');
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (e) {
      setErr(e.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={submit}>
        {err && <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{err}</p>}
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        /><br />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        /><br />
        <input
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        /><br />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
          <option value="admin">Admin</option>
        </select><br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
