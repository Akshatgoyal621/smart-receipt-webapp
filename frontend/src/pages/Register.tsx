import React, { useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { email, password, name });
      login(data.token, data.user);
      nav('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Register failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md my-40 mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-2">Create account</h2>
        <p className="text-sm text-gray-500 mb-4">Get started with Smart Receipts — capture receipts, track expenses.</p>
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required
                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required
                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required
                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <button type="submit" disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-brand-500 font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
