'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MatrixRain from './components/MatrixRain';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim()) {
      alert('> ERROR: USERNAME REQUIRED');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Store basic profile for UI, but session is handled by cookies
        const profile = { username: data.username, joinedAt: Date.now() };
        localStorage.setItem('xssctf_profile', JSON.stringify(profile));
        router.push('/lobby');
      } else {
        alert('> ERROR: LOGIN FAILED');
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('> ERROR: CONNECTION FAILED');
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    const demoUser = 'PLAYER' + Math.floor(Math.random() * 900 + 100);
    setUsername(demoUser);
    
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: demoUser }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const profile = { username: data.username, joinedAt: Date.now() };
        localStorage.setItem('xssctf_profile', JSON.stringify(profile));
        router.push('/lobby');
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Matrix Rain Background Effect */}
      <MatrixRain />

      {/* Terminal Window */}
      <div className="pixel-border bg-[#001a00] p-8 max-w-2xl w-full relative z-10">
        {/* Terminal Header */}
        <div className="border-b-2 border-[#00ff41] pb-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#ff0000] pixel-border"></div>
            <div className="w-3 h-3 bg-[#ffb000] pixel-border"></div>
            <div className="w-3 h-3 bg-[#00ff41] pixel-border"></div>
            <span className="ml-4 font-['Press_Start_2P'] text-xs">TERMINAL v1.0</span>
          </div>
          <h1 className="font-['Press_Start_2P'] text-2xl md:text-3xl text-glow mb-2">
            XSS BATTLE ARENA
          </h1>
          <p className="font-['VT323'] text-xl text-[#33ff33]">
            &gt; CLASSIFIED SECURITY TRAINING SYSTEM
          </p>
        </div>

        {/* Boot Sequence */}
        <div className="mb-6 font-['VT323'] text-lg space-y-1">
          <p className="text-[#33ff33]">&gt; SYSTEM BOOT... OK</p>
          <p className="text-[#33ff33]">&gt; LOADING SECURITY PROTOCOLS... OK</p>
          <p className="text-[#33ff33]">&gt; INITIALIZING XSS CHALLENGE... OK</p>
          <p className="text-[#ffb000] cursor-blink">&gt; AWAITING USER CREDENTIALS</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div>
            <label className="block font-['Press_Start_2P'] text-xs mb-3 text-[#00ff41]">
              [ USERNAME ]
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-['VT323'] text-xl text-[#33ff33]">
                &gt;
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="ENTER_YOUR_HANDLE"
                disabled={isLoading}
                className="w-full bg-[#0d0208] border-2 border-[#00ff41] text-[#00ff41] 
                         font-['VT323'] text-2xl px-12 py-3 focus:outline-none 
                         focus:shadow-[0_0_20px_rgba(0,255,65,0.5)] 
                         placeholder:text-[#004400] uppercase
                         disabled:opacity-50"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="retro-button py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '[ LOADING... ]' : '[ START ]'}
            </button>
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className="retro-button py-4 bg-transparent border-[#ffb000] text-[#ffb000]
                       hover:bg-[#ffb000] hover:text-[#0d0208]
                       shadow-[3px_3px_0_rgba(255,176,0,0.3),0_0_10px_rgba(255,176,0,0.3)]
                       hover:shadow-[5px_5px_0_rgba(255,176,0,0.3),0_0_20px_rgba(255,176,0,0.5)]
                       disabled:opacity-50"
            >
              [ DEMO MODE ]
            </button>
          </div>

          {/* Info Box */}
          <div className="border-2 border-[#004400] bg-[#001100] p-4">
            <p className="font-['VT323'] text-lg text-[#33ff33] leading-relaxed">
              &gt; MISSION BRIEFING:<br/>
              &gt; ENTER CODENAME AND INITIALIZE SESSION<br/>
              &gt; COMPLETE XSS CHALLENGES TO ADVANCE<br/>
              &gt; WARNING: FOR EDUCATIONAL USE ONLY<br/>
              &gt; SYSTEM STATUS: <span className="text-[#00ff41] text-glow">ONLINE</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-[#004400]">
          <p className="font-['VT323'] text-sm text-[#33ff33] text-center">
            &gt; NUIT DE L&apos;INFO 2025 - HILOX TEAM &lt;
          </p>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[600px] h-[600px] bg-[#00ff41] opacity-5 blur-[100px] rounded-full">
        </div>
      </div>
    </div>
  );
}
