"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "~/components/ui/menubar";
import { toast } from "sonner";

let entryIdCounter = 0;

export type OutputContent = {
  delay?: number;
  placeholder?: string | React.ReactNode;
  content: string | React.ReactNode;
};

export type DisplayEntry = {
  id: string;
  type: "command" | "output";
  content: string | React.ReactNode;
  done?: boolean;
}

export type CommandEntry = {
  prompt: string | React.ReactNode | Array<string | React.ReactNode>;
  output?: string | OutputContent | React.ReactNode | Array<string | OutputContent | React.ReactNode>;
  typingSpeed?: number;
  typingRandom?: number;
  delay?: number;
  outputDelay?: number;
  onDone?: () => void;
  onCopy?: () => void;
  onBeforeOutput?: () => void;
}

export type TerminableProps = {
  commands: CommandEntry[];
  defaultTypingSpeed?: number;
  defaultTypingRandom?: number;
  defaultOutputSpeed?: number;
  width?: string;
  height?: string;
  termPrompt?: string | React.ReactNode;
  startLine?: string | React.ReactNode;
  backgroundColor?: string;
  promptColor?: string;
  outputColor?: string;
  greenMenu?: React.ReactNode;
  yellowMenu?: React.ReactNode;
  redMenu?: React.ReactNode;
  title?: string | React.ReactNode;
  commandDelay?: number;
  allowCopy?: boolean;
  start?: boolean;
}

export default function Terminable({
  commands = [],
  defaultTypingSpeed = 50,
  defaultTypingRandom = 0,
  defaultOutputSpeed = 30,
  width = "w-full max-w-[800px]",
  height = "min-h-[300px] max-h-[500px]",
  termPrompt = "$ ",
  startLine = "",
  backgroundColor,
  promptColor,
  outputColor,
  greenMenu,
  yellowMenu,
  redMenu,
  title,
  commandDelay = 1000,
  allowCopy = true,
  start = true,
}: TerminableProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState<DisplayEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (startLine) {
      setDisplay([{ 
        id: `entry-${++entryIdCounter}`, 
        type: "output", 
        content: startLine 
      }]);
    }
  }, [startLine]);

  // Cleanup function
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const calculateTypingDelay = useCallback((baseSpeed: number, randomFactor = 0) => {
    const randomVariation = Math.random() * (baseSpeed * (randomFactor / 100));
    return Math.max(10, baseSpeed + (Math.random() > 0.5 ? randomVariation : -randomVariation));
  }, []);

  // Auto-scroll logic - runs after every render
  useEffect(() => {
    if (terminalRef.current && !userScrolledRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  });

  const handleScroll = useCallback(() => {
    if (!terminalRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
    const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    userScrolledRef.current = !isScrolledToBottom;
  }, []);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, ms);
      timeoutsRef.current.push(timeout);
    });
  }, []);

  const processCommandOutput = useCallback(async (
    output: string | React.ReactNode | OutputContent | Array<string | React.ReactNode | OutputContent>,
    defaultSpeed: number,
    onBeforeOutput?: () => void,
  ) => {
    const outputs = Array.isArray(output) ? output : [output];

    for (const line of outputs) {
      if (!line) continue;

      await sleep(defaultSpeed);

      // Handle ReactNode directly (not string or OutputContent)
      if (typeof line !== 'string' && !(line && typeof line === 'object' && 'content' in line)) {
        onBeforeOutput?.();
        const newId = `entry-${++entryIdCounter}`;
        setDisplay(prev => [...prev, { id: newId, type: "output", content: line }]);
        continue;
      }

      // Handle plain string
      if (typeof line === "string") {
        onBeforeOutput?.();
        const newId = `entry-${++entryIdCounter}`;
        setDisplay(prev => [...prev, { id: newId, type: "output", content: line }]);
        continue;
      }

      // Handle OutputContent with placeholder
      const outputContent = line as OutputContent;
      onBeforeOutput?.();
      const placeholderId = `entry-${++entryIdCounter}`;
      setDisplay(prev => [...prev, { 
        id: placeholderId, 
        type: "output", 
        content: outputContent.placeholder ?? "" 
      }]);

      if (outputContent.delay) {
        await sleep(outputContent.delay);
      }

      // Replace placeholder with actual content - IMMUTABLE UPDATE
      setDisplay(prev => prev.map(entry => 
        entry.id === placeholderId 
          ? { ...entry, content: outputContent.content }
          : entry
      ));
    }
  }, [sleep]);

  // Track typing content in ref to avoid excessive re-renders
  const typePrompt = useCallback(async (
    prompt: string | React.ReactNode,
    cmd: CommandEntry
  ) => {
    const commandId = `entry-${++entryIdCounter}`;
    
    // Add empty command entry
    setDisplay(prev => [...prev, { 
      id: commandId, 
      type: "command", 
      content: "", 
      done: false 
    }]);

    // Handle ReactNode directly
    if (typeof prompt !== "string") {
      setDisplay(prev => prev.map(entry => 
        entry.id === commandId 
          ? { ...entry, content: prompt, done: true }
          : entry
      ));
      return;
    }

    // Type the command character by character
    const trimmedPrompt = prompt.trim();
    
    for (let i = 0; i < trimmedPrompt.length; i++) {
      const delay = calculateTypingDelay(
        cmd.typingSpeed ?? defaultTypingSpeed,
        (cmd.typingRandom ?? defaultTypingRandom)
      );
      
      await sleep(delay);
      
      const currentContent = trimmedPrompt.slice(0, i + 1);
      
      setDisplay(prev => prev.map(entry => 
        entry.id === commandId 
          ? { ...entry, content: currentContent }
          : entry
      ));
    }

    // Mark command as done
    setDisplay(prev => prev.map(entry => 
      entry.id === commandId 
        ? { ...entry, done: true }
        : entry
    ));
  }, [defaultTypingSpeed, defaultTypingRandom, calculateTypingDelay, sleep]);

  const processCommand = useCallback(async (cmd: CommandEntry, index: number) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Delay between commands (except first)
      if (index > 0) {
        await sleep(cmd.delay ?? commandDelay);
      }

      // Process all prompts
      if (Array.isArray(cmd.prompt)) {
        for (const prompt of cmd.prompt) {
          await typePrompt(prompt, cmd);
        }
      } else {
        await typePrompt(cmd.prompt, cmd);
      }

      // Process outputs
      if (cmd.output) {
        if (cmd.outputDelay) {
          await sleep(cmd.outputDelay);
        }
        await processCommandOutput(cmd.output, defaultOutputSpeed, cmd.onBeforeOutput);
      }

      cmd.onDone?.();
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error processing command:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error', { duration: 3000 });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, commandDelay, defaultOutputSpeed, typePrompt, processCommandOutput, sleep]);

  // Main processing loop
  useEffect(() => {
    if (!start || currentIndex >= commands.length || isProcessing) return;

    const cmd = commands[currentIndex];
    if (cmd) {
      void processCommand(cmd, currentIndex);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [start, currentIndex, commands, isProcessing, processCommand]);

  const isXP = theme === "xp";
  const xpTerminalBg = isXP ? '#000000' : (backgroundColor || '#1C1C1C');
  const xpPromptClr = isXP ? '#C0C0C0' : (promptColor || '#00ff00');
  const xpOutputClr = isXP ? '#C0C0C0' : (outputColor || '#EEEEEE');
  const xpTermFont = isXP 
    ? "'Courier New', 'Courier', monospace" 
    : "'DejaVu Sans Mono', 'Ubuntu Mono', 'Consolas', monospace";

  const xpTitleBarStyle = {
    background: 'linear-gradient(to bottom, #3D95FF 0%, #245EDC 100%)',
    borderTop: '1px solid #5BA8FF',
    borderBottom: '1px solid #1A47B0',
    boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset',
  };

  const ubuntuTitleBarStyle = {
    background: 'linear-gradient(to bottom, #6A5A5A 0%, #5A4A4A 15%, #4A3A3A 50%, #3C2F2F 85%, #2C2424 100%)',
    borderBottom: '1px solid #1C1C1C',
    boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset',
  };

  if (!mounted) {
    return (
      <div className={`mx-auto my-1 ${width} overflow-hidden ${isXP ? 'rounded-sm' : 'rounded-lg'}`}>
        <div 
          className="flex items-center justify-between px-3 py-2"
          style={isXP ? xpTitleBarStyle : ubuntuTitleBarStyle}
        >
          <div className="w-20" />
          <div className="flex-1 text-center text-xs font-semibold px-4 truncate text-white">
            {title || (isXP ? "Command Prompt" : "Terminal")}
          </div>
          <div className="w-20" />
        </div>
        <div
          className={`${height} overflow-y-auto p-4`}
          style={{ backgroundColor: xpTerminalBg }}
        />
      </div>
    );
  }

  return (
    <div className={`mx-auto my-1 ${width} overflow-hidden ${isXP ? 'rounded-sm' : 'rounded-lg'}`}>
      {/* Terminal Title Bar */}
      <div 
        className="flex items-center justify-between px-3 py-2 select-none"
        style={isXP ? xpTitleBarStyle : ubuntuTitleBarStyle}
      >
        {/* Window Controls */}
        <div className="flex items-center gap-1.5">
          {isXP ? (
            <>
              <button 
                type="button"
                className="flex items-center justify-center w-5 h-5 transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(to bottom, #FFFFFF 0%, #E0E0E0 50%, #D0D0D0 51%, #B0B0B0 100%)',
                  border: '1px solid #0033CC',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
                aria-label="Minimize"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <title>Minimize</title>
                  <rect x="1" y="5" width="6" height="1.5" fill="#0033CC" rx="0.5"/>
                </svg>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center w-5 h-5 transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(to bottom, #FFFFFF 0%, #E0E0E0 50%, #D0D0D0 51%, #B0B0B0 100%)',
                  border: '1px solid #0033CC',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
                aria-label="Maximize"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <title>Maximize</title>
                  <rect x="1.5" y="1.5" width="5" height="5" stroke="#0033CC" strokeWidth="1" rx="0.5"/>
                </svg>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center w-5 h-5 transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(to bottom, #FF9999 0%, #FF7777 50%, #FF5555 51%, #FF3333 100%)',
                  border: '1px solid #990000',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
                aria-label="Close"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <title>Close</title>
                  <path d="M2 2L6 6M6 2L2 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </>
          ) : (
            <>
              <button 
                type="button"
                className="flex items-center justify-center w-4 h-4 rounded-full transition-transform hover:scale-110"
                style={{
                  background: 'linear-gradient(to bottom, #FF9999 0%, #FF7777 50%, #EE5555 51%, #DD4444 100%)',
                  border: '1px solid #BB2222',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
                aria-label="Close"
              >
                <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                  <title>Close</title>
                  <path d="M2 2L6 6M6 2L2 6" stroke="#550000" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center w-4 h-4 rounded-full transition-transform hover:scale-110"
                style={{
                  background: 'linear-gradient(to bottom, #FFEE88 0%, #FFDD55 50%, #EECC44 51%, #DDBB33 100%)',
                  border: '1px solid #BB9922',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
                aria-label="Minimize"
              >
                <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                  <title>Minimize</title>
                  <rect x="1" y="5" width="6" height="1.5" fill="#554400" rx="0.5"/>
                </svg>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center w-4 h-4 rounded-full transition-transform hover:scale-110"
                style={{
                  background: 'linear-gradient(to bottom, #88EE88 0%, #66DD66 50%, #55CC55 51%, #44BB44 100%)',
                  border: '1px solid #229922',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
                aria-label="Maximize"
              >
                <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                  <title>Maximize</title>
                  <rect x="1.5" y="1.5" width="5" height="5" stroke="#005500" strokeWidth="1.5" rx="0.5"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Window Title */}
        <div 
          className="flex-1 text-center text-xs font-semibold px-4 truncate"
          style={{
            color: isXP ? '#FFFFFF' : '#E8E0D5',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {title || (isXP ? "Command Prompt" : "Terminal")}
        </div>

        {/* Spacer */}
        <div className="w-12" />
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        className={`${height} overflow-y-auto p-4 whitespace-pre-wrap break-words`}
        style={{
          backgroundColor: xpTerminalBg,
          fontFamily: xpTermFont,
        }}
        role="log"
        aria-live="polite"
      >
        {display.map((entry) => (
          <div key={entry.id} className="my-1">
            {entry.type === "command" && (
              <div className="flex items-start">
                <span 
                  className="mr-2 shrink-0 terminal-text"
                  style={{ color: xpPromptClr }}
                >
                  {isXP ? "C:\\> " : termPrompt}
                </span>
                {entry.done ? (
                  <button
                    type="button"
                    className={`cursor-pointer break-all rounded px-1 ${isXP ? 'hover:bg-[#001133]' : 'hover:bg-[#333]'}`}
                    style={{ 
                      color: xpOutputClr,
                      fontFamily: xpTermFont,
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                    }}
                    onClick={() => {
                      const cmd = commands[currentIndex - 1];
                      if (allowCopy && typeof entry.content === "string" && cmd) {
                        cmd.onCopy?.();
                        navigator.clipboard.writeText(entry.content).then(() => {
                          toast.success("Copied to clipboard", { duration: 1000 });
                        }).catch((error) => {
                          console.error("Failed to copy:", error);
                          toast.error("Failed to copy", { duration: 1000 });
                        });
                      }
                    }}
                  >
                    {entry.content}
                  </button>
                ) : (
                  <span className="break-all rounded px-1 flex">
                    <span
                      style={{ 
                        color: xpOutputClr,
                        fontFamily: xpTermFont,
                      }}
                    >
                      {entry.content}
                    </span>
                    <span 
                      className="terminal-cursor border-r-2 border-[#4E9A06] ml-0"
                      style={{ height: '1em' }}
                    />
                  </span>
                )}
              </div>
            )}
            {entry.type === "output" && (
              <div
                className="ml-4 whitespace-pre-wrap break-all"
                style={{ 
                  color: xpOutputClr,
                  fontFamily: xpTermFont,
                }}
              >
                {entry.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
