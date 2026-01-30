"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "~/components/ui/menubar";
import { toast } from "sonner";

export type OutputContent = {
  delay?: number;
  placeholder?: string | React.ReactNode;
  content: string | React.ReactNode;
};

export type DisplayEntry = {
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
  width?: string; // Tailwind width class
  height?: string; // Tailwind height class
  termPrompt?: string | React.ReactNode;
  startLine?: string | React.ReactNode;
  backgroundColor?: string; // Tailwind or custom color
  promptColor?: string; // Tailwind or custom color
  outputColor?: string; // Tailwind or custom color
  greenMenu?: React.ReactNode;
  yellowMenu?: React.ReactNode;
  redMenu?: React.ReactNode;
  title?: string | React.ReactNode;
  commandDelay?: number; // New prop for delay between commands
  allowCopy?: boolean; // New prop to control copy functionality
  start?: boolean;
}

// Add new types for refs
type CommandProcessingState = {
  isProcessing: boolean;
  currentIndex: number;
};

export default function Terminable({
  commands = [],
  defaultTypingSpeed = 50,
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
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isXP = theme === "xp";
  const [display, setDisplay] = useState<DisplayEntry[]>([
    { type: "output", content: startLine },
  ]);

  // Remove the isProcessing state and rely only on processingStateRef
  const processingStateRef = useRef<CommandProcessingState>({
    isProcessing: false,
    currentIndex: 0,
  });

  const terminalRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef<boolean>(false);

  // Calculate typing delay with useMemo
  const calculateTypingDelay = useMemo(() => {
    return (baseSpeed: number, randomFactor = 0) => {
      const randomVariation = Math.random() * (baseSpeed * (randomFactor / 100));
      return Math.max(10, baseSpeed + (Math.random() > 0.5 ? randomVariation : -randomVariation));
    };
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (terminalRef.current && !userScrolledRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [display]);

  const handleScroll = useCallback(() => {
    if (!terminalRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
    const isScrolledToBottom = scrollHeight - scrollTop === clientHeight;

    if (!isScrolledToBottom) {
      userScrolledRef.current = true;
    } else {
      userScrolledRef.current = false;
    }
  }, []);

  // Separate command processing logic
  const processCommandOutput = useCallback(
    async (
      output: string | React.ReactNode | OutputContent | Array<string | React.ReactNode | OutputContent>,
      defaultSpeed: number,
      onBeforeOutput?: () => void,
    ) => {
      const outputs = Array.isArray(output) ? output : [output];

      for (const line of outputs) {
        if (!line) continue;

        await new Promise((resolve) => setTimeout(resolve, defaultSpeed));

        // Handle ReactNode directly
        if (typeof line !== 'string' && !(line && typeof line === 'object' && 'content' in line)) {
          onBeforeOutput?.();
          setDisplay((prev) => [...prev, { type: "output", content: line }]);
          continue;
        }

        if (typeof line === "string") {
          onBeforeOutput?.();
          setDisplay((prev) => [...prev, { type: "output", content: line }]);
          continue;
        }

        // Handle OutputContent
        onBeforeOutput?.();
        setDisplay((prev) => [
          ...prev,
          { type: "output", content: line.placeholder ?? "" },
        ]);

        if (line.delay) {
          await new Promise((resolve) => setTimeout(resolve, line.delay));
        }

        setDisplay((prev) => {
          const newDisplay = [...prev];
          const lastEntry = newDisplay[newDisplay.length - 1];
          if (lastEntry?.type === "output") {
            lastEntry.content = line.content;
          }
          return newDisplay;
        });
      }
    },
    [],
  );

  const processCommand = useCallback(
    async (cmd: CommandEntry) => {
      if (processingStateRef.current.isProcessing) return;
      
      try {
        processingStateRef.current.isProcessing = true;
        
        if (processingStateRef.current.currentIndex > 0) {
          await new Promise((resolve) => setTimeout(resolve, cmd.delay ?? commandDelay));
        }

        // Helper function to type a single prompt
        const typePrompt = async (prompt: string | React.ReactNode) => {
          // Add command prompt
          setDisplay((prev) => [...prev, { type: "command", content: "", done: false }]);

          if (typeof prompt !== "string") {
            setDisplay((prev) => {
              const lastEntry = prev[prev.length - 1];
              if (lastEntry?.type === "command") {
                return [...prev.slice(0, -1), { ...lastEntry, content: prompt, done: true }];
              }
              return prev;
            });
            return;
          }

          // Type the command
          const trimmedPrompt = prompt.trim();
          let currentContent = "";
          
          for (const char of trimmedPrompt) {
            const delay = calculateTypingDelay(
              cmd.typingSpeed ?? defaultTypingSpeed,
              cmd.typingRandom
            );
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            currentContent += char;
            
            setDisplay((prev) => {
              const lastEntry = prev[prev.length - 1];
              if (lastEntry?.type === "command") {
                return [...prev.slice(0, -1), { ...lastEntry, content: currentContent }];
              }
              return prev;
            });
          }

          // Mark command as done
          setDisplay((prev) => {
            const lastEntry = prev[prev.length - 1];
            if (lastEntry?.type === "command") {
              return [...prev.slice(0, -1), { ...lastEntry, done: true }];
            }
            return prev;
          });
        };

        // Process all prompts
        if (Array.isArray(cmd.prompt)) {
          for (const prompt of cmd.prompt) {
            await typePrompt(prompt);
          }
        } else {
          await typePrompt(cmd.prompt);
        }

        // Process outputs
        if (cmd.output) {
          if (cmd.outputDelay) {
            await new Promise((resolve) => setTimeout(resolve, cmd.outputDelay));
          }
          await processCommandOutput(cmd.output, defaultOutputSpeed, cmd.onBeforeOutput);
        }

        cmd.onDone?.();
        processingStateRef.current.currentIndex += 1;
      } catch (error) {
        console.error('Error processing command:', error);
        toast.error(error instanceof Error ? error.message : 'Unknown error', { duration: 3000 });
      } finally {
        processingStateRef.current.isProcessing = false;
      }
    },
    [commandDelay, defaultOutputSpeed, defaultTypingSpeed, calculateTypingDelay, processCommandOutput]
  );

  useEffect(() => {
    if (start) {
      const processCommands = async () => {
        try {
          while (processingStateRef.current.currentIndex < commands.length) {
            const cmd = commands[processingStateRef.current.currentIndex];
            if (cmd) {
              await processCommand(cmd);
            } else {
              processingStateRef.current.currentIndex++;
            }
          }
        } catch (error) {
          console.error('Error processing commands:', error);
          toast.error(`Error processing commands: ${error instanceof Error ? error.message : 'Unknown error'}`, { duration: 2000 });
        }
      };
      void processCommands();
    }
    
    return () => {
      processingStateRef.current.isProcessing = false;
    };
  }, [start, commands, processCommand]);

  // XP Theme styles
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

  const xpTerminalBg = isXP ? '#000000' : (backgroundColor || '#1C1C1C');
  const xpPromptClr = isXP ? '#C0C0C0' : (promptColor || '#00ff00');
  const xpOutputClr = isXP ? '#C0C0C0' : (outputColor || '#EEEEEE');
  const xpTermFont = isXP 
    ? "'Courier New', 'Courier', monospace" 
    : "'DejaVu Sans Mono', 'Ubuntu Mono', 'Consolas', monospace";

  return (
    <div
      className={`mx-auto my-1 ${width} overflow-hidden ${isXP ? 'rounded-sm' : 'rounded-lg'} ${isXP ? '' : 'gnome-terminal'}`}
    >
      {/* Terminal Title Bar */}
      <div 
        className="flex items-center justify-between px-3 py-2 select-none"
        style={isXP ? xpTitleBarStyle : ubuntuTitleBarStyle}
      >
        {/* Window Controls */}
        <div className="flex items-center gap-1.5">
          {isXP ? (
            // XP Style Controls
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
                  <path d="M2 2L6 6M6 2L2 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </>
          ) : (
            // Ubuntu/Gnome Style Controls
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
        {display.map((entry, index) => (
          <div key={`entry-${entry.type}-${index}`} className="my-1">
            {entry.type === "command" && (
              <div className="flex items-start">
                <span 
                  className="mr-2 shrink-0 terminal-text"
                  style={{ color: xpPromptClr }}
                >
                  {isXP ? "C:\\> " : termPrompt}
                </span>
                <span
                  className={`${!entry.done ? "terminal-cursor border-r-2 border-[#4E9A06]" : ""} cursor-pointer break-all rounded px-1 ${isXP ? 'hover:bg-[#001133]' : 'hover:bg-[#333]'}`}
                  style={{ 
                    color: xpOutputClr,
                    fontFamily: xpTermFont,
                  }}
                  onClick={() => {
                    const cmd = commands[processingStateRef.current.currentIndex];
                    if (allowCopy && entry.done && typeof entry.content === "string" && cmd) {
                      cmd.onCopy?.();
                      navigator.clipboard.writeText(entry.content).then(() => {
                        toast.success("Copied to clipboard", {
                          duration: 1000,
                        });
                      }).catch((error) => {
                        console.error("Failed to copy to clipboard:", error);
                        toast.error("Failed to copy to clipboard", {
                          duration: 1000,
                        });
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (entry.done && (e.key === 'Enter' || e.key === ' ')) {
                      const cmd = commands[processingStateRef.current.currentIndex];
                      if (allowCopy && typeof entry.content === "string" && cmd) {
                        cmd.onCopy?.();
                        navigator.clipboard.writeText(entry.content).then(() => {
                          toast.success("Copied to clipboard", { duration: 1000 });
                        }).catch((error) => {
                          console.error("Failed to copy to clipboard:", error);
                          toast.error("Failed to copy to clipboard", { duration: 1000 });
                        });
                      }
                    }
                  }}
                >
                  {entry.content}
                </span>
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