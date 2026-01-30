# AI-Gents Architecture

This document describes the architecture and design patterns used in AI-Gents.

## Table of Contents

1. [Overview](#overview)
2. [Modular Library System](#modular-library-system)
3. [Provider Plugin System](#provider-plugin-system)
4. [Command Structure](#command-structure)
5. [Data Flow](#data-flow)
6. [Error Handling](#error-handling)
7. [Performance Optimizations](#performance-optimizations)
8. [Security Model](#security-model)

## Overview

AI-Gents follows a modular, plugin-based architecture designed for maintainability, extensibility, and performance. The codebase is organized into distinct layers:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI Commands                           │
│  (ai, ask, chat, agent, race)                              │
├─────────────────────────────────────────────────────────────┤
│                   parseArger Parsing                        │
│  (Argument parsing, validation, help generation)           │
├─────────────────────────────────────────────────────────────┤
│                    Core Libraries                           │
│  (core, validation, security, api, parallel, errors)       │
├─────────────────────────────────────────────────────────────┤
│                  Provider Plugins                           │
│  (openai, openrouter, anthropic, ollama, etc.)            │
├─────────────────────────────────────────────────────────────┤
│                   External Services                         │
│  (LLM APIs, Local models)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Modular Library System

All shared functionality is organized into libraries in `src/bash/lib/`:

### Core Library (`core`)

**Purpose**: Common utilities, caching, and lazy loading

**Key Functions**:
- `log()` - Logging with levels (-3 to 3)
- `cache_set/get/has/clear()` - Simple key-value caching
- `lazy_load()` - TTL-based lazy loading wrapper
- `get_agent_file()` - Agent file path resolution
- `parse_command()` - Safe command parsing

**Usage**:
```bash
source "$_SCRIPT_DIR/lib/core"

# Caching
cache_set "my_key" "my_value"
value=$(cache_get "my_key")

# Lazy loading with 5min TTL
result=$(lazy_load "expensive_op" my_function 300)
```

### Validation Library (`validation`)

**Purpose**: Input validation for LLM parameters

**Key Functions**:
- `validate_temperature()` - Range 0-2
- `validate_top_p()` - Range 0-1
- `validate_max_tokens()` - Positive integers
- `validate_frequency_penalty()` - Range -2 to 2
- `validate_seed()` - Non-negative integers
- `validate_provider()` - Against available plugins

**Usage**:
```bash
source "$_SCRIPT_DIR/lib/validation"

if ! validate_temperature "$temp"; then
    die "Invalid temperature" $E_VALIDATION_ERROR
fi

# Validate all LLM parameters
validate_all_llm_params || die "Validation failed"
```

### Security Library (`security`)

**Purpose**: Command blacklist and credential handling

**Key Functions**:
- `load_command_blacklist()` - Load from config file
- `is_command_blacklisted()` - Check command safety
- `filter_command()` - Filter through blacklist
- `extract_prompt_commands()` - Extract commands from prompts
- `get_provider_credential()` - Read API keys

**Usage**:
```bash
source "$_SCRIPT_DIR/lib/security"

# Initialize (empty by default)
load_command_blacklist

# Check if command is safe
if is_command_blacklisted "$cmd"; then
    log "Command blocked" -1
fi
```

### API Library (`api`)

**Purpose**: HTTP client with connection pooling

**Key Functions**:
- `api_init_pool()` - Initialize connection pool
- `api_curl_cmd()` - Build curl command with pooling
- `api_request()` - Make request with retry logic
- `api_request_stream()` - Streaming request
- `api_request_stream_optimized()` - 60fps batching

**Usage**:
```bash
source "$_SCRIPT_DIR/lib/api"

# Initialize pool
api_init_pool

# Make request
response=$(api_request "$endpoint" "$payload_file" "$api_key")

# Stream with optimization
api_request_stream_optimized "$endpoint" "$payload" "$api_key" output_callback
```

### Parallel Library (`parallel`)

**Purpose**: Semaphore-based concurrent execution

**Key Functions**:
- `parallel_init()` - Initialize semaphore system
- `parallel_acquire/release()` - Slot management
- `parallel_exec()` - Execute in background
- `parallel_map()` - Process array in parallel
- `parallel_wait()` - Wait for completion

**Usage**:
```bash
source "$_SCRIPT_DIR/lib/parallel"

# Initialize with max 4 concurrent jobs
parallel_init 4

# Execute in parallel
parallel_exec my_callback "$result_file" "${args[@]}"

# Wait for all
parallel_wait
```

### Errors Library (`errors`)

**Purpose**: Standardized error handling

**Key Functions**:
- `die()` - Exit with message and code
- `try()` - Try/catch wrapper
- `require_cmd()` - Check dependencies
- `assert()` - Condition validation

**Exit Codes**:
```bash
E_SUCCESS=0
E_GENERIC=1
E_INVALID_ARGS=2
E_MISSING_DEPENDENCY=3
E_CONFIG_ERROR=4
E_NETWORK_ERROR=5
E_API_ERROR=6
E_VALIDATION_ERROR=7
E_SECURITY_ERROR=8
E_FILE_ERROR=9
E_INTERRUPTED=130
```

## Provider Plugin System

Providers are dynamically loaded plugins that standardize interaction with different LLM services.

### Base Interface (`providers/_base`)

All providers must implement:

```bash
# Metadata
PROVIDER_NAME=""
PROVIDER_URL=""
PROVIDER_DEFAULT_MODEL=""
PROVIDER_API_KEY_ENV=""

# Core functions
provider_get_name()
provider_get_url()
provider_get_default_model()
provider_get_credential_env()
provider_get_chat_endpoint()
provider_build_payload()
provider_parse_stream_chunk()
provider_parse_response()
provider_get_headers()
```

### Loader (`providers/_loader`)

Dynamic discovery and loading:

```bash
provider_discover()      # Scan providers/ directory
provider_is_registered() # Check if provider exists
provider_load()          # Source provider file
provider_list_available()# Get all provider names
```

### Creating a Provider

1. Create file in `src/bash/lib/providers/myprovider`
2. Source base interface
3. Override required functions
4. Set metadata variables
5. Make executable

Example:
```bash
#!/bin/bash
source "${_SCRIPT_DIR}/lib/providers/_base"

PROVIDER_NAME="myprovider"
PROVIDER_URL="https://api.myprovider.com/v1"
PROVIDER_DEFAULT_MODEL="model-1"
PROVIDER_API_KEY_ENV="AI_MYPROVIDER_API_KEY"

provider_get_url() {
    echo "${AI_MYPROVIDER_HOST:-https://api.myprovider.com}/v1"
}

# Override other functions as needed
```

## Command Structure

### Main Entry (`ai`)

Dispatches to subcommands based on arguments:
```bash
ai ask "question"      # -> src/bash/ask
ai chat                # -> src/bash/chat
ai agent create ...    # -> src/bash/agent -> src/bash/_agent/create
```

### Command Pattern

Each command follows this structure:

```bash
#!/bin/bash

# @parseArger-begin
# Generated argument parsing
# @parseArger-end

# Source libraries
source "$_SCRIPT_DIR/lib/validation"
source "$_SCRIPT_DIR/lib/security"
source "$_SCRIPT_DIR/lib/core"

# Initialize
load_command_blacklist
validate_all_llm_params

# Command logic
# ...
```

## Data Flow

### Single Query (ask)

```
User Input
    ↓
Argument Parsing (parseArger)
    ↓
Parameter Validation
    ↓
Command Extraction (#!/command;)
    ↓
Blacklist Filtering
    ↓
Provider Selection
    ↓
Payload Building
    ↓
API Request (with pooling)
    ↓
Response Parsing
    ↓
Output
```

### Interactive Chat (chat)

```
Initialize
    ↓
rlwrap Input Loop
    ↓
Build Conversation
    ↓
Streaming Request
    ↓
Real-time Output (60fps)
    ↓
Save to History
    ↓
Repeat
```

### Multi-Model Race

```
Parse Models List
    ↓
Initialize Parallel Pool
    ↓
Execute All Queries (parallel)
    ↓
Collect Results
    ↓
Display Comparison
```

## Error Handling

### Strategy

1. **Validation at entry**: Check all inputs early
2. **Graceful degradation**: Fall back to defaults when possible
3. **Informative messages**: Use standardized exit codes
4. **Cleanup on error**: Always clean up temp files

### Pattern

```bash
# Validate inputs early
if ! validate_temperature "$temp"; then
    die "Invalid temperature: $temp" $E_VALIDATION_ERROR
fi

# Check dependencies
require_cmds jq yq curl

# Try with fallback
try "risky_operation" handle_error || fallback_operation

# Cleanup
cleanup() {
    rm -f "$temp_file"
}
trap cleanup EXIT
```

## Performance Optimizations

### Connection Pooling

- Cookie jar for HTTP keep-alive
- 120s keepalive time
- HTTP/1.1 for compatibility
- Connection reuse across requests

### Streaming Optimization

- 16ms batching (60fps target)
- Buffer accumulation
- jq-based parsing (not awk)
- Minimal terminal updates

### Lazy Loading

- TTL-based caching
- Agent configs cached 5 minutes
- Provider configs persist
- Automatic expiration cleanup

### Parallel Processing

- Semaphore-based concurrency
- Configurable max jobs (default 4)
- Atomic slot acquisition
- Background job management

## Security Model

### Philosophy

**"Power++ users control their own security"**

- Empty blacklist by default
- User configures their own restrictions
- Simple, transparent security model
- No hand-holding, user responsibility

### Layers

1. **Input Validation**: Reject invalid parameters
2. **Command Blacklist**: Filter dangerous commands
3. **YAML Safety**: Use `yq --arg`, no interpolation
4. **Credential Isolation**: Separate credential files

### Blacklist Configuration

Users create `~/.config/ai-gents/command-blacklist`:

```bash
# Dangerous patterns
rm[[:space:]]+-rf[[:space:]]+/
mkfs\.
dd[[:space:]]+if=.*of=/dev
```

Patterns are bash regex. Commands matching any pattern are blocked.

## Extension Points

### Adding a Library

1. Create file in `src/bash/lib/`
2. Follow naming conventions
3. Document public API
4. Add tests

### Adding a Provider

1. Create provider file
2. Implement base interface
3. Make executable
4. Test with all commands

### Adding a Command

1. Generate with parseArger
2. Source required libraries
3. Follow existing patterns
4. Add integration tests

## Best Practices

1. **Always validate inputs** before using
2. **Use libraries** instead of duplicating code
3. **Follow naming conventions** (see CODING_STANDARDS)
4. **Handle errors** with appropriate exit codes
5. **Clean up** temp files and resources
6. **Test thoroughly** with BATS suite
7. **Document** public APIs and behaviors

## Future Considerations

- MCP server integration
- More provider plugins
- Advanced caching strategies
- Plugin marketplace
- Configuration UI
