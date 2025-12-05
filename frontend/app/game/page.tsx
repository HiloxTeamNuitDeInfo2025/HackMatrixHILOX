'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Progress {
  step: number;
  score: number;
  flags: string[];
}

const CHALLENGES = [
  {
    id: 1,
    title: 'LEVEL 1: BASIC INJECTION',
    description: 'Find the vulnerability in the search parameter',
    hint: 'Try injecting a simple script tag',
    expectedFlag: 'FLAG{STEP1_DEMO}',
    points: 1000
  },
  {
    id: 2,
    title: 'LEVEL 2: REFLECTED XSS',
    description: 'Exploit the cookie reflection vulnerability',
    hint: 'Check how cookies are displayed',
    expectedFlag: 'FLAG{STEP2_REFLECTED_COOKIE}',
    points: 990
  },
  {
    id: 3,
    title: 'LEVEL 3: STORED XSS',
    description: 'Inject persistent malicious code',
    hint: 'Comments are stored in the database',
    expectedFlag: 'FLAG{STEP3_STORED}',
    points: 980
  },
  {
    id: 4,
    title: 'LEVEL 4: DOM-BASED XSS',
    description: 'Manipulate the DOM directly',
    hint: 'Look at client-side JavaScript',
    expectedFlag: 'FLAG{STEP4_DOM}',
    points: 970
  },
  {
    id: 5,
    title: 'LEVEL 5: CSP BYPASS',
    description: 'Bypass Content Security Policy',
    hint: 'Find allowed sources in CSP header',
    expectedFlag: 'FLAG{STEP5_CSP_BYPASS}',
    points: 960
  },
  {
    id: 6,
    title: 'LEVEL 6: FINAL BOSS',
    description: 'Combine all techniques',
    hint: 'Use everything you learned',
    expectedFlag: 'FLAG{STEP6_FINAL}',
    points: 950
  }
];

export default function GamePage() {
  const [username, setUsername] = useState('');
  const [progress, setProgress] = useState<Progress>({ step: 1, score: 0, flags: [] });
  const [flagInput, setFlagInput] = useState('');
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const profile = localStorage.getItem('xssctf_profile');
    if (!profile) {
      router.push('/');
      return;
    }
    const { username: user } = JSON.parse(profile);
    setUsername(user);

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('xssctf_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [router]);

  const currentChallenge = CHALLENGES[progress.step - 1];
  const isCompleted = progress.step > CHALLENGES.length;

  const handleSubmitFlag = async () => {
    if (!flagInput.trim()) {
      setMessage('> ERROR: FLAG CANNOT BE EMPTY');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/flag', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        // Include credentials (cookies) for session
        credentials: 'include',
        body: JSON.stringify({ flag: flagInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Server returns updated progress
        const newProgress = data.progress;
        
        setProgress(newProgress);
        localStorage.setItem('xssctf_progress', JSON.stringify(newProgress));
        setMessage('> SUCCESS! FLAG ACCEPTED. ADVANCING TO NEXT LEVEL...');
        setFlagInput('');
        setShowHint(false);

        // Check if completed all challenges (server handles this logic too but we redirect)
        if (newProgress.step > CHALLENGES.length) {
          setTimeout(() => router.push('/victory'), 2000);
        }
      } else {
        setMessage(`> ACCESS DENIED: ${data.error || 'INVALID FLAG'}`);
      }
    } catch (e) {
      console.error(e);
      setMessage('> ERROR: CONNECTION FAILED');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="pixel-border bg-[#001a00] p-8 max-w-2xl w-full text-center">
          <h1 className="font-['Press_Start_2P'] text-3xl text-[#00ff41] text-glow mb-6 glitch">
            MISSION COMPLETE!
          </h1>
          <p className="font-['VT323'] text-2xl text-[#33ff33] mb-4">
            &gt; REDIRECTING TO VICTORY SCREEN...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="pixel-border bg-[#001a00] p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-['Press_Start_2P'] text-xl md:text-2xl text-glow mb-2">
              XSS CHALLENGE
            </h1>
            <p className="font-['VT323'] text-xl text-[#33ff33]">
              &gt; OPERATIVE: <span className="text-[#00ff41] text-glow">{username}</span>
            </p>
          </div>
          <div className="font-['VT323'] text-2xl text-right">
            <div className="text-[#ffb000]">
              SCORE: <span className="text-[#00ff41] text-glow">{progress.score}</span>
            </div>
            <div className="text-[#33ff33]">
              LEVEL: {progress.step}/{CHALLENGES.length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Challenge Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Challenge */}
          <div className="pixel-border bg-[#001a00] p-6">
            <div className="border-b-2 border-[#00ff41] pb-4 mb-6">
              <h2 className="font-['Press_Start_2P'] text-lg text-[#00ff41] mb-3">
                {currentChallenge?.title}
              </h2>
              <p className="font-['VT323'] text-xl text-[#33ff33]">
                &gt; {currentChallenge?.description}
              </p>
            </div>

            {/* Challenge Workspace */}
            <div className="border-2 border-[#004400] bg-[#0d0208] p-6 mb-6">
              <div className="font-['VT323'] text-lg text-[#33ff33] space-y-2">
                <p>&gt; ANALYZING TARGET SYSTEM...</p>
                <p>&gt; VULNERABILITY DETECTED</p>
                <p>&gt; EXPLOIT FRAMEWORK: READY</p>
                <p className="text-[#ffb000] mt-4">
                  &gt; POINTS AVAILABLE: 
                  <span className="text-[#00ff41] text-glow ml-2">
                    {currentChallenge?.points}
                  </span>
                </p>
              </div>
            </div>

            {/* Hint Section */}
            <div className="mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="retro-button mb-4 border-[#ffb000] text-[#ffb000]
                         hover:bg-[#ffb000] hover:text-[#0d0208]"
              >
                {showHint ? '[ HIDE HINT ]' : '[ SHOW HINT ]'}
              </button>
              
              {showHint && (
                <div className="border-2 border-[#ffb000] bg-[#1a0f00] p-4">
                  <p className="font-['VT323'] text-xl text-[#ffb000]">
                    &gt; HINT: {currentChallenge?.hint}
                  </p>
                </div>
              )}
            </div>

            {/* Flag Submission */}
            <div>
              <label className="block font-['Press_Start_2P'] text-xs mb-3 text-[#00ff41]">
                [ SUBMIT FLAG ]
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-['VT323'] text-xl text-[#33ff33]">
                    &gt;
                  </span>
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitFlag()}
                    placeholder="FLAG{...}"
                    className="w-full bg-[#0d0208] border-2 border-[#00ff41] text-[#00ff41] 
                             font-['VT323'] text-2xl px-12 py-3 focus:outline-none 
                             focus:shadow-[0_0_20px_rgba(0,255,65,0.5)] 
                             placeholder:text-[#004400] uppercase"
                  />
                </div>
                <button
                  onClick={handleSubmitFlag}
                  className="retro-button px-8"
                >
                  [ SUBMIT ]
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mt-4 border-2 p-4 font-['VT323'] text-xl ${
                  message.includes('SUCCESS') 
                    ? 'border-[#00ff41] bg-[#001a00] text-[#00ff41]' 
                    : 'border-[#ff0000] bg-[#1a0000] text-[#ff0000]'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pixel-border bg-[#001a00] p-6">
            <h3 className="font-['Press_Start_2P'] text-sm mb-4 text-[#00ff41]">
              [ MISSION PROGRESS ]
            </h3>
            <div className="flex gap-2">
              {CHALLENGES.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className={`flex-1 h-8 border-2 transition-all ${
                    index < progress.step - 1
                      ? 'border-[#00ff41] bg-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.5)]'
                      : index === progress.step - 1
                      ? 'border-[#ffb000] bg-[#ffb000] animate-pulse'
                      : 'border-[#004400] bg-[#0d0208]'
                  }`}
                >
                  <div className="h-full flex items-center justify-center font-['Press_Start_2P'] text-xs">
                    {index < progress.step - 1 ? '✓' : index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="pixel-border bg-[#001a00] p-6">
            <h3 className="font-['Press_Start_2P'] text-sm mb-4 text-[#00ff41]">
              [ STATISTICS ]
            </h3>
            <div className="font-['VT323'] text-lg text-[#33ff33] space-y-2">
              <p>&gt; COMPLETED: {progress.flags.length}/{CHALLENGES.length}</p>
              <p>&gt; CURRENT: LEVEL {progress.step}</p>
              <p>&gt; TOTAL SCORE: {progress.score}</p>
              <p>&gt; FLAGS FOUND: {progress.flags.length}</p>
            </div>
          </div>

          {/* Captured Flags */}
          <div className="pixel-border bg-[#001a00] p-6">
            <h3 className="font-['Press_Start_2P'] text-sm mb-4 text-[#00ff41]">
              [ CAPTURED FLAGS ]
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {progress.flags.length === 0 ? (
                <p className="font-['VT323'] text-lg text-[#33ff33]">
                  &gt; NO FLAGS YET...
                </p>
              ) : (
                progress.flags.map((flag, index) => (
                  <div
                    key={index}
                    className="border-2 border-[#004400] bg-[#0d0208] p-3"
                  >
                    <div className="font-['Press_Start_2P'] text-xs text-[#ffb000] mb-1">
                      #{index + 1}
                    </div>
                    <div className="font-['VT323'] text-sm text-[#00ff41] break-all">
                      {flag}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="border-2 border-[#004400] bg-[#001100] p-4">
            <div className="font-['VT323'] text-sm text-[#33ff33] space-y-1">
              <p>&gt; SYSTEM: <span className="text-[#00ff41]">ACTIVE</span></p>
              <p>&gt; FIREWALL: <span className="text-[#ff0000]">DISABLED</span></p>
              <p>&gt; LOGGING: <span className="text-[#ff0000]">OFF</span></p>
              <p>&gt; MODE: <span className="text-[#ffb000]">TRAINING</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
