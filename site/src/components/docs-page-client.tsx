"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Search, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { CliForm } from "~/components/cli-form";
import { toast } from "sonner";
import { WindowFrame, RetroPanel } from "~/components/ui/window-frame";

// Define a type for the command parameters
type CommandParameter = {
  name: string;
  required: boolean;
  type: string;
  description: string;
};

// Define a type for the command object
type CommandType = {
  name: string;
  description: string;
  usage: string;
  parameters: CommandParameter[];
};

// Define a type for the commands object
type CommandsType = Record<string, CommandType>;

const commands: CommandsType = {
  "ai-ask": {
    name: "ai ask",
    description: "Ask something to an AI",
    usage: `ask something to an AI:
	prompt: what to ask
	--api <api>: api url
	--api-key <api-key>: api key
	--model <model>: model name
	--system <system>: system prompt
	--conversation <conversation>: chat history to be continued
	--provider <provider>: LLM provider
	--tools <tools>: tools param for http request
	--tool_choice <tool_choice>: tool_choice param for http request
	--max_tokens <max_tokens>: max_tokens param for http request
	--temperature <temperature>: temperature param for http request
	--top_p <top_p>: top_p param for http request
	--stop <stop>: stop param for http request
	--frequency_penalty <frequency_penalty>: frequency_penalty param for http request
	--presence_penalty <presence_penalty>: presence_penalty param for http request
	--seed <seed>: seed param for http request
	--logit_bias <logit_bias>: logit_bias param for http request
	--logprobs <logprobs>: logprobs param for http request
	--top_logprobs <top_logprobs>: top_logprobs param for http request
	--response_format <response_format>: response_format param for http request
	--structured_outputs <structured_outputs>: structured_outputs param for http request
	--log <log>: log file
	--stream|--no-stream: stream to stdout`,
    parameters: [
      {
        name: "prompt",
        required: true,
        type: "string",
        description: "Content to ask",
      },
      {
        name: "--api",
        required: false,
        type: "string",
        description: "API endpoint",
      },
      {
        name: "--api-key",
        required: false,
        type: "string",
        description: "API key",
      },
      {
        name: "--model",
        required: false,
        type: "string",
        description: "Model name",
      },
      {
        name: "--system",
        required: false,
        type: "string",
        description: "System prompt",
      },
      {
        name: "--conversation",
        required: false,
        type: "string",
        description: "Chat history to be continued",
      },
      {
        name: "--provider",
        required: false,
        type: "string",
        description: "LLM provider",
      },
      {
        name: "--tools",
        required: false,
        type: "string",
        description: "Tools param for http request",
      },
      {
        name: "--tool_choice",
        required: false,
        type: "string",
        description: "tool_choice param for http request",
      },
      {
        name: "--max_tokens",
        required: false,
        type: "string",
        description: "max_tokens param for http request",
      },
      {
        name: "--temperature",
        required: false,
        type: "string",
        description: "temperature param for http request",
      },
      {
        name: "--top_p",
        required: false,
        type: "string",
        description: "top_p param for http request",
      },
      {
        name: "--stop",
        required: false,
        type: "string",
        description: "stop param for http request",
      },
      {
        name: "--frequency_penalty",
        required: false,
        type: "string",
        description: "frequency_penalty param for http request",
      },
      {
        name: "--presence_penalty",
        required: false,
        type: "string",
        description: "presence_penalty param for http request",
      },
      {
        name: "--seed",
        required: false,
        type: "string",
        description: "seed param for http request",
      },
      {
        name: "--logit_bias",
        required: false,
        type: "string",
        description: "logit_bias param for http request",
      },
      {
        name: "--logprobs",
        required: false,
        type: "string",
        description: "logprobs param for http request",
      },
      {
        name: "--top_logprobs",
        required: false,
        type: "string",
        description: "top_logprobs param for http request",
      },
      {
        name: "--response_format",
        required: false,
        type: "string",
        description: "response_format param for http request",
      },
      {
        name: "--structured_outputs",
        required: false,
        type: "string",
        description: "structured_outputs param for http request",
      },
      {
        name: "--log",
        required: false,
        type: "string",
        description: "log file",
      },
      {
        name: "--stream",
        required: false,
        type: "string",
        description: "stream to stdout",
      },
      {
        name: "--no-stream",
        required: false,
        type: "string",
        description: "do not stream to stdout",
      },
    ],
  },
  "ai-chat": {
    name: "ai chat",
    description: "Interactive chat with AI",
    usage: `Chat with an AI:
	prompt: what to ask
	--api <api>: api url
	--api-key <api-key>: api key
	--model <model>: model name
	--system <system>: system prompt
	--conversation <conversation>: chat history to be continued
	--provider <provider>: LLM provider
	--user <user>: username [default: ' didi ']
	--ai-name <ai-name>: AI name [default: ' AI ']
	--title <title>: chat title, force log
	--log <log>: log file for the chat
	--tools <tools>: tools param for http request
	--tool_choice <tool_choice>: tool_choice param for http request
	--max_tokens <max_tokens>: max_tokens param for http request
	--temperature <temperature>: temperature param for http request
	--top_p <top_p>: top_p param for http request
	--stop <stop>: stop param for http request
	--frequency_penalty <frequency_penalty>: frequency_penalty param for http request
	--presence_penalty <presence_penalty>: presence_penalty param for http request
	--seed <seed>: seed param for http request
	--logit_bias <logit_bias>: logit_bias param for http request
	--logprobs <logprobs>: logprobs param for http request
	--top_logprobs <top_logprobs>: top_logprobs param for http request
	--response_format <response_format>: response_format param for http request
	--structured_outputs <structured_outputs>: structured_outputs param for http request`,
    parameters: [
      {
        name: "prompt",
        required: true,
        type: "string",
        description: "Content to ask",
      },
      {
        name: "--api",
        required: false,
        type: "string",
        description: "API endpoint",
      },
      {
        name: "--api-key",
        required: false,
        type: "string",
        description: "API key",
      },
      {
        name: "--model",
        required: false,
        type: "string",
        description: "Model name",
      },
      {
        name: "--system",
        required: false,
        type: "string",
        description: "System prompt",
      },
      {
        name: "--conversation",
        required: false,
        type: "string",
        description: "Chat history to be continued",
      },
      {
        name: "--provider",
        required: false,
        type: "string",
        description: "LLM provider",
      },
      {
        name: "--user",
        required: false,
        type: "string",
        description: "username",
      },
      {
        name: "--ai-name",
        required: false,
        type: "string",
        description: "AI name",
      },
      {
        name: "--title",
        required: false,
        type: "string",
        description: "chat title, force log",
      },
      {
        name: "--log",
        required: false,
        type: "string",
        description: "log file for the chat",
      },
      {
        name: "--tools",
        required: false,
        type: "string",
        description: "tools param for http request",
      },
      {
        name: "--tool_choice",
        required: false,
        type: "string",
        description: "tool_choice param for http request",
      },
      {
        name: "--max_tokens",
        required: false,
        type: "string",
        description: "max_tokens param for http request",
      },
      {
        name: "--temperature",
        required: false,
        type: "string",
        description: "temperature param for http request",
      },
      {
        name: "--top_p",
        required: false,
        type: "string",
        description: "top_p param for http request",
      },
      {
        name: "--stop",
        required: false,
        type: "string",
        description: "stop param for http request",
      },
      {
        name: "--frequency_penalty",
        required: false,
        type: "string",
        description: "frequency_penalty param for http request",
      },
      {
        name: "--presence_penalty",
        required: false,
        type: "string",
        description: "presence_penalty param for http request",
      },
      {
        name: "--seed",
        required: false,
        type: "string",
        description: "seed param for http request",
      },
      {
        name: "--logit_bias",
        required: false,
        type: "string",
        description: "logit_bias param for http request",
      },
      {
        name: "--logprobs",
        required: false,
        type: "string",
        description: "logprobs param for http request",
      },
      {
        name: "--top_logprobs",
        required: false,
        type: "string",
        description: "top_logprobs param for http request",
      },
      {
        name: "--response_format",
        required: false,
        type: "string",
        description: "response_format param for http request",
      },
      {
        name: "--structured_outputs",
        required: false,
        type: "string",
        description: "structured_outputs param for http request",
      },
    ],
  },
  "ai-race": {
    name: "ai race",
    description: "Race several models, then judge and combine the outputs",
    usage: `Race several models, then judge and combine the outputs:
	prompt: your prompt
	-m, --model <model>: provider:model-id format, repeatable
	-j, --judge-model <judge-model>: provider:model-id, model used to judge the result, forces --judge, repeatable
	--combine <combine>: provider:model-id, model used to combine responses
	--log-file <log-file>: save everything to log
	--judge|--no-judge: judge race result
	--judge-individual|--no-judge-individual: judge each response on its own
	--judge-together|--no-judge-together: judge all response together, on by default (use --no-judge-together to turn it off)
	--parallel|--sequential: execute task in parallel when  possible, on by default (use --sequential to turn it off)
	--combine-with-individual-judgement|--no-combine-with-individual-judgement: add individual judgement to the combining prompt
		aliases: --comb-indiv, --combine-individual,
	--combine-with-comparative-judgement|--no-combine-with-comparative-judgement: add comparative judgement to combine prompt
		aliases: --comb-comp, --combine-comparative,`,
    parameters: [
      {
        name: "prompt",
        required: true,
        type: "string",
        description: "your prompt",
      },
      {
        name: "-m, --model",
        required: false,
        type: "string",
        description: "provider:model-id format, repeatable",
      },
      {
        name: "-j, --judge-model",
        required: false,
        type: "string",
        description:
          "provider:model-id, model used to judge the result, forces --judge, repeatable",
      },
      {
        name: "--combine",
        required: false,
        type: "string",
        description: "provider:model-id, model used to combine responses",
      },
      {
        name: "--log-file",
        required: false,
        type: "string",
        description: "save everything to log",
      },
      {
        name: "--judge",
        required: false,
        type: "string",
        description: "judge race result",
      },
      {
        name: "--no-judge",
        required: false,
        type: "string",
        description: "do not judge race result",
      },
      {
        name: "--judge-individual",
        required: false,
        type: "string",
        description: "judge each response on its own",
      },
      {
        name: "--no-judge-individual",
        required: false,
        type: "string",
        description: "do not judge each response on its own",
      },
      {
        name: "--judge-together",
        required: false,
        type: "string",
        description:
          "judge all response together, on by default (use --no-judge-together to turn it off)",
      },
      {
        name: "--no-judge-together",
        required: false,
        type: "string",
        description: "do not judge all response together",
      },
      {
        name: "--parallel",
        required: false,
        type: "string",
        description:
          "execute task in parallel when  possible, on by default (use --sequential to turn it off)",
      },
      {
        name: "--sequential",
        required: false,
        type: "string",
        description: "execute task sequentially",
      },
      {
        name: "--combine-with-individual-judgement",
        required: false,
        type: "string",
        description: "add individual judgement to the combining prompt",
      },
      {
        name: "--no-combine-with-individual-judgement",
        required: false,
        type: "string",
        description: "do not add individual judgement to the combining prompt",
      },
      {
        name: "--combine-with-comparative-judgement",
        required: false,
        type: "string",
        description: "add comparative judgement to combine prompt",
      },
      {
        name: "--no-combine-with-comparative-judgement",
        required: false,
        type: "string",
        description: "do not add comparative judgement to combine prompt",
      },
    ],
  },
  "ai-agent": {
    name: "ai agent",
    description: "work with an AI agent",
    usage: "work with an AI agent:\n\ttarget: what to do [one of 'ask' 'chat' 'create' 'list']",
    parameters: [
      {
        name: "target",
        required: true,
        type: "string",
        description: "what to do [one of 'ask' 'chat' 'create' 'list']",
      },
    ],
  },
  "ai-agent-ask": {
    name: "ai agent ask",
    description: "ask an AI agent",
    usage: `ask an AI agent:
	agent: existing agent name, agent file path or url
	prompt: what to ask
	--api <api>: api url
	--api-key <api-key>: api key
	--model <model>: model name
	--system <system>: system prompt
	--conversation <conversation>: chat history to be continued
	--provider <provider>: LLM provider
	--log <log>: log file
	--stream|--no-stream: stream to stdout`,
    parameters: [
      {
        name: "agent",
        required: true,
        type: "string",
        description: "existing agent name, agent file path or url",
      },
      {
        name: "prompt",
        required: true,
        type: "string",
        description: "what to ask",
      },
      {
        name: "--api",
        required: false,
        type: "string",
        description: "api url",
      },
      {
        name: "--api-key",
        required: false,
        type: "string",
        description: "api key",
      },
      {
        name: "--model",
        required: false,
        type: "string",
        description: "model name",
      },
      {
        name: "--system",
        required: false,
        type: "string",
        description: "system prompt",
      },
      {
        name: "--conversation",
        required: false,
        type: "string",
        description: "chat history to be continued",
      },
      {
        name: "--provider",
        required: false,
        type: "string",
        description: "LLM provider",
      },
      {
        name: "--log",
        required: false,
        type: "string",
        description: "log file",
      },
      {
        name: "--stream",
        required: false,
        type: "string",
        description: "stream to stdout",
      },
      {
        name: "--no-stream",
        required: false,
        type: "string",
        description: "do not stream to stdout",
      },
    ],
  },
  "ai-agent-chat": {
    name: "ai agent chat",
    description: "chat with an AI agent",
    usage: `chat with an AI agent:
	agent: agent name, file path or url
	prompt: what to ask
	--api <api>: api url
	--api-key <api-key>: api key
	--model <model>: model name
	--system <system>: system prompt
	--conversation <conversation>: chat history to be continued
	--provider <provider>: LLM provider
	--user <user>: username [default: ' didi ']
	--ai-name <ai-name>: AI name [default: ' AI ']
	--title <title>: chat title, force log
	--log <log>: log file`,
    parameters: [
      {
        name: "agent",
        required: true,
        type: "string",
        description: "agent name, file path or url",
      },
      {
        name: "prompt",
        required: true,
        type: "string",
        description: "what to ask",
      },
      {
        name: "--api",
        required: false,
        type: "string",
        description: "api url",
      },
      {
        name: "--api-key",
        required: false,
        type: "string",
        description: "api key",
      },
      {
        name: "--model",
        required: false,
        type: "string",
        description: "model name",
      },
      {
        name: "--system",
        required: false,
        type: "string",
        description: "system prompt",
      },
      {
        name: "--conversation",
        required: false,
        type: "string",
        description: "chat history to be continued",
      },
      {
        name: "--provider",
        required: false,
        type: "string",
        description: "LLM provider",
      },
      {
        name: "--user",
        required: false,
        type: "string",
        description: "username",
      },
      {
        name: "--ai-name",
        required: false,
        type: "string",
        description: "AI name",
      },
      {
        name: "--title",
        required: false,
        type: "string",
        description: "chat title, force log",
      },
      {
        name: "--log",
        required: false,
        type: "string",
        description: "log file",
      },
    ],
  },
  "ai-agent-create": {
    name: "ai agent create",
    description: "create an agent",
    usage: `create an agent:
	name: agent name
	--prompt <prompt>: agent system prompt
	--provider <provider>: llm provider
	--model <model>: llm model
	--temperature <temperature>: temperature`,
    parameters: [
      {
        name: "name",
        required: true,
        type: "string",
        description: "agent name",
      },
      {
        name: "--prompt",
        required: false,
        type: "string",
        description: "agent system prompt",
      },
      {
        name: "--provider",
        required: false,
        type: "string",
        description: "llm provider",
      },
      {
        name: "--model",
        required: false,
        type: "string",
        description: "llm model",
      },
      {
        name: "--temperature",
        required: false,
        type: "string",
        description: "temperature",
      },
    ],
  },
  "ai-agent-list": {
    name: "ai agent list",
    description: "list existing agent",
    usage: "list existing agent:",
    parameters: [],
  },
};

export default function DocsPageClient() {
  const { theme } = useTheme();
  const isXP = theme === "xp";
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommands = Object.entries(commands).filter(
    ([key, cmd]) =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const panelBg = isXP ? "bg-[#F5F4F0]" : "bg-[#F5F1E8]";
  const textColor = isXP ? "text-[#333333]" : "text-[#3C2F2F]";
  const accentColor = isXP ? "text-[#245EDC]" : "text-[#DD4814]";

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4">
      <WindowFrame 
        title="Documentation - Command Reference" 
        className="mb-8 w-full max-w-6xl"
        
      >
        <div className={`p-6 ${panelBg}`}>
          <div className="space-y-4 w-full">
            <div 
              className="flex items-center rounded-lg border px-3 py-2"
              style={{
                background: isXP ? '#FFFFFF' : '#F5F1E8',
                borderColor: isXP ? '#7A8A9A' : '#C0B8A8',
              }}
            >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" style={{ color: isXP ? '#666666' : '#5A4A4A' }} />
              <input
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 ${textColor}`}
              />
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-6">
              <div className="space-y-2">
                {filteredCommands.length === 0 ? (
                  <div className={`py-6 text-center text-sm ${isXP ? 'text-gray-500' : 'text-gray-400'}`}>
                    No commands found.
                  </div>
                ) : (
                  filteredCommands.map(([key, cmd]) => (
                    <div
                      key={key}
                      className="overflow-hidden rounded-lg border"
                      style={{
                        background: isXP ? '#FFFFFF' : '#F5F1E8',
                        borderColor: isXP ? '#A0A0A0' : '#C0B8A8',
                      }}
                    >
                      <button
                        onClick={() => setActiveCommand(key)}
                        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-black/5"
                      >
                        <div>
                          <h2 className={`text-xl font-semibold ${textColor}`}>
                            <span className={`mr-2 font-mono ${accentColor}`}>
                              $
                            </span>
                            {cmd.name}
                          </h2>
                          <p className={`mt-1 ${isXP ? 'text-gray-600' : 'text-gray-300'}`} style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
                            {cmd.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5" style={{ color: isXP ? '#666666' : '#9A8A8A' }} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {activeCommand && (
                <div className="hidden lg:block">
                  {(() => {
                    const cmd = commands[activeCommand];
                    if (!cmd) return null;
                    return (
                      <div className="sticky top-12 max-h-[calc(100vh-5rem)] overflow-y-auto">
                        <div 
                          className="space-y-6 overflow-hidden rounded-lg border p-6"
                          style={{
                            background: isXP ? '#FFFFFF' : '#F5F1E8',
                            borderColor: isXP ? '#A0A0A0' : '#C0B8A8',
                          }}
                        >
                          <h2 className={`text-2xl font-bold ${textColor}`}>
                            <span className={`mr-2 font-mono ${accentColor}`}>
                              $
                            </span>
                            {cmd.name}
                          </h2>
                          <p style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
                            {cmd.description}
                          </p>
                          <Accordion type="single" collapsible>
                            <AccordionItem value="parameters">
                              <AccordionTrigger>
                                <h3 className={`text-lg font-semibold ${textColor}`}>
                                  Parameters
                                </h3>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-2">
                                {cmd.parameters.map((param) => (
                                  <div
                                    key={param.name}
                                    className="rounded-md p-3"
                                    style={{
                                      background: isXP ? '#F5F4F0' : '#EDE5DA',
                                    }}
                                  >
                                    <p className={`font-semibold ${textColor}`}>{param.name}</p>
                                    <p className="text-sm" style={{ color: isXP ? '#666666' : '#6A5A5A' }}>
                                      Type: {param.type}
                                      <br />
                                      Required: {param.required ? "Yes" : "No"}
                                      <br />
                                      {param.description}
                                    </p>
                                  </div>
                                ))}
                              </AccordionContent>
                            </AccordionItem>

                            {cmd.usage && (
                              <AccordionItem value="builder">
                                <AccordionTrigger>
                                  <h3 className={`text-lg font-semibold ${textColor}`}>
                                    Command Builder
                                  </h3>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <CliForm
                                    helpText={cmd.usage}
                                    baseCmd={cmd.name}
                                    onSubmit={(data, command) => {
                                      navigator.clipboard
                                        .writeText(command)
                                        .then(() => {
                                          toast.success("Copied to clipboard", {
                                            duration: 1000,
                                          });
                                        })
                                        .catch(() => {
                                          toast.error(
                                            "Failed to copy to clipboard"
                                          );
                                        });
                                    }}
                                    columns={1}
                                    fieldClassName={isXP ? "bg-[#F5F4F0]" : "bg-[#EDE5DA]"}
                                  />
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </WindowFrame>
    </main>
  );
}
