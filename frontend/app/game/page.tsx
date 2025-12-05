'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import VulnerableBrowser from '../components/VulnerableBrowser';
import { soundManager } from '../utils/sound';

interface Progress {
  step: number;
  score: number;
  flags: string[];
}

const CHALLENGES = [
  {
    id: 1,
    title: 'LEVEL 1: BASIC INJECTION',
    description: 'The search bar reflects input without sanitization.',
    hint: 'Try injecting <script>alert(1)</script>',
    expectedFlag: 'FLAG{STEP1_DEMO}',
    points: 1000
  },
  {
    id: 2,
    title: 'LEVEL 2: COOKIE STEALING',
    description: 'Admin logs display raw HTML. Steal the session cookie.',
    hint: 'Try <img src=x onerror=alert(document.cookie)>',
    expectedFlag: 'FLAG{STEP2_REFLECTED_COOKIE}',
    points: 990
  },
  {
    id: 3,
    title: 'LEVEL 3: STORED XSS',
    description: 'Comments are saved permanently. Inject a persistent script.',
    hint: 'Post a comment with <script>...</script>',
    expectedFlag: 'FLAG{STEP3_STORED}',
    points: 980
  },
  {
    id: 4,
    title: 'LEVEL 4: DOM-BASED XSS',
    description: 'Client-side script processes URL hash unsafely.',
    hint: 'Look at how window.location.hash is used',
    expectedFlag: 'FLAG{STEP4_DOM}',
    points: 970
  },
  {
    id: 5,
    title: 'LEVEL 5: CSP BYPASS',
    description: 'Content Security Policy is active but weak.',
    hint: 'Find allowed domains in the CSP header',
    expectedFlag: 'FLAG{STEP5_CSP_BYPASS}',
    points: 960
  },
  {
    id: 6,
    title: 'LEVEL 6: FINAL BOSS',
    description: 'Complex filter evasion required.',
    hint: 'Polyglot payloads might work here',
    expectedFlag: 'FLAG{STEP6_FINAL}',
    points: 950
  }
];

export default function GamePage() {
  const [username, setUsername] = useState('');
  const [progress, setProgress] = useState<Progress>({ step: 1, score: 0, flags: [] });
  const [commandInput, setCommandInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> SYSTEM INITIALIZED...', '> CONNECTED TO TARGET...']);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();
  const terminalEndRef = useRef<HTMLDivElement>(null);

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
      setProgress(JSON.parse(savedProgress));
    }
    
    soundManager.playBoot();
  }, [router]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const currentChallenge = CHALLENGES[progress.step - 1];
  const isCompleted = progress.step > CHALLENGES.length;

  const addLog = (msg: string) => {
    setTerminalOutput(prev => [...prev, `> ${msg}`]);
  };

  const handleExploit = (flag: string) => {
    soundManager.playSuccess();
    addLog(`VULNERABILITY EXPLOITED! FLAG CAPTURED: ${flag}`);
    setCommandInput(`submit ${flag}`); // Auto-fill for convenience
  };

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      soundManager.playKeystroke();
      const cmd = commandInput.trim();
      addLog(cmd);
      setCommandInput('');

      if (cmd.startsWith('submit ')) {
        const flag = cmd.split(' ')[1];
        await submitFlag(flag);
      } else if (cmd === 'help') {
        addLog('AVAILABLE COMMANDS:');
        addLog('  submit <FLAG> - Submit a captured flag');
        addLog('  hint          - Show hint for current level');
        addLog('  clear         - Clear terminal');
      } else if (cmd === 'hint') {
        setShowHint(true);
        addLog(`HINT: ${currentChallenge?.hint}`);
      } else if (cmd === 'clear') {
        setTerminalOutput([]);
      } else {
        addLog('UNKNOWN COMMAND. TYPE "help" FOR OPTIONS.');
        soundManager.playError();
      }
    }
  };

  const submitFlag = async (flag: string) => {
    try {
      const res = await fetch('http://localhost:3000/api/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ flag }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        soundManager.playSuccess();
        const newProgress = data.progress;
        setProgress(newProgress);
        localStorage.setItem('xssctf_progress', JSON.stringify(newProgress));
        addLog('SUCCESS! FLAG ACCEPTED. ACCESS GRANTED TO NEXT LEVEL.');
        setShowHint(false);

        if (newProgress.step > CHALLENGES.length) {
          setTimeout(() => router.push('/victory'), 2000);
        }
      } else {
        soundManager.playError();
        addLog(`ACCESS DENIED: ${data.error || 'INVALID FLAG'}`);
      }
    } catch (e) {
      console.error(e);
      addLog('ERROR: CONNECTION FAILED');
    }
  };

  if (isCompleted) return null; // Redirecting...

  return (
    <div className="min-h-screen p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
      {/* Left Panel: Vulnerable Target */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="pixel-border bg-[#001a00] p-4">
          <h2 className="font-['Press_Start_2P'] text-sm text-[#ffb000] mb-2">
            TARGET SYSTEM: LEVEL {progress.step}
          </h2>
          <p className="font-['VT323'] text-xl text-[#33ff33]">
            {currentChallenge?.title}
          </p>
          <p className="font-['VT323'] text-lg text-[#00ff41] mt-2">
            {currentChallenge?.description}
          </p>
        </div>

        <div className="flex-1 relative">
          <VulnerableBrowser 
            level={progress.step} 
            onExploit={handleExploit} 
          />
        </div>
      </div>

      {/* Right Panel: Hacker Terminal */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="pixel-border bg-[#0d0208] p-4 flex-1 flex flex-col min-h-[500px]">
          <div className="border-b-2 border-[#00ff41] pb-2 mb-4 flex justify-between items-center">
            <h2 className="font-['Press_Start_2P'] text-sm text-[#00ff41]">
              TERMINAL v2.0
            </h2>
            <div className="text-[#33ff33] font-['VT323']">
              SCORE: {progress.score}
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 overflow-y-auto font-['VT323'] text-lg space-y-1 mb-4 max-h-[60vh] scrollbar-hide">
            {terminalOutput.map((line, i) => (
              <div key={i} className={`${line.includes('ERROR') || line.includes('DENIED') ? 'text-[#ff0000]' : line.includes('SUCCESS') ? 'text-[#00ff41]' : 'text-[#33ff33]'}`}>
                {line}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Input */}
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-['VT323'] text-xl text-[#00ff41]">
              user@xss-arena:~$
            </span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => {
                setCommandInput(e.target.value);
                soundManager.playKeystroke();
              }}
              onKeyDown={handleCommand}
              className="w-full bg-transparent border-none text-[#00ff41] 
                       font-['VT323'] text-xl pl-40 focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              if (!showHint) addLog(`HINT: ${currentChallenge?.hint}`);
            }}
            className="retro-button text-xs py-3"
          >
            [ {showHint ? 'HIDE HINT' : 'GET HINT'} ]
          </button>
          <button
            onClick={() => setTerminalOutput([])}
            className="retro-button text-xs py-3 border-[#ff0000] text-[#ff0000]"
          >
            [ CLEAR TERMINAL ]
          </button>
        </div>
      </div>
    </div>
  );
}

