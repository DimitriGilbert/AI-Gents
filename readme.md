## AI-gents.

A simple format for AI agents.

```yaml
name: AI-gent
description: "A generic AI agent"

system:
  prompt: "You are AI-gent, a helpful AI assistant that provides clear and concise responses."
```

#### more configuration

```yaml
# Model configuration
model:
  provider: openai | lmstudio | ollama | openrouter | deepseek
  name: <api id of the model to use>

# files
files:
  <file name>: <file path>
	...

# Agent tasks
tasks:
  a_common_task:
    description: "get the agent to execute a common task"
    prompt: "some fancy tasking prompt"
  summary:
    description: "summarize content"
    prompt: "summarize the content given by the user"
```

## AI, in your terminal

I had to test the thing, I write bash.... meh, I'm gonna write meself a bash chat app !

Well, you too can use it (at your own expense !)

### Usage

#### ai

ask or chat with an ai, from your terminal, create and chat with agents too:

```bash
	target: what to do [one of 'agent' 'ask' 'chat' '<your prompt>']
# Usage :
	ai <target>
# Examples :
  # start a chat
  ai "what does 'oulala' mean in french ?"
  # ask something to an ai
  ai ask "why is the sky blue (exept in Britanny) ?"
  # start a chat with an ai
  ai chat "what is the most common weather in Paris ?"
  # create an agent
  ai agent create Maurice --prompt "You are Maurice, a typical unpolite and rude parisian waiter." --provider openai --model gpt-4o-mini
  # ask something to an agent
  ai agent ask Maurice "could i have the Menu ?"
  # start a chat with an agent
  ai agent chat Maurice "how is the baguette going ?"
```

#### ai ask

ask something to an AI:

```bash
	prompt: what to ask
	--api <api>: api url
	--api-key <api-key>: api key
	--model <model>: model name
	--system <system>: system prompt
	--conversation <conversation>: chat history to be continued
	--provider <provider>: LLM provider
	--stream|--no-stream: stream to stdout
# Usage :
	ai ask <prompt> [--api <value>] [--api-key <value>] [--model <value>] [--system <value>] [--conversation <value>] [--provider <value>] [--[no-]stream]
```

#### ai chat

Chat with an AI:

```bash
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
	--log-file <log-file>: log file for the chat
	--log|--no-log: log chat
# Usage :
	ai chat <prompt> [--api <value>] [--api-key <value>] [--model <value>] [--system <value>] [--conversation <value>] [--provider <value>] [--user <value>] [--ai-name <value>] [--title <value>] [--log-file <value>] [--[no-]log]
```

#### ai agent

work with an AI agent:

```bash
	target: what to do
# Usage :
	ai agent <target>
```

#### ai agent ask

ask an AI agent:

```bash
	agent: existing agent name, agent file path or url
	prompt: what to ask
	--api <api>: api url
	--api-key <api-key>: api key
	--model <model>: model name
	--system <system>: system prompt
	--conversation <conversation>: chat history to be continued
	--provider <provider>: LLM provider
	--stream|--no-stream: stream to stdout
# Usage :
	ai agent ask <agent> <prompt> [--api <value>] [--api-key <value>] [--model <value>] [--system <value>] [--conversation <value>] [--provider <value>] [--[no-]stream]
```

#### ai agent chat

chat with an AI agent:

```bash
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
	--log-file <log-file>: log file for the chat
	--log|--no-log: log chat
# Usage :
	ai agent chat <agent> <prompt> [--api <value>] [--api-key <value>] [--model <value>] [--system <value>] [--conversation <value>] [--provider <value>] [--user <value>] [--ai-name <value>] [--title <value>] [--log-file <value>] [--[no-]log]
```

#### ai agent create

create an agent:

```bash
	name: agent name
	--prompt <prompt>: agent system prompt
	--provider <provider>: llm provider
	--model <model>: llm model
	--temperature <temperature>: temperature
# Usage :
	ai agent create <name> [--prompt <value>] [--provider <value>] [--model <value>] [--temperature <value>]
```

#### ai agent list

list existing agent:

```bash
# Usage :
	ai agent list
```

### Execute command in a chat

You can execute a bash command in your chat prompt to do so use `#!/<your command> ["and its argument" --or "even the options" ]`.

This will replace the call with the result of your command.

In this project directory as an example :

```bash
You > could you tell me wich of those files you would need to get more context ?\n#!/tree -I 'node_modules|cache|test_*'

# outputs
could you tell me wich of those files you would need to get more context ?
.
├── agent.yml
├── ai
├── chat
├── generic_agent.yml
├── readme.md
└── src
    └── bash
        ├── _agent
        │   ├── ask
        │   ├── chat
        │   ├── create
        │   └── list
        ├── agent
        ├── ask
        ├── chat
        ├── common
```

### Agent tasks

Agent can come with tasks which are additional system prompt instructions.

using the agent.yml file as an example :

```yaml
tasks:
  fresh_context:
    description: "get the agent to craft a fresh context"
    prompt: |
      Create a detailed and effective system prompt based on the provided conversation history as to continue it.
			...
```

```bash
You > #/task fresh_context list all the modified files;
```
