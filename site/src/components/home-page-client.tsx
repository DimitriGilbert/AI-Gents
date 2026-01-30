"use client";

import Link from "next/link";
import Terminable from "~/components/ui/Terminable";
import { WindowFrame, RetroPanel, RetroButton } from "~/components/ui/window-frame";
import { useTheme } from "next-themes";

interface HomePageClientProps {
  agentConfig: string;
}

export default function HomePageClient({ agentConfig }: HomePageClientProps) {
  const { theme } = useTheme();
  const isXP = theme === "xp";

  // XP theme text colors
  const headingColor = isXP ? '#1A1A1A' : '#3C2F2F';
  const accentColor = isXP ? '#245EDC' : '#DD4814';
  const secondaryColor = isXP ? '#0033CC' : '#772953';
  const bodyTextColor = isXP ? '#333333' : '#3C2F2F';

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4">
      {/* Hero Section - Welcome Window */}
      <WindowFrame 
        title="Welcome to AI-Gents" 
        className="mb-8 max-w-4xl"
        width="w-full"
        
      >
        <div className="p-8 text-center">
          <h1 
            className="text-5xl font-bold mb-4"
            style={{ 
              color: headingColor,
              textShadow: isXP ? 'none' : '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.1)'
            }}
          >
            AI-Gents
          </h1>
          <h2 
            className="text-xl mb-2"
            style={{ color: isXP ? '#555555' : '#5A4A4A' }}
          >
            Gently AI-up your terminal and{" "}
            <span style={{ color: accentColor, fontWeight: 'bold' }}>CLI</span> apps
          </h2>
          <h3 style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
            With (or without) your own{" "}
            <span style={{ 
              color: accentColor, 
              fontWeight: 'bold',
              textShadow: isXP ? 'none' : '0 1px 0 rgba(255,255,255,0.5)'
            }}>
              agents
            </span>
          </h3>
        </div>
      </WindowFrame>

      {/* Main Content Grid */}
      <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - What are agents? */}
        <WindowFrame title="What are agents?" className="h-full" >
          <div className="p-6 space-y-4" style={{ color: bodyTextColor }}>
            <h3 
              className="text-xl font-bold text-center py-4"
              style={{ color: headingColor }}
            >
              A &ldquo;spec&rdquo; for{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>
            </h3>
            <p>
              AI-gents started as a format/spec/... for me to store my{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>
            </p>
            <p>
              See, everyone and their grand-mother do &lt;&lt;
              <span style={{ color: accentColor, fontWeight: 'bold' }}>AGENTS</span>
              &gt;&gt; now, and all these have their own proprietary way of doing it.
            </p>
            <p>
              I just want to store my{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>{" "}
              in a simple way, and then use them with any LLM. Is this too much ?!?!?
            </p>
            <p>That is how it started...but first...</p>
            
            <h3 className="text-lg font-bold pt-4">
              What are{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>?{" "}
              <span style={{ color: isXP ? '#245EDC' : '#772953' }}>REALLY?</span>
            </h3>
            <p>
              From all the marketing words salad BS we are force fed, I would
              define an agent as...
            </p>
            <p>
              A fancy prompt... (or a set of prompts, that can be chained)
              tailored to a specific task.
            </p>
            <p>
              They might come with documents, tools and what not, the point
              remains, they&apos;re &ldquo;just&rdquo; a fancy prompt.
            </p>
            <RetroPanel title="Key Point" className="mt-4" >
              <p className="text-sm" style={{ color: isXP ? '#555555' : '#5A4A4A' }}>
                That does not seem that hard is it? It is just a YAML file with some structure!
              </p>
            </RetroPanel>
          </div>
        </WindowFrame>

        {/* Right Column - Installation Terminal */}
        <WindowFrame title={isXP ? "Command Prompt - Installation" : "Terminal - Installation"} className="h-full" >
          <div className="p-4">
            <Terminable
              startLine=""
              title={isXP ? "C:\\Windows\\System32\\cmd.exe" : "Install AI-Gents"}
              
              commands={[
                {
                  prompt: "git clone git@github.com:DimitriGilbert/ai-gents.git",
                  output: {
                    content: "Cloning 'ai-gents' => done.\n",
                    delay: 1500,
                    placeholder: "Cloning into 'ai-gents'....\n",
                  },
                },
                {
                  prompt: ["cd ai-gents"],
                },
                {
                  prompt: [
                    "# Or...",
                    "# if you are allergic to proper tools, you can still download the zip...",
                  ],
                },
                {
                  prompt: ["utils/install --help"],
                  output: {
                    content: `install AI-Gents:
    -i, --shell-rc-file|--install-file <shell-rc-file>
    -p, --default-provider <default-provider>
    -c, --credential <credential>
    --install-dependencies|--no-install-dependencies`,
                  },
                },
              ]}
            />
            <div className="mt-4 flex justify-center gap-3">
              <Link href="https://github.com/DimitriGilbert/ai-gents/archive/refs/heads/main.zip">
                <RetroButton variant="primary" size="sm" >
                  Download ZIP
                </RetroButton>
              </Link>
              <Link href="https://github.com/DimitriGilbert/ai-gents">
                <RetroButton size="sm" >
                  View on GitHub
                </RetroButton>
              </Link>
            </div>
          </div>
        </WindowFrame>

        {/* Agent Config Window */}
        <WindowFrame title="agent.yml - Configuration File" className="h-full" >
          <div className="p-4">
            <pre 
              className="max-h-[500px] overflow-x-auto rounded p-4 font-mono text-sm"
              style={{ 
                background: isXP ? '#000000' : '#1C1C1C', 
                color: isXP ? '#C0C0C0' : '#4E9A06',
                border: isXP ? '1px solid #7A8A9A' : '1px solid #3C2F2F',
                fontFamily: isXP ? "'Courier New', monospace" : "monospace",
              }}
            >
              <code>{agentConfig}</code>
            </pre>
          </div>
        </WindowFrame>

        {/* What is it? Window */}
        <WindowFrame title="A text file to store structured data..." className="h-full" >
          <div className="p-6 space-y-4" style={{ color: bodyTextColor }}>
            <h3 className="text-xl font-bold text-center pb-4">
              A text file to store structured data...
            </h3>
            <p>
              I know, when you put it like that, it sounds{" "}
              <span style={{ color: '#CC0000', fontWeight: 'bold' }}>LAME</span> AF...{" "}
              <span style={{ color: accentColor }}>it is</span>...
            </p>
            <p>
              So because of that, the fact that I was going to have to test it
              (the agent file format) and because I do{" "}
              <span style={{ 
                fontWeight: 'bold',
                color: secondaryColor,
                fontFamily: isXP ? "'Courier New', monospace" : 'monospace'
              }}>
                Bash
              </span>
              ...
            </p>
            <p>
              I made a &ldquo;chat app&rdquo;, yuuup, guessed it, in{" "}
              <span style={{ 
                fontWeight: 'bold',
                color: secondaryColor,
                fontFamily: isXP ? "'Courier New', monospace" : 'monospace'
              }}>
                Bash
              </span>
            </p>
            
            <RetroPanel title="Dependencies" className="mt-4" >
              <div className="flex flex-wrap gap-2 text-sm">
                {['jq', 'yq', 'curl', 'rlwrap'].map((dep) => (
                  <span 
                    key={dep}
                    className="px-2 py-1 rounded font-mono"
                    style={{
                      background: isXP ? '#E8E8E8' : '#E8E0D5',
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      color: isXP ? '#333333' : '#5A4A4A',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </RetroPanel>
          </div>
        </WindowFrame>

        {/* Ask and Chat Window */}
        <WindowFrame title="Ask or chat with an AI, in your terminal!" className="lg:col-span-2" >
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4" style={{ color: bodyTextColor }}>
                <h3 className="text-xl font-bold text-center pb-4">
                  Ask or chat with an ai, in your terminal!
                </h3>
                <p>
                  I don&apos;t know about you, but I very often have at least one terminal
                  open
                </p>
                <p>
                  For a quick AI fix, open a terminal,{" "}
                  <code 
                    className="px-1 py-0.5 rounded font-mono text-sm"
                    style={{ 
                      background: isXP ? '#E8E8E8' : '#E8E0D5',
                      color: secondaryColor,
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai ask &quot;something important&quot; --stream
                  </code>
                  , Boom, done.
                </p>
                <p>
                  And if you need more than a single shot you are just an{" "}
                  <code 
                    className="px-1 py-0.5 rounded font-mono text-sm"
                    style={{ 
                      background: isXP ? '#E8E8E8' : '#E8E0D5',
                      color: secondaryColor,
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai chat &quot;I need to talk&quot;
                  </code>
                  {" "}away
                </p>
                
                <RetroPanel title="Available Options" className="mt-4" >
                  <ul className="text-sm space-y-2" style={{ color: isXP ? '#555555' : '#5A4A4A' }}>
                    <li>
                      <code style={{ color: secondaryColor, fontFamily: isXP ? "'Courier New', monospace" : 'monospace' }}>--model</code>: gpt-4, claude-3.5, deepseek, ...
                    </li>
                    <li>
                      <code style={{ color: secondaryColor, fontFamily: isXP ? "'Courier New', monospace" : 'monospace' }}>--provider</code>: openrouter, openai, anthropic, ollama, ...
                    </li>
                    <li>
                      <code style={{ color: secondaryColor, fontFamily: isXP ? "'Courier New', monospace" : 'monospace' }}>--system</code>: custom system prompt
                    </li>
                  </ul>
                </RetroPanel>

                <h3 className="text-lg font-bold pt-4">
                  Once you are a regular, create an agent!
                </h3>
                <p>
                  Whatever the case, it is time for you to{" "}
                  <code 
                    className="px-1 py-0.5 rounded font-mono text-sm"
                    style={{ 
                      background: isXP ? '#E8E8E8' : '#E8E0D5',
                      color: secondaryColor,
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai agent create a-fancy-agent
                  </code>
                </p>
              </div>
              
              <div>
                <Terminable
                  startLine=""
                  title={isXP ? "C:\\Windows\\System32\\cmd.exe" : "Ask or chat demo"}
                  
                  commands={[
                    {
                      prompt: "ai ask 'what does ouh la la mean in French?'",
                      output: {
                        content: `"Ouh la la" is a casual, informal expression in French that roughly translates to "Oh my" or "Wow!" It's often used to express surprise, admiration, or delight.`,
                        delay: 1500,
                        placeholder: "...",
                      },
                    },
                    {
                      prompt: "ai chat 'Hello AI!'",
                      output: [
                        "AI > Hello! How can I assist you today?",
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* Maurice Demo */}
        <WindowFrame title="Meet Maurice - The Rude Parisian Waiter" className="lg:col-span-2" >
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Terminable
                  startLine=""
                  title={isXP ? "C:\\Windows\\System32\\cmd.exe" : "Maurice Agent Demo"}
                  
                  commands={[
                    {
                      prompt: `ai agent create Maurice --prompt "You are Maurice, a typical unpolite and rude parisian waiter." --provider lmstudio --model hermes-3-llama-3.2-3b`,
                      output: {
                        content: "Agent 'Maurice' created successfully!",
                        delay: 800,
                      },
                    },
                    {
                      prompt: `ai agent ask Maurice "Hi Maurice, could I have the menu please?"`,
                      output: {
                        content: `What do you want, it's not my problem! I'm just here to serve. Here you go, take it and read it yourself. It's all there, no need for me to explain it to you. Now hurry up, I've got better things to do than talk to people who don't even order anything!`,
                        delay: 1500,
                      },
                    },
                  ]}
                />
              </div>
              <div className="space-y-4" style={{ color: bodyTextColor }}>
                <h3 className="text-xl font-bold">Not just One prompt</h3>
                <p>
                  Sometimes, you can have a nice &ldquo;base prompt&rdquo; for your agent, 
                  but you might want to make it modular? Or add functionalities?
                </p>
                <p>
                  For that, you can use the &ldquo;tasks&rdquo; section in the agent
                  configuration file.
                </p>
                
                <RetroPanel title="Using Tasks" className="mt-4" >
                  <p className="text-sm mb-2" style={{ color: isXP ? '#555555' : '#5A4A4A' }}>
                    Invoke a task with:
                  </p>
                  <code 
                    className="block p-2 rounded font-mono text-sm"
                    style={{ 
                      background: isXP ? '#000000' : '#1C1C1C',
                      color: isXP ? '#C0C0C0' : '#4E9A06',
                      border: isXP ? '1px solid #7A8A9A' : '1px solid #3C2F2F',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai agent ask Maurice &quot;#/task task-name;your prompt&quot;
                  </code>
                </RetroPanel>
                
                <p className="text-sm" style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
                  You can also use bash commands in your prompts with{" "}
                  <code style={{ color: secondaryColor, fontFamily: isXP ? "'Courier New', monospace" : 'monospace' }}>#!/command;</code> syntax!
                </p>
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* What For Section */}
        <WindowFrame title="What for?" className="lg:col-span-2" >
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4" style={{ color: bodyTextColor }}>
                <h3 className="text-2xl font-bold text-center pb-4">
                  What for ... ?
                </h3>
                <p>
                  You might say I already have{" "}
                  <Link 
                    href="https://openwebui.com/" 
                    className="underline"
                    style={{ color: secondaryColor }}
                  >
                    openWebUi
                  </Link>{" "}
                  or{" "}
                  <Link 
                    href="https://t3.chat/" 
                    className="underline"
                    style={{ color: secondaryColor }}
                  >
                    T3.chat
                  </Link>{" "}
                  and that&apos;s true, but can these add{" "}
                  <code 
                    className="px-1 py-0.5 rounded font-mono text-sm"
                    style={{ 
                      background: isXP ? '#E8E8E8' : '#E8E0D5',
                      color: secondaryColor,
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    --ai
                  </code>
                  {" "}to your{" "}
                  <span style={{ color: accentColor, fontWeight: 'bold' }}>CLI</span>??
                </p>
                <p>
                  <strong>I think NOT!</strong>
                </p>
                <p>
                  Just like UI vs{" "}
                  <span style={{ color: accentColor, fontWeight: 'bold' }}>CLI</span>{" "}
                  usage for any task, you are way more efficient, especially with completion!
                </p>
                
                <RetroPanel title="Related Projects" className="mt-6" >
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span style={{ color: isXP ? '#555555' : '#5A4A4A' }}>ButT3r:</span>
                      <Link 
                        href="https://Butt3r.dev" 
                        target="_blank"
                        style={{ color: secondaryColor }}
                        className="underline"
                      >
                        create-t3-app wrapper with --ai flag
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: isXP ? '#555555' : '#5A4A4A' }}>parseArger:</span>
                      <Link 
                        href="https://github.com/DimitriGilbert/parseArger" 
                        target="_blank"
                        style={{ color: secondaryColor }}
                        className="underline"
                      >
                        Bash argument parser
                      </Link>
                    </div>
                  </div>
                </RetroPanel>
              </div>
              
              <div>
                <Terminable
                  startLine=""
                  title={isXP ? "C:\\Windows\\System32\\cmd.exe" : "parseArger Example"}
                  
                  commands={[
                    {
                      prompt: `ai ask --system "create bash code for parseArger" "Parsing code:"`,
                      output: {
                        content: `To create a bash script that uses the provided parsing code:

\`\`\`bash
# After all parsing is done...

if [ -z "$_arg_error_file" ]; then
    die "Error: error-file must be specified" 1
fi

# Extract lines from the error file
start_line=\${_arg_from_line:-1}
content=$(sed "\${start_line},\${_arg_to_line}p" \${_arg_error_file})

# Create a prompt for AI analysis
prompt="Analyze this log entry: $(echo "$content")"

# Call ai ask with the parsed arguments
ai ask --model "\${_arg_model}" --provider "\${_arg_provider}" <<< "$prompt"
\`\`\``,
                        delay: 2000,
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </WindowFrame>

      </div>

      {/* Footer */}
      <div className="mt-12 text-center" style={{ color: isXP ? '#333333' : '#F5F1E8' }}>
        <p className="text-sm opacity-80">
          AI-Gents — A CLI tool for AI agents
        </p>
      </div>
    </main>
  );
}
