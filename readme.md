# AI-Gents

A sophisticated bash-based AI chat interface supporting multiple LLM providers with agents, streaming, and parallel processing.

## Overview

AI-Gents provides a powerful terminal interface for interacting with various LLM providers (OpenAI, Anthropic, OpenRouter, Ollama, LMStudio, DeepSeek, Moonshot). Features include:

- **Multiple LLM Providers** - Plugin-based architecture supporting 7+ providers
- **Agent System** - Create and manage custom AI agents with YAML configuration
- **Streaming Support** - Real-time responses with 60fps optimization
- **Command Execution** - Execute bash commands within prompts (`#!/command;`)
- **Task System** - Predefined agent tasks for common operations
- **Connection Pooling** - HTTP keep-alive for improved performance
- **Security** - Command blacklist system (user-configurable)
- **Parallel Processing** - Multi-model racing and concurrent operations

## Quick Start

```bash
# Install AI-Gents
./utils/install

# Ask a question
ai ask "What is the capital of France?"

# Start a chat
ai chat "Hello, let's discuss bash scripting"

# Create an agent
ai agent create MyAgent \
  --prompt "You are a helpful coding assistant" \
  --provider openai \
  --model gpt-4o-mini

# Chat with your agent
ai agent chat MyAgent "How do I write a bash function?"
```

## Architecture

AI-Gents uses a modular architecture with:

- **parseArger-generated CLI** - Standardized argument parsing
- **Provider Plugin System** - Dynamic loading of LLM providers
- **Modular Libraries** - Core, validation, security, API, and parallel processing
- **BATS Test Suite** - Comprehensive testing framework

### Project Structure

```
ai-gents/
├── ai                          # Main entry point
├── src/bash/
│   ├── ask                     # Single query command
│   ├── chat                    # Interactive chat command
│   ├── agent                   # Agent command dispatcher
│   ├── race                    # Multi-model racing
│   ├── lib/                    # Modular library system
│   │   ├── core               # Logging, caching, lazy loading
│   │   ├── validation         # Input validation functions
│   │   ├── security           # Command blacklist system
│   │   ├── api                # HTTP client with connection pooling
│   │   ├── parallel           # Parallel processing utilities
│   │   ├── errors             # Error handling with exit codes
│   │   └── providers/         # Provider plugins
│   │       ├── _base          # Base provider interface
│   │       ├── _loader        # Dynamic provider loader
│   │       ├── openrouter     # OpenRouter provider
│   │       ├── openai         # OpenAI provider
│   │       ├── anthropic      # Claude provider
│   │       ├── ollama         # Ollama provider
│   │       ├── lmstudio       # LM Studio provider
│   │       ├── deepseek       # DeepSeek provider
│   │       └── moonshot       # Moonshot provider
│   └── _agent/                # Agent subcommands
│       ├── ask
│       ├── chat
│       ├── create
│       └── list
├── tests/                     # BATS test suite
│   ├── unit/                 # Unit tests
│   ├── security/             # Security tests
│   └── integration/          # Integration tests
└── docs/                     # Documentation
    ├── ARCHITECTURE.md
    ├── CODING_STANDARDS
    └── SECURITY.md
```

## Commands

### `ai ask` - Single Query

Ask a one-time question to an AI:

```bash
ai ask "Explain quantum computing"
ai ask "Write a python script" --provider openai --model gpt-4o
ai ask "Analyze this" --stream  # Stream response
```

Options: `--provider`, `--model`, `--temperature`, `--max_tokens`, `--stream`, etc.

### `ai chat` - Interactive Chat

Start an interactive conversation:

```bash
ai chat "Let's discuss architecture"
ai chat --title "Project Planning" --log
```

Features: Chat history, customizable user/AI names, markdown logging

### `ai agent` - Agent Management

Create and manage AI agents:

```bash
# Create agent
ai agent create MyAgent --prompt "You are an expert" --provider openai

# Chat with agent
ai agent chat MyAgent "Hello"

# Ask agent
ai agent ask MyAgent "Quick question"

# List agents
ai agent list
```

### Command Execution in Prompts

Execute bash commands within prompts:

```bash
You > Analyze these files: #!/ls -la; what do you see?
```

The command output is inserted into the prompt before being sent to the AI.

**Security Note**: Commands are filtered through a user-configurable blacklist (empty by default). Create `~/.config/ai-gents/command-blacklist` to block dangerous commands.

### Agent Tasks

Agents can have predefined tasks in their YAML config:

```yaml
# ~/.config/ai-gents/agents/myagent.yml
tasks:
  summarize:
    description: "Summarize content"
    prompt: "Provide a concise summary of the following:"
```

Usage:
```bash
You > #/task summarize; analyze this code
```

## Providers

Supported LLM providers:

| Provider | Default Model | Local/Cloud | Notes |
|----------|--------------|-------------|-------|
| openrouter | meta-llama/llama-3.2-1b-instruct:free | Cloud | Multi-provider aggregator |
| openai | gpt-4o-mini | Cloud | Full feature support |
| anthropic | claude-3-5-haiku | Cloud | Claude models |
| ollama | llama-3.2-1b-instruct | Local | Run models locally |
| lmstudio | llama-3.2-1b-instruct | Local | LM Studio integration |
| deepseek | deepseek-v3 | Cloud | DeepSeek API |
| moonshot | moonshot-v1-8k | Cloud | Think tag support |

### Provider Configuration

Set API keys via environment variables or files:

```bash
# Environment variable
export AI_OPENAI_API_KEY="your-key"

# Or file
mkdir -p ~/.config/ai-gents/credentials
echo "your-key" > ~/.config/ai-gents/credentials/openai

# Custom host (optional)
export AI_OPENAI_HOST="api.openai.com"
```

### Provider Plugin Development

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for creating custom providers.

## Configuration

### Global Config

Create `~/.config/ai-gents/config`:

```bash
AI_DEFAULT_PROVIDER=openai
AI_OPENAI_MODEL=gpt-4o
```

### Agent Configuration

Agent YAML files in `~/.config/ai-gents/agents/`:

```yaml
name: myagent
description: "My custom agent"
system:
  prompt: "You are a helpful assistant"
model:
  provider: openai
  name: gpt-4o-mini
  temperature: 0.7
tasks:
  example_task:
    description: "Example task"
    prompt: "Additional instructions"
```

### Security Configuration

Create `~/.config/ai-gents/command-blacklist`:

```bash
# Block dangerous commands
rm[[:space:]]+-rf[[:space:]]+/
mkfs\.
dd[[:space:]]+if=.*of=/dev
.*[[:space:]]>[[:space:]]+/dev
```

Patterns are bash regex. Empty by default - users configure their own security.

## Testing

Run the BATS test suite:

```bash
# Install BATS
brew install bats-core  # macOS
# or: sudo apt-get install bats  # Debian/Ubuntu

# Run all tests
bats tests/

# Run specific test file
bats tests/unit/validation.bats
bats tests/security/blacklist.bats
```

See [tests/README.md](tests/README.md) for details.

## Development

### Requirements

- Bash 4.3+
- jq (JSON processing)
- yq (YAML processing)
- curl
- bc (calculator)

### Code Standards

See [docs/CODING_STANDARDS](docs/CODING_STANDARDS) for naming conventions and standards.

### Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## Performance

- **Connection Pooling**: HTTP keep-alive for reduced latency
- **Streaming Optimization**: 16ms batching targeting 60fps
- **Lazy Loading**: TTL-based caching for agents and providers
- **Parallel Processing**: Semaphore-based concurrency for multi-model racing

## Security

- Command blacklist system (user-configurable, empty by default)
- Input validation for all LLM parameters
- YAML safety using `yq --arg` (no string interpolation)
- Standardized error handling with exit codes

See [docs/SECURITY.md](docs/SECURITY.md) for security details.

## License

[Your License Here]

## Contributing

[Contributing Guidelines]

## Acknowledgments

- Built with [parseArger](https://github.com/AnimaTheSpace/parseArger) for CLI generation
- Inspired by the need for a simple, powerful terminal AI interface
