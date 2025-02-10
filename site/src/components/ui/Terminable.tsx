"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  backgroundColor = "bg-[#1a1a1a]",
  promptColor = "text-[#00ff00]",
  outputColor = "text-white",
  greenMenu,
  yellowMenu,
  redMenu,
  title,
  commandDelay = 1000,
  allowCopy = true,
  start = true,
}: TerminableProps) {
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
    return (baseSpeed: number, randomFactor: number = 0) => {
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

  return (
    <div
      className={`mx-auto my-1 ${width} overflow-hidden rounded-lg ${backgroundColor} font-mono`}
    >
      <div className="flex items-center bg-[#333] px-2">
        <Menubar className="border-none bg-transparent shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="p-0 hover:bg-transparent">
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </MenubarTrigger>
            <MenubarContent>{greenMenu && greenMenu}</MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="p-0 hover:bg-transparent">
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            </MenubarTrigger>
            <MenubarContent>{yellowMenu && yellowMenu}</MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="p-0 hover:bg-transparent">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            </MenubarTrigger>
            <MenubarContent>{redMenu && redMenu}</MenubarContent>
          </MenubarMenu>{" "}
        </Menubar>
        <div className="flex-1 text-center text-sm">
          {title}
        </div>
      </div>
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        className={`${height} overflow-y-auto p-5 ${promptColor} whitespace-pre-wrap break-words`}
        role="log"
        aria-live="polite"
      >
        {display.map((entry, index) => (
          <div key={`${index}-${entry.type}`} className="my-1">
            {entry.type === "command" && (
              <div className="flex">
                <span className={`mr-2 ${promptColor}`}>{termPrompt}</span>
                <span
                  className={`${!entry.done ? "animate-blink border-r-2 border-[#00ff00]" : ""} cursor-pointer break-all rounded px-1 hover:bg-[#333]`}
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
                >
                  {entry.content}
                </span>
              </div>
            )}
            {entry.type === "output" && (
              <div
                key={`${index}__`}
                className={`ml-6 whitespace-pre-wrap break-all ${outputColor}`}
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