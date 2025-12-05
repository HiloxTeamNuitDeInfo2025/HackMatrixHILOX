'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VictoryPage() {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(0);
  const [flags, setFlags] = useState<string[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const profile = localStorage.getItem('xssctf_profile');
    if (!profile) {
      router.push('/');
      return;
    }
    const { username: user } = JSON.parse(profile);
    setUsername(user);

    const savedProgress = localStorage.getItem('xssctf_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setScore(progress.score);
      setFlags(progress.flags);
    }

    setTimeout(() => setShowFireworks(true), 500);
  }, [router]);

  const handlePlayAgain = () => {
    localStorage.removeItem('xssctf_progress');
    router.push('/game');
  };

  const handleReturnToLobby = () => {
    localStorage.removeItem('xssctf_progress');
    router.push('/lobby');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {showFireworks && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#00ff41] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `pulse ${1 + Math.random() * 2}s infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.8)'
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Victory Screen */}
      <div className="pixel-border bg-[#001a00] p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-['Press_Start_2P'] text-4xl md:text-6xl text-[#00ff41] text-glow mb-6 glitch">
            MISSION
            <br />
            ACCOMPLISHED
          </div>
          <div className="font-['VT323'] text-3xl text-[#33ff33] mb-4">
            &gt; ALL SYSTEMS BREACHED SUCCESSFULLY
          </div>
          <div className="border-2 border-[#00ff41] bg-[#001100] p-6 inline-block">
            <p className="font-['Press_Start_2P'] text-sm text-[#ffb000] mb-2">
              OPERATIVE
            </p>
            <p className="font-['VT323'] text-4xl text-[#00ff41] text-glow">
              {username}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border-2 border-[#00ff41] bg-[#0d0208] p-6 text-center">
            <p className="font-['Press_Start_2P'] text-xs text-[#33ff33] mb-3">
              FINAL SCORE
            </p>
            <p className="font-['VT323'] text-5xl text-[#00ff41] text-glow">
              {score}
            </p>
          </div>
          <div className="border-2 border-[#00ff41] bg-[#0d0208] p-6 text-center">
            <p className="font-['Press_Start_2P'] text-xs text-[#33ff33] mb-3">
              FLAGS CAPTURED
            </p>
            <p className="font-['VT323'] text-5xl text-[#00ff41] text-glow">
              {flags.length}/6
            </p>
          </div>
          <div className="border-2 border-[#00ff41] bg-[#0d0208] p-6 text-center">
            <p className="font-['Press_Start_2P'] text-xs text-[#33ff33] mb-3">
              RANK
            </p>
            <p className="font-['VT323'] text-5xl text-[#ffb000] text-glow">
              ELITE
            </p>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="border-2 border-[#ffb000] bg-[#1a0f00] p-6 mb-8">
          <div className="text-center">
            <p className="font-['Press_Start_2P'] text-lg text-[#ffb000] mb-4">
              🏆 ACHIEVEMENT UNLOCKED 🏆
            </p>
            <p className="font-['VT323'] text-2xl text-[#33ff33]">
              &gt; XSS MASTER - COMPLETED ALL CHALLENGES
            </p>
          </div>
        </div>

        {/* Captured Flags Summary */}
        <div className="border-2 border-[#004400] bg-[#0d0208] p-6 mb-8">
          <h3 className="font-['Press_Start_2P'] text-sm text-[#00ff41] mb-4 border-b-2 border-[#00ff41] pb-3">
            [ CAPTURED FLAGS ]
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {flags.map((flag, index) => (
              <div
                key={index}
                className="border-2 border-[#004400] bg-[#001100] p-3 flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-[#00ff41] pixel-border flex items-center justify-center font-['Press_Start_2P'] text-xs">
                  ✓
                </div>
                <div className="font-['VT323'] text-lg text-[#33ff33] break-all">
                  {flag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Report */}
        <div className="border-2 border-[#004400] bg-[#001100] p-6 mb-8">
          <h3 className="font-['Press_Start_2P'] text-sm text-[#00ff41] mb-4">
            [ MISSION REPORT ]
          </h3>
          <div className="font-['VT323'] text-xl text-[#33ff33] space-y-2">
            <p>&gt; STATUS: <span className="text-[#00ff41]">COMPLETE</span></p>
            <p>&gt; VULNERABILITIES EXPLOITED: <span className="text-[#00ff41]">6/6</span></p>
            <p>&gt; SECURITY BYPASSED: <span className="text-[#00ff41]">100%</span></p>
            <p>&gt; STEALTH RATING: <span className="text-[#ffb000]">GHOST</span></p>
            <p>&gt; DIFFICULTY: <span className="text-[#ff0000]">EXTREME</span></p>
            <p className="text-[#00ff41] mt-4">
              &gt; CONGRATULATIONS, OPERATIVE {username}!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handlePlayAgain}
            className="retro-button py-4 border-[#00ff41] text-[#00ff41]
                     hover:bg-[#00ff41] hover:text-[#0d0208]"
          >
            [ REPLAY MISSION ]
          </button>
          <button
            onClick={handleReturnToLobby}
            className="retro-button py-4 border-[#ffb000] text-[#ffb000]
                     hover:bg-[#ffb000] hover:text-[#0d0208]
                     shadow-[3px_3px_0_rgba(255,176,0,0.3),0_0_10px_rgba(255,176,0,0.3)]
                     hover:shadow-[5px_5px_0_rgba(255,176,0,0.3),0_0_20px_rgba(255,176,0,0.5)]"
          >
            [ RETURN TO LOBBY ]
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-[#004400] text-center">
          <p className="font-['VT323'] text-lg text-[#33ff33]">
            &gt; NUIT DE L&apos;INFO 2025 - HILOX TEAM
          </p>
          <p className="font-['VT323'] text-sm text-[#004400] mt-2">
            &gt; FOR EDUCATIONAL PURPOSES ONLY
          </p>
        </div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[800px] h-[800px] bg-[#00ff41] opacity-10 blur-[150px] rounded-full animate-pulse">
        </div>
      </div>
    </div>
  );
}
