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
      // 1. Login
      const loginRes = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({ username: username.trim() }),
      });
      
      if (!loginRes.ok) {
        alert('> ERROR: LOGIN FAILED');
        setIsLoading(false);
        return;
      }

      const loginData = await loginRes.json();
      
      // 2. Récupérer la progression depuis la base de données
      const profileRes = await fetch('http://localhost:3000/api/profile', {
        credentials: 'include'
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        
        // 3. Synchroniser avec localStorage
        const profile = { 
          username: profileData.username, 
          joinedAt: Date.now() 
        };
        localStorage.setItem('xssctf_profile', JSON.stringify(profile));
        
        // Synchroniser la progression
        if (profileData.progress) {
          localStorage.setItem('xssctf_progress', JSON.stringify(profileData.progress));
        }
        
        router.push('/lobby');
      } else {
        // Fallback si le profil n'est pas disponible
        const profile = { username: loginData.username, joinedAt: Date.now() };
        localStorage.setItem('xssctf_profile', JSON.stringify(profile));
        router.push('/lobby');
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
      // 1. Login
      const loginRes = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: demoUser }),
      });
      
      if (!loginRes.ok) {
        alert('> ERROR: DEMO LOGIN FAILED');
        setIsLoading(false);
        return;
      }

      const loginData = await loginRes.json();
      
      // 2. Récupérer la progression
      const profileRes = await fetch('http://localhost:3000/api/profile', {
        credentials: 'include'
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        
        // 3. Synchroniser
        const profile = { username: profileData.username, joinedAt: Date.now() };
        localStorage.setItem('xssctf_profile', JSON.stringify(profile));
        
        if (profileData.progress) {
          localStorage.setItem('xssctf_progress', JSON.stringify(profileData.progress));
        }
        
        router.push('/lobby');
      } else {
        const profile = { username: loginData.username, joinedAt: Date.now() };
        localStorage.setItem('xssctf_profile', JSON.stringify(profile));
        router.push('/lobby');
      }
    } catch (e) {
      console.error(e);
      alert('> ERROR: CONNECTION FAILED');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Matrix Rain Background Effect */}
      <MatrixRain />

      {/* Terminal Window */}
      <div className="pixel-border bg-[#1a0000] p-8 max-w-2xl w-full relative z-10">
        {/* Terminal Header */}
        <div className="border-b-2 border-[#ff0033] pb-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#ff0000] pixel-border"></div>
            <div className="w-3 h-3 bg-[#ffb000] pixel-border"></div>
            <div className="w-3 h-3 bg-[#ff0033] pixel-border"></div>
            <span className="ml-4 font-['Press_Start_2P'] text-xs">TERMINAL v1.0</span>
          </div>
          <h1 className="font-['Press_Start_2P'] text-2xl md:text-3xl text-glow mb-2">
            HackMatrixHILOX
          </h1>
          <p className="font-['VT323'] text-xl text-[#ff3333]">
            &gt; CLASSIFIED SECURITY TRAINING SYSTEM
          </p>
        </div>

        {/* Boot Sequence */}
        <div className="mb-6 font-['VT323'] text-lg space-y-1">
          <p className="text-[#ff3333]">&gt; SYSTEM BOOT... OK</p>
          <p className="text-[#ff3333]">&gt; LOADING SECURITY PROTOCOLS... OK</p>
          <p className="text-[#ff3333]">&gt; INITIALIZING XSS CHALLENGE... OK</p>
          <p className="text-[#ffb000] cursor-blink">&gt; AWAITING USER CREDENTIALS</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div>
            <label className="block font-['Press_Start_2P'] text-xs mb-3 text-[#ff0033]">
              [ USERNAME ]
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-['VT323'] text-xl text-[#ff3333]">
                &gt;
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="ENTER_YOUR_HANDLE"
                disabled={isLoading}
                className="w-full bg-[#0d0202] border-2 border-[#ff0033] text-[#ff0033] 
                         font-['VT323'] text-2xl px-12 py-3 focus:outline-none 
                         focus:shadow-[0_0_20px_rgba(255,0,51,0.5)] 
                         placeholder:text-[#440000] uppercase
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
          <div className="border-2 border-[#440000] bg-[#110000] p-4">
            <p className="font-['VT323'] text-lg text-[#ff3333] leading-relaxed">
              &gt; MISSION BRIEFING:<br/>
              &gt; ENTER CODENAME AND INITIALIZE SESSION<br/>
              &gt; COMPLETE XSS CHALLENGES TO ADVANCE<br/>
              &gt; WARNING: FOR EDUCATIONAL USE ONLY<br/>
              &gt; SYSTEM STATUS: <span className="text-[#ff0033] text-glow">ONLINE</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-[#440000]">
          <p className="font-['VT323'] text-sm text-[#ff3333] text-center">
            &gt; NUIT DE L&apos;INFO 2025 - HILOX TEAM &lt;
          </p>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[600px] h-[600px] bg-[#ff0033] opacity-5 blur-[100px] rounded-full">
        </div>
      </div>
    </div>
  );
}
