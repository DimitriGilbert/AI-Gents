"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Search, Terminal, FileText, Settings, ArrowRight, Copy, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { CliForm } from "~/components/cli-form";
import { toast } from "sonner";
import { WindowFrame } from "~/components/ui/window-frame";

type CommandParameter = {
  name: string;
  required: boolean;
  type: string;
  description: string;
};

type CommandType = {
  name: string;
  description: string;
  usage: string;
  parameters: CommandParameter[];
};

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
      { name: "prompt", required: true, type: "string", description: "Content to ask" },
      { name: "--api", required: false, type: "string", description: "API endpoint" },
      { name: "--api-key", required: false, type: "string", description: "API key" },
      { name: "--model", required: false, type: "string", description: "Model name" },
      { name: "--system", required: false, type: "string", description: "System prompt" },
      { name: "--conversation", required: false, type: "string", description: "Chat history to be continued" },
      { name: "--provider", required: false, type: "string", description: "LLM provider" },
      { name: "--tools", required: false, type: "string", description: "Tools param for http request" },
      { name: "--tool_choice", required: false, type: "string", description: "tool_choice param for http request" },
      { name: "--max_tokens", required: false, type: "string", description: "max_tokens param for http request" },
      { name: "--temperature", required: false, type: "string", description: "temperature param for http request" },
      { name: "--top_p", required: false, type: "string", description: "top_p param for http request" },
      { name: "--stop", required: false, type: "string", description: "stop param for http request" },
      { name: "--frequency_penalty", required: false, type: "string", description: "frequency_penalty param for http request" },
      { name: "--presence_penalty", required: false, type: "string", description: "presence_penalty param for http request" },
      { name: "--seed", required: false, type: "string", description: "seed param for http request" },
      { name: "--logit_bias", required: false, type: "string", description: "logit_bias param for http request" },
      { name: "--logprobs", required: false, type: "string", description: "logprobs param for http request" },
      { name: "--top_logprobs", required: false, type: "string", description: "top_logprobs param for http request" },
      { name: "--response_format", required: false, type: "string", description: "response_format param for http request" },
      { name: "--structured_outputs", required: false, type: "string", description: "structured_outputs param for http request" },
      { name: "--log", required: false, type: "string", description: "log file" },
      { name: "--stream", required: false, type: "string", description: "stream to stdout" },
      { name: "--no-stream", required: false, type: "string", description: "do not stream to stdout" },
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
	--log <log>: log file for chat
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
      { name: "prompt", required: true, type: "string", description: "Content to ask" },
      { name: "--api", required: false, type: "string", description: "API endpoint" },
      { name: "--api-key", required: false, type: "string", description: "API key" },
      { name: "--model", required: false, type: "string", description: "Model name" },
      { name: "--system", required: false, type: "string", description: "System prompt" },
      { name: "--conversation", required: false, type: "string", description: "Chat history to be continued" },
      { name: "--provider", required: false, type: "string", description: "LLM provider" },
      { name: "--user", required: false, type: "string", description: "username" },
      { name: "--ai-name", required: false, type: "string", description: "AI name" },
      { name: "--title", required: false, type: "string", description: "chat title, force log" },
      { name: "--log", required: false, type: "string", description: "log file for chat" },
      { name: "--tools", required: false, type: "string", description: "tools param for http request" },
      { name: "--tool_choice", required: false, type: "string", description: "tool_choice param for http request" },
      { name: "--max_tokens", required: false, type: "string", description: "max_tokens param for http request" },
      { name: "--temperature", required: false, type: "string", description: "temperature param for http request" },
      { name: "--top_p", required: false, type: "string", description: "top_p param for http request" },
      { name: "--stop", required: false, type: "string", description: "stop param for http request" },
      { name: "--frequency_penalty", required: false, type: "string", description: "frequency_penalty param for http request" },
      { name: "--presence_penalty", required: false, type: "string", description: "presence_penalty param for http request" },
      { name: "--seed", required: false, type: "string", description: "seed param for http request" },
      { name: "--logit_bias", required: false, type: "string", description: "logit_bias param for http request" },
      { name: "--logprobs", required: false, type: "string", description: "logprobs param for http request" },
      { name: "--top_logprobs", required: false, type: "string", description: "top_logprobs param for http request" },
      { name: "--response_format", required: false, type: "string", description: "response_format param for http request" },
      { name: "--structured_outputs", required: false, type: "string", description: "structured_outputs param for http request" },
    ],
  },
  "ai-race": {
    name: "ai race",
    description: "Race several models, then judge and combine outputs",
    usage: `Race several models, then judge and combine outputs:
	prompt: your prompt
	-m, --model <model>: provider:model-id format, repeatable
	-j, --judge-model <judge-model>: provider:model-id, model used to judge result, forces --judge, repeatable
	--combine <combine>: provider:model-id, model used to combine responses
	--log-file <log-file>: save everything to log
	--judge|--no-judge: judge race result
	--judge-individual|--no-judge-individual: judge each response on its own
	--judge-together|--no-judge-together: judge all response together, on by default (use --no-judge-together to turn it off)
	--parallel|--sequential: execute task in parallel when  possible, on by default (use --sequential to turn it off)
	--combine-with-individual-judgement|--no-combine-with-individual-judgement: add individual judgement to combining prompt
		aliases: --comb-indiv, --combine-individual,
	--combine-with-comparative-judgement|--no-combine-with-comparative-judgement: add comparative judgement to combine prompt
		aliases: --comb-comp, --combine-comparative,`,
    parameters: [
      { name: "prompt", required: true, type: "string", description: "your prompt" },
      { name: "-m, --model", required: false, type: "string", description: "provider:model-id format, repeatable" },
      { name: "-j, --judge-model", required: false, type: "string", description: "provider:model-id, model used to judge result, forces --judge, repeatable" },
      { name: "--combine", required: false, type: "string", description: "provider:model-id, model used to combine responses" },
      { name: "--log-file", required: false, type: "string", description: "save everything to log" },
      { name: "--judge", required: false, type: "string", description: "judge race result" },
      { name: "--no-judge", required: false, type: "string", description: "do not judge race result" },
      { name: "--judge-individual", required: false, type: "string", description: "judge each response on its own" },
      { name: "--no-judge-individual", required: false, type: "string", description: "do not judge each response on its own" },
      { name: "--judge-together", required: false, type: "string", description: "judge all response together, on by default (use --no-judge-together to turn it off)" },
      { name: "--no-judge-together", required: false, type: "string", description: "do not judge all response together" },
      { name: "--parallel", required: false, type: "string", description: "execute task in parallel when  possible, on by default (use --sequential to turn it off)" },
      { name: "--sequential", required: false, type: "string", description: "execute task sequentially" },
      { name: "--combine-with-individual-judgement", required: false, type: "string", description: "add individual judgement to combining prompt" },
      { name: "--no-combine-with-individual-judgement", required: false, type: "string", description: "do not add individual judgement to combining prompt" },
      { name: "--combine-with-comparative-judgement", required: false, type: "string", description: "add comparative judgement to combine prompt" },
      { name: "--no-combine-with-comparative-judgement", required: false, type: "string", description: "do not add comparative judgement to combine prompt" },
    ],
  },
  "ai-agent": {
    name: "ai agent",
    description: "work with an AI agent",
    usage: "work with an AI agent:\n\ttarget: what to do [one of 'ask' 'chat' 'create' 'list']",
    parameters: [
      { name: "target", required: true, type: "string", description: "what to do [one of 'ask' 'chat' 'create' 'list']" },
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
      { name: "agent", required: true, type: "string", description: "existing agent name, agent file path or url" },
      { name: "prompt", required: true, type: "string", description: "what to ask" },
      { name: "--api", required: false, type: "string", description: "api url" },
      { name: "--api-key", required: false, type: "string", description: "api key" },
      { name: "--model", required: false, type: "string", description: "model name" },
      { name: "--system", required: false, type: "string", description: "system prompt" },
      { name: "--conversation", required: false, type: "string", description: "chat history to be continued" },
      { name: "--provider", required: false, type: "string", description: "LLM provider" },
      { name: "--log", required: false, type: "string", description: "log file" },
      { name: "--stream", required: false, type: "string", description: "stream to stdout" },
      { name: "--no-stream", required: false, type: "string", description: "do not stream to stdout" },
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
      { name: "agent", required: true, type: "string", description: "agent name, file path or url" },
      { name: "prompt", required: true, type: "string", description: "what to ask" },
      { name: "--api", required: false, type: "string", description: "api url" },
      { name: "--api-key", required: false, type: "string", description: "api key" },
      { name: "--model", required: false, type: "string", description: "model name" },
      { name: "--system", required: false, type: "string", description: "system prompt" },
      { name: "--conversation", required: false, type: "string", description: "chat history to be continued" },
      { name: "--provider", required: false, type: "string", description: "LLM provider" },
      { name: "--user", required: false, type: "string", description: "username" },
      { name: "--ai-name", required: false, type: "string", description: "AI name" },
      { name: "--title", required: false, type: "string", description: "chat title, force log" },
      { name: "--log", required: false, type: "string", description: "log file" },
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
      { name: "name", required: true, type: "string", description: "agent name" },
      { name: "--prompt", required: false, type: "string", description: "agent system prompt" },
      { name: "--provider", required: false, type: "string", description: "llm provider" },
      { name: "--model", required: false, type: "string", description: "llm model" },
      { name: "--temperature", required: false, type: "string", description: "temperature" },
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

  const activeCommandData = activeCommand ? commands[activeCommand] : null;

  const headingColor = isXP ? "#1A1A1A" : "#3C2F2F";
  const accentColor = isXP ? "#245EDC" : "#DD4814";
  const secondaryColor = isXP ? "#0033CC" : "#772953";
  const bodyTextColor = isXP ? "#333333" : "#3C2F2F";

  return (
    <main className="min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-[1600px]">
        {/* Floating Search Bar - No Window Frame */}
        <div className="mb-8 flex items-center gap-4 px-6 py-4 rounded-xl"
             style={{
               background: isXP
                 ? "linear-gradient(to bottom, #FFFFFF 0%, #F5F4F0 100%)"
                 : "linear-gradient(to bottom, #F5F1E8 0%, #EDE5DA 100%)",
               border: `2px solid ${isXP ? "#7A8A9A" : "#3C2F2F"}`,
             }}>
          <Search className="h-6 w-6 shrink-0 opacity-60" style={{ color: bodyTextColor }} />
          <input
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-12 flex-1 rounded-lg px-4 os-body-text outline-none"
            style={{
              color: bodyTextColor,
              background: isXP ? "#FFFFFF" : "transparent",
            }}
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid">
          {/* Commands - Takes varied space */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="mb-4 flex items-center gap-3 px-5 py-3 rounded-xl"
                 style={{
                   background: isXP
                     ? "linear-gradient(to bottom, #3D95FF 0%, #245EDC 100%)"
                     : "linear-gradient(to bottom, #DD4814 0%, #772953 100%)",
                 }}>
              <Terminal className="h-6 w-6 text-white" />
              <h3 className="os-heading text-white font-semibold">Commands</h3>
            </div>

            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center os-body-text rounded-xl"
                   style={{ color: bodyTextColor }}>
                No commands found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCommands.map(([key, cmd]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCommand(key)}
                    className="w-full text-left transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      borderRadius: "12px",
                      padding: "1.25rem",
                      background:
                        activeCommand === key
                          ? isXP
                            ? "#E8F0FF"
                            : "#FFE8E8"
                          : isXP
                          ? "#FFFFFF"
                          : "#F5F1E8",
                      border: `2px solid ${activeCommand === key ? accentColor : (isXP ? "#A0A0A0" : "#C0B8A8")}`,
                      boxShadow: activeCommand === key
                        ? `0 4px 12px ${isXP ? "rgba(36, 149, 255, 0.4)" : "rgba(221, 72, 20, 0.4)"}`
                        : "none",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="os-subheading font-semibold mb-1" style={{ color: headingColor }}>
                          {cmd.name}
                        </h3>
                        <p className="os-body-text leading-relaxed" style={{ color: isXP ? "#666666" : "#6A5A5A" }}>
                          {cmd.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 mt-1"
                                   style={{ color: activeCommand === key ? accentColor : (isXP ? "#999999" : "#9A8A8A") }} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Command Details - Overlapping layout */}
          {activeCommandData && (
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <WindowFrame
                title={activeCommandData.name}
                className="window-min-h-xl cascade-in cascade-delay-2 offset-right z-layer-2"
              >
                <div className="window-content-spacious">
                  {/* Command Summary */}
                  <div className="mb-8 p-6 rounded-xl"
                       style={{
                         background: isXP ? "#F5F4F0" : "#EDE5DA",
                         border: `2px solid ${isXP ? "#D0C8B8" : "#C0B8A8"}`,
                       }}>
                    <p className="os-body-text text-lg leading-relaxed" style={{ color: isXP ? "#333333" : "#3C2F2F" }}>
                      {activeCommandData.description}
                    </p>
                    <div className="mt-5 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          const cmd = activeCommandData.name;
                          const firstRequiredParam = activeCommandData.parameters.find(p => p.required);
                          const commandToCopy = firstRequiredParam 
                            ? `${cmd} <${firstRequiredParam.name}>`
                            : cmd;
                          navigator.clipboard.writeText(commandToCopy).then(() => {
                            toast.success("Command copied to clipboard", { duration: 1000 });
                          }).catch(() => {
                            toast.error("Failed to copy command");
                          });
                        }}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                        style={{
                           background: isXP
                             ? "linear-gradient(to bottom, #4A9AFF 0%, #3080FF 50%, #2068E0 51%, #1050C0 100%)"
                             : "linear-gradient(to bottom, #FFCCA5 0%, #F5A570 50%, #E88950 51%, #DD7038 100%)",
                           color: "white",
                           fontWeight: "600",
                           cursor: "pointer",
                        }}
                      >
                        <Terminal className="h-5 w-5" />
                        <span className="os-body-text">Quick Start</span>
                      </button>
                      <span className="os-body-text" style={{ color: isXP ? "#666666" : "#6A5A5A" }}>
                        {activeCommandData.parameters.length} parameters
                      </span>
                    </div>
                  </div>

                  {/* Accordion */}
                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="parameters">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-black/5"
                             style={{
                               background: isXP ? "#E8F0FF" : "#FFE8E8",
                               border: `1px solid ${isXP ? "#3D95FF" : "#DD4814"}`,
                             }}>
                          <Settings className="h-6 w-6" style={{ color: accentColor }} />
                          <h3 className="os-heading font-semibold" style={{ color: headingColor }}>
                            Parameters
                          </h3>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-5">
                          {/* Compact Flow Layout - Parameters wrap naturally */}
                          <div className="flex flex-wrap gap-3">
                            {activeCommandData.parameters.map((param) => (
                              <div
                                key={param.name}
                                className="group relative"
                              >
                                {/* Parameter Tag - Compact when closed, expands on hover */}
                                <div
                                  className="relative overflow-hidden rounded-xl transition-all duration-300 ease-out cursor-pointer"
                                  style={{
                                    background: isXP ? "#F5F4F0" : "#EDE5DA",
                                    border: `2px solid ${param.required 
                                      ? (isXP ? "#245EDC" : "#DD4814")
                                      : (isXP ? "#A0A0A0" : "#C0B8A8")}`,
                                    maxWidth: "320px",
                                  }}
                                >
                                  {/* Header Row - Always visible */}
                                  <div className="flex items-center gap-2 px-3 py-2">
                                    <span
                                      className="font-mono text-sm font-bold tracking-tight"
                                      style={{
                                        color: param.required ? (isXP ? "#245EDC" : "#DD4814") : secondaryColor,
                                      }}
                                    >
                                      {param.name}
                                    </span>
                                    {param.required && (
                                      <span
                                        className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                                        style={{
                                          background: isXP ? "#245EDC" : "#DD4814",
                                          color: "white",
                                        }}
                                        title="Required"
                                      >
                                        ✓
                                      </span>
                                    )}
                                    <span
                                      className="ml-auto text-xs font-mono opacity-60"
                                      style={{ color: isXP ? "#666666" : "#6A5A5A" }}
                                    >
                                      {param.type}
                                    </span>
                                  </div>
                                  
                                  {/* Description - Slides down on hover via CSS */}
                                  <div
                                    className="group-hover:max-h-[200px] group-hover:opacity-100 group-hover:pt-2 group-hover:border-t px-3 pb-3 pt-0 border-t-0 transition-all duration-300 max-h-0 opacity-0 overflow-hidden"
                                    style={{
                                      borderColor: isXP ? "#E0D8C8" : "#D8D0C0",
                                    }}
                                  >
                                    <p
                                      className="text-sm leading-snug"
                                      style={{ color: isXP ? "#555555" : "#5A4A4A" }}
                                    >
                                      {param.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Legend */}
                          <div className="mt-4 flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ background: isXP ? "#245EDC" : "#DD4814" }}
                              />
                              <span style={{ color: isXP ? "#666666" : "#6A5A5A" }}>Required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ background: isXP ? "#A0A0A0" : "#C0B8A8" }}
                              />
                              <span style={{ color: isXP ? "#666666" : "#6A5A5A" }}>Optional</span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {activeCommandData.usage && (
                      <AccordionItem value="builder">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-black/5"
                               style={{
                                 background: isXP ? "#E8F0FF" : "#FFE8E8",
                                 border: `1px solid ${isXP ? "#3D95FF" : "#DD4814"}`,
                               }}>
                            <FileText className="h-6 w-6" style={{ color: accentColor }} />
                            <h3 className="os-heading font-semibold" style={{ color: headingColor }}>
                              Command Builder
                            </h3>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-5">
                            <CliForm
                              helpText={activeCommandData.usage}
                              baseCmd={activeCommandData.name}
                              onSubmit={(data, command) => {
                                navigator.clipboard
                                  .writeText(command)
                                  .then(() => {
                                    toast.success("Copied to clipboard", {
                                      duration: 1000,
                                    });
                                  })
                                  .catch(() => {
                                    toast.error("Failed to copy to clipboard");
                                  });
                              }}
                              fieldClassName={isXP ? "bg-[#F5F4F0]" : "bg-[#EDE5DA]"}
                            />
                          </div>
                        </AccordionContent>
                    </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </WindowFrame>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
