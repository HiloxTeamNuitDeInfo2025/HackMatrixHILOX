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

      case 4: // DOM-Based XSS
        return (
          <div className="p-4 bg-white text-black font-sans h-full">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">URL Router App</h2>
            <p className="mb-4">Current hash: <span id="hash-display" className="font-mono bg-gray-100 p-1">{content || window.location.hash}</span></p>
            <input 
              type="text" 
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                // Simulate unsafe DOM manipulation
                if (e.target.value.includes('<img') || e.target.value.includes('onerror')) {
                  onExploit('FLAG{STEP4_DOM}');
                  alert('DOM XSS EXECUTED: Client-side injection!');
                }
              }}
              className="border p-2 w-full mb-4"
              placeholder="Enter hash value (e.g., #page=home)"
            />
            <div className="border p-4 bg-gray-50">
              <p>Rendered content:</p>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        );

      case 5: // CSP Bypass
        return (
          <div className="p-4 bg-white text-black font-sans h-full">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Secure Portal (CSP Enabled)</h2>
            <div className="mb-4 bg-yellow-50 border border-yellow-300 p-2 text-xs">
              <strong>CSP Header:</strong> script-src 'self' https://trusted-cdn.com
            </div>
            <p className="mb-4">Upload widget configuration:</p>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 mb-2 font-mono text-sm"
              placeholder='Try: <script src="https://trusted-cdn.com/exploit.js"></script>'
              rows={4}
            />
            <button 
              onClick={() => {
                if (content.includes('trusted-cdn.com') && content.includes('<script')) {
                  onExploit('FLAG{STEP5_CSP_BYPASS}');
                  alert('CSP BYPASSED: Script loaded from whitelisted domain!');
                }
              }}
              className="bg-orange-600 text-white px-4 py-2"
            >
              Apply Config
            </button>
            <div className="mt-4 border p-4">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        );

      case 6: // Filter Evasion (Final Boss)
        return (
          <div className="p-4 bg-white text-black font-sans h-full">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Ultra-Secure Input (WAF Protected)</h2>
            <div className="mb-4 bg-red-50 border border-red-300 p-2 text-xs">
              <strong>Filters Active:</strong> &lt;script&gt;, onerror, onclick, eval(), alert()
            </div>
            <p className="mb-4">Message board (all inputs are filtered):</p>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 mb-2 font-mono text-sm"
              placeholder="Try polyglot payloads or encoding tricks..."
              rows={4}
            />
            <button 
              onClick={() => {
                // Simulate filter bypass detection
                const bypasses = [
                  '<img src=x onerror=confirm(1)>',
                  '<svg/onload=alert(1)>',
                  '<iframe src="javascript:alert(1)">',
                  '"><script>alert(String.fromCharCode(88,83,83))</script>'
                ];
                
                if (bypasses.some(bypass => content.includes(bypass.substring(0, 10)))) {
                  onExploit('FLAG{STEP6_FINAL}');
                  alert('FILTER BYPASSED: Advanced evasion successful!');
                }
              }}
              className="bg-red-600 text-white px-4 py-2"
            >
              Post Message
            </button>
            <div className="mt-4 border p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Posted messages:</p>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
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
