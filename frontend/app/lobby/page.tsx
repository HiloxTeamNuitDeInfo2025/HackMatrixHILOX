'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface Player {
  username: string;
  ready: boolean;
  joinedAt: number;
}

export default function LobbyPage() {
  const [username, setUsername] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const profile = localStorage.getItem('xssctf_profile');
    if (!profile) {
      router.push('/');
      return;
    }

    const { username: user } = JSON.parse(profile);
    setUsername(user);

    // Connect to Socket.IO
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('joinLobby', { username: user });

    newSocket.on('lobbyUpdate', (lobbyPlayers: Player[]) => {
      setPlayers(lobbyPlayers);
      const currentPlayer = lobbyPlayers.find(p => p.username === user);
      if (currentPlayer) {
        setIsReady(currentPlayer.ready);
      }
    });

    newSocket.on('startCountdown', ({ seconds }: { seconds: number }) => {
      setCountdown(seconds);
    });

    newSocket.on('startGame', () => {
      router.push('/game');
    });

    return () => {
      newSocket.emit('leaveLobby');
      newSocket.close();
    };
  }, [router]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleReady = () => {
    if (socket) {
      socket.emit('setReady', { username });
    }
  };

  const handleStart = () => {
    if (socket) {
      socket.emit('startCountdown');
    }
  };

  const allReady = players.length > 0 && players.every(p => p.ready);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="pixel-border bg-[#001a00] p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-['Press_Start_2P'] text-xl md:text-2xl text-glow mb-2">
              MISSION LOBBY
            </h1>
            <p className="font-['VT323'] text-xl text-[#33ff33]">
              &gt; USER: <span className="text-[#00ff41] text-glow">{username}</span>
            </p>
          </div>
          <div className="font-['VT323'] text-2xl">
            <span className="text-[#ffb000]">PLAYERS: </span>
            <span className="text-[#00ff41] text-glow">{players.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players List */}
        <div className="lg:col-span-2 pixel-border bg-[#001a00] p-6">
          <h2 className="font-['Press_Start_2P'] text-lg mb-6 text-[#00ff41] border-b-2 border-[#00ff41] pb-3">
            [ CONNECTED OPERATIVES ]
          </h2>
          
          <div className="space-y-3">
            {players.length === 0 ? (
              <div className="font-['VT323'] text-xl text-[#33ff33] text-center py-8">
                &gt; WAITING FOR OPERATIVES...<span className="cursor-blink"></span>
              </div>
            ) : (
              players.map((player, index) => (
                <div
                  key={player.username}
                  className="border-2 border-[#004400] bg-[#0d0208] p-4 flex items-center justify-between
                           hover:border-[#00ff41] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-['Press_Start_2P'] text-sm text-[#ffb000]">
                      #{String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="font-['VT323'] text-2xl text-[#00ff41]">
                      &gt; {player.username}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {player.ready ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#00ff41] pixel-border animate-pulse"></div>
                        <span className="font-['Press_Start_2P'] text-xs text-[#00ff41]">READY</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#ffb000] pixel-border"></div>
                        <span className="font-['Press_Start_2P'] text-xs text-[#ffb000]">WAIT</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Countdown */}
          {countdown !== null && countdown > 0 && (
            <div className="pixel-border bg-[#001a00] p-6 text-center">
              <p className="font-['Press_Start_2P'] text-sm text-[#ffb000] mb-4">
                MISSION START IN
              </p>
              <div className="font-['Press_Start_2P'] text-6xl text-[#00ff41] text-glow glitch">
                {countdown}
              </div>
            </div>
          )}

          {/* Ready Button */}
          <div className="pixel-border bg-[#001a00] p-6">
            <h3 className="font-['Press_Start_2P'] text-sm mb-4 text-[#00ff41]">
              [ STATUS ]
            </h3>
            <button
              onClick={handleReady}
              disabled={isReady}
              className={`w-full retro-button py-4 ${
                isReady 
                  ? 'bg-[#00ff41] text-[#0d0208] cursor-not-allowed' 
                  : ''
              }`}
            >
              {isReady ? '[ READY ✓ ]' : '[ SET READY ]'}
            </button>
          </div>

          {/* Start Button (Host Only) */}
          {players.length > 0 && players[0]?.username === username && (
            <div className="pixel-border bg-[#001a00] p-6">
              <h3 className="font-['Press_Start_2P'] text-sm mb-4 text-[#ffb000]">
                [ HOST CONTROLS ]
              </h3>
              <button
                onClick={handleStart}
                disabled={!allReady || countdown !== null}
                className="w-full retro-button py-4 border-[#ff0000] text-[#ff0000]
                         hover:bg-[#ff0000] hover:text-[#0d0208]
                         shadow-[3px_3px_0_rgba(255,0,0,0.3),0_0_10px_rgba(255,0,0,0.3)]
                         hover:shadow-[5px_5px_0_rgba(255,0,0,0.3),0_0_20px_rgba(255,0,0,0.5)]
                         disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {allReady ? '[ LAUNCH MISSION ]' : '[ WAITING... ]'}
              </button>
            </div>
          )}

          {/* Mission Brief */}
          <div className="pixel-border bg-[#001a00] p-6">
            <h3 className="font-['Press_Start_2P'] text-sm mb-4 text-[#00ff41]">
              [ MISSION BRIEF ]
            </h3>
            <div className="font-['VT323'] text-lg text-[#33ff33] space-y-2">
              <p>&gt; OBJECTIVE: EXPLOIT XSS</p>
              <p>&gt; DIFFICULTY: EXTREME</p>
              <p>&gt; STAGES: 6</p>
              <p>&gt; TIME LIMIT: NONE</p>
              <p className="text-[#ffb000] mt-4">
                &gt; STATUS: 
                <span className="text-[#00ff41] text-glow ml-2">
                  {allReady ? 'ALL READY' : 'STANDBY'}
                </span>
              </p>
            </div>
          </div>

          {/* System Info */}
          <div className="border-2 border-[#004400] bg-[#001100] p-4">
            <div className="font-['VT323'] text-sm text-[#33ff33] space-y-1">
              <p>&gt; SYSTEM: ONLINE</p>
              <p>&gt; SECURITY: DISABLED</p>
              <p>&gt; ENCRYPTION: NONE</p>
              <p className="text-[#ff0000]">&gt; WARNING: TRAINING MODE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00ff41] opacity-5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#ffb000] opacity-5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
