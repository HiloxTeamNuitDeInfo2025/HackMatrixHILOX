'use client';

import { useState, useEffect, useRef } from 'react';

interface VulnerableBrowserProps {
  level: number;
  onExploit: (flag: string) => void;
}

export default function VulnerableBrowser({ level, onExploit }: VulnerableBrowserProps) {
  const [url, setUrl] = useState('http://vulnerable-bank.com/search');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<{user: string, text: string}[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Level 1: Reflected XSS (Search)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate reflection
    if (content.includes('<script>')) {
      // In a real scenario this would execute, here we simulate detection
      if (content.includes('alert')) {
        onExploit('FLAG{STEP1_DEMO}');
        alert('XSS EXECUTED: Alert box popped!');
      }
    }
  };

  // Level 3: Stored XSS (Comments)
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    const newComment = { user: 'Guest', text: content };
    setComments([...comments, newComment]);
    
    if (content.includes('<script>') || content.includes('onerror=')) {
      onExploit('FLAG{STEP3_STORED}');
      alert('STORED XSS EXECUTED: Malicious comment saved!');
    }
    setContent('');
  };

  const renderLevelContent = () => {
    switch(level) {
      case 1: // Basic Reflected
        return (
          <div className="p-4 bg-white text-black font-sans h-full">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Vulnerable Bank Search</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-2 flex-1"
                placeholder="Search for products..."
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2">Search</button>
            </form>
            <div className="mt-4">
              {content && <p>Results for: <span dangerouslySetInnerHTML={{ __html: content }} /></p>}
            </div>
          </div>
        );

      case 2: // Cookie Stealing
        return (
          <div className="p-4 bg-white text-black font-sans h-full">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">Admin Portal</h2>
            <p className="mb-4">Welcome, Admin! Your session ID is sensitive.</p>
            <div className="border p-4 bg-yellow-50">
              <p>Recent Activity Log:</p>
              <div dangerouslySetInnerHTML={{ __html: content || 'No activity' }} />
            </div>
            <input 
              type="text" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border p-2 w-full mt-4"
              placeholder="Filter logs..."
            />
            <button 
              onClick={() => {
                if(content.includes('document.cookie')) {
                  onExploit('FLAG{STEP2_REFLECTED_COOKIE}');
                  alert('COOKIE STOLEN: Session ID sent to attacker!');
                }
              }}
              className="bg-purple-600 text-white px-4 py-2 mt-2"
            >
              Filter
            </button>
          </div>
        );

      case 3: // Stored XSS
        return (
          <div className="p-4 bg-white text-black font-sans h-full">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Guestbook</h2>
            <div className="mb-6 space-y-4 max-h-40 overflow-y-auto border p-2">
              {comments.map((c, i) => (
                <div key={i} className="border-b pb-2">
                  <span className="font-bold">{c.user}:</span> 
                  <span dangerouslySetInnerHTML={{ __html: c.text }} />
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="border-t pt-4">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border p-2 mb-2"
                placeholder="Leave a comment..."
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2">Post Comment</button>
            </form>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a level to load vulnerable target...
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[500px] border-4 border-gray-400 rounded-lg overflow-hidden bg-white">
      {/* Browser Chrome */}
      <div className="bg-gray-200 border-b border-gray-400 p-2 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-600 font-mono truncate">
          {url}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative overflow-auto">
        {renderLevelContent()}
        
        {/* Overlay for "Hacked" effect */}
        <div className="absolute inset-0 pointer-events-none bg-green-500/10 hidden group-hover:block"></div>
      </div>
    </div>
  );
}
