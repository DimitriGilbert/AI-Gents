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
    <main className="min-h-screen py-8 px-4 md:px-6 lg:px-8">
      {/* Hero Section - Welcome Window */}
      <WindowFrame 
        title="Welcome to AI-Gents" 
        className="mb-8 w-full cascade-in cascade-delay-1 z-layer-1"
        width="w-full"
        
      >
        <div className="window-content-spacious text-center">
          <h1 
            className="os-heading mb-5"
            style={{ 
              color: headingColor,
              textShadow: isXP ? 'none' : '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.1)'
            }}
          >
            AI-Gents
          </h1>
          <h2 
            className="os-subheading mb-3"
            style={{ color: isXP ? '#555555' : '#5A4A4A' }}
          >
            Gently AI-up your terminal and{" "}
            <span style={{ color: accentColor, fontWeight: 'bold' }}>CLI</span> apps
          </h2>
          <h3 className="os-body-text" style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
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

      {/* Bento Desktop Grid */}
      <div className="container mx-auto max-w-[1600px] bento-grid">
        
        {/* Installation Terminal - Wide, Tall */}
        <WindowFrame 
          title={isXP ? "Command Prompt - Installation" : "Terminal - Installation"} 
          className="col-span-12 md:col-span-8 lg:col-span-8 window-min-h-lg cascade-in cascade-delay-2 offset-left z-layer-2"
        >
          <div className="window-content-spacious">
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
            <div className="mt-6 flex justify-center gap-4">
              <Link href="https://github.com/DimitriGilbert/ai-gents/archive/refs/heads/main.zip">
                <RetroButton variant="primary" size="md" >
                  Download ZIP
                </RetroButton>
              </Link>
              <Link href="https://github.com/DimitriGilbert/ai-gents">
                <RetroButton size="md" >
                  View on GitHub
                </RetroButton>
              </Link>
            </div>
          </div>
        </WindowFrame>

        {/* Agent Config - Compact */}
        <WindowFrame 
          title="agent.yml - Configuration File" 
          className="col-span-12 md:col-span-4 lg:col-span-4 window-min-h cascade-in cascade-delay-3 z-layer-3"
        >
          <div className="window-content-spacious">
            <pre 
              className="max-h-[400px] overflow-x-auto rounded-lg p-4 font-mono text-[15px]"
              style={{ 
                background: isXP ? '#000000' : '#1C1C1C', 
                color: isXP ? '#C0C0C0' : '#4E9A06',
                border: isXP ? '2px solid #7A8A9A' : '2px solid #3C2F2F',
                fontFamily: isXP ? "'Courier New', monospace" : "monospace",
              }}
            >
              <code>{agentConfig}</code>
            </pre>
          </div>
        </WindowFrame>

        {/* What Are Agents - Medium */}
        <WindowFrame 
          title="What are agents?" 
          className="col-span-12 md:col-span-6 lg:col-span-6 window-min-h cascade-in cascade-delay-4 offset-right z-layer-2"
        >
          <div className="window-content-spacious space-y-5" style={{ color: bodyTextColor }}>
            <h3 
              className="os-heading text-center"
              style={{ color: headingColor }}
            >
              A &ldquo;spec&rdquo; for{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>
            </h3>
            <p className="os-body-text">
              AI-gents started as a format/spec/... for me to store my{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>
            </p>
            <p className="os-body-text">
              See, everyone and their grand-mother do &lt;&lt;
              <span style={{ color: accentColor, fontWeight: 'bold' }}>AGENTS</span>
              &gt;&gt; now, and all these have their own proprietary way of doing it.
            </p>
            <p className="os-body-text">
              I just want to store my{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>{" "}
              in a simple way, and then use them with any LLM. Is this too much ?!?!?
            </p>
            <p className="os-body-text">That is how it started...but first...</p>
            
            <h3 className="os-subheading pt-4">
              What are{" "}
              <span style={{ color: accentColor, fontWeight: 'bold' }}>agents</span>?{" "}
              <span style={{ color: isXP ? '#245EDC' : '#772953' }}>REALLY?</span>
            </h3>
            <p className="os-body-text">
              From all the marketing words salad BS we are force fed, I would
              define an agent as...
            </p>
            <p className="os-body-text">
              A fancy prompt... (or a set of prompts, that can be chained)
              tailored to a specific task.
            </p>
            <p className="os-body-text">
              They might come with documents, tools and what not, the point
              remains, they&apos;re &ldquo;just&rdquo; a fancy prompt.
            </p>
            <div 
              className="mt-6 p-4 rounded-lg"
              style={{
                background: isXP 
                  ? 'linear-gradient(to bottom, #E8E8E8 0%, #D8D8D8 100%)' 
                  : 'linear-gradient(to bottom, #E8E0D5 0%, #DDD5CA 100%)',
                border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                borderTopColor: isXP ? '#F0F0F0' : '#E8E0D5',
                borderLeftColor: isXP ? '#F0F0F0' : '#E8E0D5',
                boxShadow: isXP 
                  ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)' 
                  : '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h4 
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: isXP ? '#333333' : '#5A4A4A' }}
              >
                Key Point
              </h4>
              <p className="text-sm os-body-text" style={{ color: isXP ? '#555555' : '#5A4A4A' }}>
                That does not seem that hard is it? It is just a YAML file with some structure!
              </p>
            </div>
          </div>
        </WindowFrame>

        {/* Bash Section - Medium */}
        <WindowFrame 
          title="A text file to store structured data..." 
          className="col-span-12 md:col-span-6 lg:col-span-6 window-min-h cascade-in cascade-delay-5 z-layer-1"
        >
          <div className="window-content-spacious space-y-5" style={{ color: bodyTextColor }}>
            <h3 className="os-heading text-center">
              A text file to store structured data...
            </h3>
            <p className="os-body-text">
              I know, when you put it like that, it sounds{" "}
              <span style={{ color: '#CC0000', fontWeight: 'bold' }}>LAME</span> AF...{" "}
              <span style={{ color: accentColor }}>it is</span>...
            </p>
            <p className="os-body-text">
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
            <p className="os-body-text">
              I made a &ldquo;chat app&rdquo;, yuuup, guessed it, in{" "}
              <span style={{ 
                fontWeight: 'bold',
                color: secondaryColor,
                fontFamily: isXP ? "'Courier New', monospace" : 'monospace'
              }}>
                Bash
              </span>
            </p>
            
            <div 
              className="mt-6 p-4 rounded-lg"
              style={{
                background: isXP 
                  ? 'linear-gradient(to bottom, #E8E8E8 0%, #D8D8D8 100%)' 
                  : 'linear-gradient(to bottom, #E8E0D5 0%, #DDD5CA 100%)',
                border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                borderTopColor: isXP ? '#F0F0F0' : '#E8E0D5',
                borderLeftColor: isXP ? '#F0F0F0' : '#E8E0D5',
                boxShadow: isXP 
                  ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)' 
                  : '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h4 
                className="text-sm font-semibold mb-3 uppercase tracking-wide"
                style={{ color: isXP ? '#333333' : '#5A4A4A' }}
              >
                Dependencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {['jq', 'yq', 'curl', 'rlwrap'].map((dep) => (
                  <span 
                    key={dep}
                    className="px-3 py-1.5 rounded-md font-mono text-sm"
                    style={{
                      background: isXP ? '#F5F5F5' : '#F0EBE3',
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      color: isXP ? '#333333' : '#5A4A4A',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* Ask or Chat - Wide */}
        <WindowFrame 
          title="Ask or chat with an AI, in your terminal!" 
          className="col-span-12 md:col-span-8 lg:col-span-8 window-min-h-lg cascade-in cascade-delay-6 offset-left z-layer-2"
        >
          <div className="window-content-spacious">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-5" style={{ color: bodyTextColor }}>
                <h3 className="os-heading text-center">
                  Ask or chat with an ai, in your terminal!
                </h3>
                <p className="os-body-text">
                  I don&apos;t know about you, but I very often have at least one terminal
                  open
                </p>
                <p className="os-body-text">
                  For a quick AI fix, open a terminal,{" "}
                  <code 
                    className="px-2 py-1 rounded-md font-mono text-[15px]"
                    style={{ 
                      background: isXP ? '#F5F5F5' : '#F0EBE3',
                      color: secondaryColor,
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai ask &quot;something important&quot; --stream
                  </code>
                  , Boom, done.
                </p>
                <p className="os-body-text">
                  And if you need more than a single shot you are just an{" "}
                  <code 
                    className="px-2 py-1 rounded-md font-mono text-[15px]"
                    style={{ 
                      background: isXP ? '#F5F5F5' : '#F0EBE3',
                      color: secondaryColor,
                      border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai chat &quot;I need to talk&quot;
                  </code>
                  {" "}away
                </p>
                
                <div 
                  className="mt-6 p-4 rounded-lg"
                  style={{
                    background: isXP 
                      ? 'linear-gradient(to bottom, #E8E8E8 0%, #D8D8D8 100%)' 
                      : 'linear-gradient(to bottom, #E8E0D5 0%, #DDD5CA 100%)',
                    border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                    borderTopColor: isXP ? '#F0F0F0' : '#E8E0D5',
                    borderLeftColor: isXP ? '#F0F0F0' : '#E8E0D5',
                    boxShadow: isXP 
                      ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)' 
                      : '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <h4 
                    className="text-sm font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: isXP ? '#333333' : '#5A4A4A' }}
                  >
                    Available Options
                  </h4>
                  <ul className="space-y-2" style={{ color: isXP ? '#555555' : '#5A4A4A' }}>
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
                </div>

                <h3 className="os-subheading pt-4">
                  Once you are a regular, create an agent!
                </h3>
                <p className="os-body-text">
                  Whatever the case, it is time for you to{" "}
                  <code 
                    className="px-2 py-1 rounded-md font-mono text-[15px]"
                    style={{ 
                      background: isXP ? '#F5F5F5' : '#F0EBE3',
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

        {/* Maurice Demo - Compact, Tall */}
        <WindowFrame 
          title="Meet Maurice - The Rude Parisian Waiter" 
          className="col-span-12 md:col-span-4 lg:col-span-4 window-min-h-xl cascade-in cascade-delay-7 offset-right z-layer-3"
        >
          <div className="window-content-spacious">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
                <h3 className="os-subheading">Not just One prompt</h3>
                <p className="os-body-text">
                  Sometimes, you can have a nice &ldquo;base prompt&rdquo; for your agent, 
                  but you might want to make it modular? Or add functionalities?
                </p>
                <p className="os-body-text">
                  For that, you can use the &ldquo;tasks&rdquo; section in the agent
                  configuration file.
                </p>
                
                <div 
                  className="mt-4 p-4 rounded-lg"
                  style={{
                    background: isXP 
                      ? 'linear-gradient(to bottom, #E8E8E8 0%, #D8D8D8 100%)' 
                      : 'linear-gradient(to bottom, #E8E0D5 0%, #DDD5CA 100%)',
                    border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                    borderTopColor: isXP ? '#F0F0F0' : '#E8E0D5',
                    borderLeftColor: isXP ? '#F0F0F0' : '#E8E0D5',
                    boxShadow: isXP 
                      ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)' 
                      : '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <h4 
                    className="text-sm font-semibold mb-2 uppercase tracking-wide"
                    style={{ color: isXP ? '#333333' : '#5A4A4A' }}
                  >
                    Using Tasks
                  </h4>
                  <p className="text-sm mb-3 os-body-text" style={{ color: isXP ? '#555555' : '#5A4A4A' }}>
                    Invoke a task with:
                  </p>
                  <code 
                    className="block p-2 rounded-md font-mono text-[13px]"
                    style={{ 
                      background: isXP ? '#000000' : '#1C1C1C',
                      color: isXP ? '#C0C0C0' : '#4E9A06',
                      border: isXP ? '1px solid #7A8A9A' : '1px solid #3C2F2F',
                      fontFamily: isXP ? "'Courier New', monospace" : 'monospace',
                    }}
                  >
                    ai agent ask Maurice &quot;#/task task-name;your prompt&quot;
                  </code>
                </div>
                
                <p className="text-sm os-body-text" style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
                  You can also use bash commands in your prompts with{" "}
                  <code style={{ color: secondaryColor, fontFamily: isXP ? "'Courier New', monospace" : 'monospace' }}>#!/command;</code> syntax!
                </p>
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* What For - Full Width */}
        <WindowFrame 
          title="What for?" 
          className="col-span-12 window-min-h cascade-in cascade-delay-8 z-layer-1"
        >
          <div className="window-content-spacious">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5" style={{ color: bodyTextColor }}>
                <h3 className="os-heading text-center pb-4">
                  What for ... ?
                </h3>
                <p className="os-body-text">
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
                    className="px-2 py-1 rounded-md font-mono text-[15px]"
                    style={{ 
                      background: isXP ? '#F5F5F5' : '#F0EBE3',
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
                <p className="os-body-text">
                  <strong>I think NOT!</strong>
                </p>
                <p className="os-body-text">
                  Just like UI vs{" "}
                  <span style={{ color: accentColor, fontWeight: 'bold' }}>CLI</span>{" "}
                  usage for any task, you are way more efficient, especially with completion!
                </p>
                
                <div 
                  className="mt-8 p-4 rounded-lg"
                  style={{
                    background: isXP 
                      ? 'linear-gradient(to bottom, #E8E8E8 0%, #D8D8D8 100%)' 
                      : 'linear-gradient(to bottom, #E8E0D5 0%, #DDD5CA 100%)',
                    border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
                    borderTopColor: isXP ? '#F0F0F0' : '#E8E0D5',
                    borderLeftColor: isXP ? '#F0F0F0' : '#E8E0D5',
                    boxShadow: isXP 
                      ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)' 
                      : '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <h4 
                    className="text-sm font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: isXP ? '#333333' : '#5A4A4A' }}
                  >
                    Related Projects
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span style={{ color: isXP ? '#555555' : '#5A4A4A', fontWeight: '600' }}>ButT3r:</span>
                      <Link 
                        href="https://Butt3r.dev" 
                        target="_blank"
                        style={{ color: secondaryColor }}
                        className="underline hover:opacity-80"
                      >
                        create-t3-app wrapper with --ai flag
                      </Link>
                    </div>
                    <div className="flex items-start gap-2">
                      <span style={{ color: isXP ? '#555555' : '#5A4A4A', fontWeight: '600' }}>parseArger:</span>
                      <Link 
                        href="https://github.com/DimitriGilbert/parseArger" 
                        target="_blank"
                        style={{ color: secondaryColor }}
                        className="underline hover:opacity-80"
                      >
                        Bash argument parser
                      </Link>
                    </div>
                  </div>
                </div>
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
      <div className="mt-16 text-center" style={{ color: isXP ? '#333333' : '#F5F1E8' }}>
        <p className="text-base opacity-80">
          AI-Gents — A CLI tool for AI agents
        </p>
      </div>
    </main>
  );
}
