import Link from "next/link";
import Terminable from "~/components/ui/Terminable";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          AI-Gents
        </h1>
      </div>
      <div className="container flex flex-col items-center justify-center gap-4 p-4">
        <h2>Gently AI-up your terminal and CLI apps</h2>
        <h3>With (or without) your own agents</h3>
      </div>
      <div className="flex-col-2 container flex gap-4 p-4">
        <div className="justify flex w-1/2 flex-col gap-4">
          <h3 className="py-8 text-2xl font-bold">
            A &ldquo;spec&rdquo; for agents
          </h3>
          <p>AI-gents started as a format/spec/... for me to store my agents</p>
          <p>
            See, everyone and their grand-mother do &lt;&lt;AGENTS&gt;&gt; now,
          </p>
          <p>and all these have their own proprietary way of doing it.</p>
          <p>
            I just want to store my agents in a simple way, that can be used by
            any LLM.
          </p>
          <p>That is how it started...</p>
          <h3 className="py-8 text-xl font-bold">What are agents ?</h3>
          <p>
            From all the marketing word salad BS we're earing, I would define an
            agent as...
          </p>
          <p>
            A fancy prompt... (or a set of prompt, that can be chained) tailored
            to a specific task.
          </p>
          <p>
            They might come with documents, tools and what not, the point
            remains, they're &ldquo;just&rdquo; a fancy prompt.
          </p>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <Terminable
            startLine="                                                                                      "
            title="Install AI-Gents"
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
                prompt: [
                  "# Or...\n",
                  "curl -sSL https://github.com/DimitriGilbert/ai-gents/archive/refs/heads/main.zip -o AI-Gents-main.zip && unzip AI-Gents-main.zip 'main/*' -d ai-gents && mv ai-gents/main/* ai-gents/ && rmdir ai-gents/main",
                ],
                output: {
                  content: "Downloading 'ai-gents' => done.\n",
                  delay: 1500,
                  placeholder: "Downloading ai-gents.zip....\n",
                },
                typingSpeed: 10,
              },
              {
                prompt: [
                  "# if you are allergic to proper tools, you can still download the zip with the command above or \n",
                  <Link href="https://github.com/DimitriGilbert/ai-gents/archive/refs/heads/main.zip">
                    <Button className="bg-orange-500 text-black">here</Button>
                  </Link>,
                ],
              },
              {
                prompt: ["cd ai-gents"],
              },
              {
                prompt: ["utils/install --help"],
                output: {
                  content: `install AI-Gents:
        -i, --shell-rc-file|--install-file <shell-rc-file>: where to put the source directive, repeatable
        -p, --default-provider <default-provider>: default provider
        -c, --credential <credential>: provider credential, <provider>:<credential>, repeatable
        --install-dependencies|--no-install-dependencies: install dependencies, on by default (use --no-install-dependencies to turn it off)
                no-aliases: --no-deps,`,
                },
              },
            ]}
          />
        </div>
      </div>
      <div className="container flex gap-4 p-4">
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <h3 className="py-8 text-xl font-bold">
            So basically, a structured file to store text...
          </h3>
          <p>I know, when put like that, it sounds **LAME** AF... it is...
            So because of that, the fact that I was going to have to test it
            (the agent file format) and because I do bash...
          </p>
          <p>
            I made a chat, yuuup, guessed it, in bash (heyyyy, what could
            possibly go wrong ? huuum ?? uuhhh... sh...)
          </p>
          <div>
            Few dependencies though,{" "}
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-sm leading-relaxed">
                <span className="font-bold text-gray-400 underline dark:text-gray-300">
                  jq
                </span>{" "}
                and{" "}
                <span className="font-bold text-gray-400 underline dark:text-gray-300">
                  yq
                </span>{" "}
                for json/yaml interaction
              </li>
              <li className="text-sm leading-relaxed">
                <span className="font-bold text-gray-400 underline dark:text-gray-300">
                  curl
                </span>{" "}
                (duh)
              </li>
              <li className="text-sm leading-relaxed">
                <span className="font-bold text-gray-400 underline dark:text-gray-300">
                  rlwrap
                </span>{" "}
                for typing in chat (a nightmare without !)
              </li>
            </ul>
          </div>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <h3 className="py-8 text-xl font-bold">
            What Could You Use It For ?
          </h3>
          <p>
            I mean... Bash ? Like... What ? How ? why ?{" "}
            <span className="text-xs">
              Did my mom dropped me one too many times as a baby ?
            </span>
          </p>
        </div>
      </div>
      <div className="container flex gap-4 p-4">
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <Terminable
            startLine="                                                                                      "
            title="Ask or chat with an ai, in your terminal !"
            commands={[
              {
                prompt: "ai ask 'something very important'",
              },
              {
                prompt: "ai chat 'I need to talk'",
              },
            ]}
          />
        </div>
        <div className="justify flex w-1/2 flex-col gap-4">
          <h3 className="pb-2 pt-4 text-xl font-bold">
            Ask or chat with an ai, in your terminal !
          </h3>
          <p>
            I don't know about you, but I very often have atleast one terminal
            open
          </p>
          <p>
            For a quick AI fix, I open a terminal,{" "}
            <code>ai ask "something very important"</code>, Boom, done
          </p>
          <p>
            And if I need more than a single shot I am just an{" "}
            <code>ai chat "I need to talk"</code> away
          </p>
          <p>
            In both case, you can choose what{" "}
            <code>--provider [openrouter|openai|anthropic|ollama|...]</code> and
            the model <code>--model [gpt-4|claude-3.5|deepseek|...]</code> you
            wish to have an interaction with.
          </p>
          <p>
            Some of us have... taste, so you can always specify them as a{" "}
            <code>--system "please answer only in latin, I am Rex"</code>
          </p>
          <h3 className="pb-2 pt-4 text-xl font-bold">
            Once you are a regular, create an agent !
          </h3>
          <p>
            With time, you refine what you want, or you want things to go
            quicker, or, maybe you just cannot get enough,
          </p>
          <p>
            Whatever the case, it is time for you to{" "}
            <code>ai agent create a-fancy-agent</code>. It will then live in your
            $HOME dotfiles, so you can shape it as you desire, make it do
            whatever you wish, and no one has to know<span className="text-xl font-extrabold">
              .
            </span>
          </p>
          <p></p>
        </div>
      </div>
    </main>
  );
}
