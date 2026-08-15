import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Waves from '../components/Waves';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user || {}));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] relative overflow-hidden">
      <Waves
        lineColor="rgba(16, 185, 129, 0.3)"
        backgroundColor="rgba(5, 7, 13, 0.8)"
        waveSpeedX={0.0125}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/[0.03] border border-white/10 backdrop-blur-sm p-8 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">FinChain AI Login</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input className="border w-full p-2 rounded mb-3" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="border w-full p-2 rounded mb-3" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
        <p className="text-sm mt-3 text-slate-400">No account? <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">Sign up</Link></p>
      </form>
    </div>
  );
}