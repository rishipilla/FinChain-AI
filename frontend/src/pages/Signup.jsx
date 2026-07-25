import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input className="border w-full p-2 rounded mb-3" placeholder="Name"
          value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="border w-full p-2 rounded mb-3" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="border w-full p-2 rounded mb-3" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Sign Up</button>
        <p className="text-sm mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}