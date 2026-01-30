# AI-Gents Refactoring Plan

## Current Progress

**Status: ✅ COMPLETE - All 6 Weeks Finished**

### ✅ Completed - Week 1 (Foundation & Security)

1. **Created Modular Library Structure** (`src/bash/lib/`)
   - `src/bash/lib/validation` - LLM parameter validators
   - `src/bash/lib/security` - Command blacklist system
   - `src/bash/lib/core` - Logging, caching, lazy loading
   - `src/bash/lib/api` - HTTP client with connection pooling

2. **Security Integration**
   - All commands integrated with validation and security
   - Blacklist filtering for `#!/command;` syntax
   - Shellcheck clean

### ✅ Completed - Week 2 (Provider Plugin System)

1. **Created Provider Plugin System**
   - `src/bash/lib/providers/_base` - Base provider interface
   - `src/bash/lib/providers/_loader` - Dynamic discovery and loading
   - Provider plugins for all supported LLM services:
     - `openrouter` - Priority 1, with think tag support
     - `openai` - Priority 2, with function call support
     - `anthropic` - Claude API support
     - `lmstudio` - Local LLM support
     - `ollama` - Local LLM support
     - `deepseek` - DeepSeek API
     - `moonshot` - Moonshot AI with special think tag handling

### ✅ Completed - Week 3 (Performance Optimization)

1. **Enhanced API Library**
   - HTTP keep-alive with 120s connection persistence
   - HTTP/1.1 force for better compatibility
   - Enhanced headers for connection reuse

2. **Streaming Optimization (60fps target)**
   - `api_request_stream_optimized()` with 16ms batching
   - `stream_buffer_add/flush` for content accumulation
   - Target 60fps output without overwhelming terminal

3. **Lazy Loading Improvements**
   - TTL-based caching with automatic expiration
   - `lazy_load_agent()` - 5-minute cache for agent configs
   - `lazy_load_provider()` - Persistent provider cache
   - `cache_clear_expired()` - Automatic cleanup

4. **Parallel Processing Library**
   - `src/bash/lib/parallel` - Semaphore-based concurrency
   - `parallel_exec()` - Background job execution
   - `parallel_map()` - Array processing in parallel
   - Configurable max concurrent jobs (default 4)

### ✅ Completed - Week 4 (Code Quality)

1. **Error Handling Library** (`src/bash/lib/errors`)
   - Standardized exit codes (E_SUCCESS, E_GENERIC, E_INVALID_ARGS, etc.)
   - Enhanced `die()` function with exit code validation
   - `try/catch` wrapper for error handling
   - `require_cmd()` and `require_cmds()` for dependency checking
   - `assert()` for condition validation
   - Interrupt handler setup (`setup_interrupt_handler`)

2. **YAML Safety Improvements**
   - Updated `src/bash/_agent/create` to use `yq --arg` parameter passing
   - No string interpolation in yq commands (prevents injection)
   - Input validation for agent names and prompts
   - Numeric validation for temperature parameter

3. **Coding Standards Document** (`docs/CODING_STANDARDS`)
   - Variable naming conventions (_arg_*, lowercase, UPPER, _private)
   - Exit code standards
   - File naming conventions (no .sh extensions)
   - Examples of good vs bad practices

### ✅ Completed - Week 5 (Testing)

1. **BATS Testing Framework Setup**
   - Test directory structure (`tests/unit`, `tests/security`, `tests/integration`)
   - `tests/README.md` - Documentation for running and writing tests
   - Test runner configuration and CI examples

2. **Test Helper Library** (`tests/test_helper.bash`)
   - `setup()` and `teardown()` for test isolation
   - `source_lib()` for loading library files
   - Mock creation functions:
     - `create_test_agent()` - Mock agent configs
     - `create_test_credential()` - Mock API keys
     - `create_test_blacklist()` - Mock blacklist files
   - Assertion helpers and utilities

3. **Unit Tests** (`tests/unit/validation.bats`)
   - Temperature validation (range 0-2)
   - Top_p validation (range 0-1)
   - Max_tokens validation (positive integers)
   - Frequency/presence penalty validation (range -2 to 2)
   - Seed validation (non-negative integers)
   - One-of validation
   - YAML safety validation

4. **Security Tests** (`tests/security/blacklist.bats`)
   - Blacklist loading from config
   - Command blacklisting detection
   - Filter command behavior
   - Prompt command extraction
   - Credential handling (env vs file)
   - Complex regex pattern matching

5. **Integration Tests** (`tests/integration/commands.bats`)
   - Parameter validation pipeline
   - Agent creation workflows
   - Provider discovery and loading
   - API library initialization
   - Error handling exit codes
   - Cache system operations
   - Lazy loading behavior
   - Parallel library initialization

### ✅ Completed - Week 6 (Documentation)

1. **Updated README** (`readme.md`)
   - Complete architecture overview
   - Quick start guide
   - Provider plugin system documentation
   - Command reference with examples
   - Security and performance sections
   - Development and testing instructions

2. **Architecture Documentation** (`docs/ARCHITECTURE.md`)
   - System overview and layers
   - Modular library system details
   - Provider plugin system architecture
   - Data flow diagrams
   - Error handling strategy
   - Performance optimization details
   - Security model explanation
   - Extension points for developers

3. **Security Guide** (`docs/SECURITY.md`)
   - Security philosophy and threat model
   - Command blacklist configuration
   - Input validation details
   - YAML safety practices
   - Credential handling best practices
   - Security checklist for users and developers
   - Attack scenarios and defenses

4. **Provider Development Guide** (`docs/PROVIDER_DEVELOPMENT.md`)
   - Step-by-step provider creation
   - Required and optional function overrides
   - Testing procedures
   - Complete examples (simple, full-featured, special features)
   - Troubleshooting section
   - Best practices

---

## Summary

**All 6 Weeks Complete!**

- **Week 1**: Foundation & Security (validation, security, api libs)
- **Week 2**: Provider Plugin System (8 plugins, loader, base interface)
- **Week 3**: Performance (connection pooling, 60fps streaming, lazy loading, parallel)
- **Week 4**: Code Quality (error handling, YAML safety, coding standards)
- **Week 5**: BATS Testing (test framework, unit/security/integration tests)
- **Week 6**: Documentation (README, architecture, security, provider guide)

**Total Changes**: 40+ files, 4000+ lines of new/refactored code

---

## Executive Summary

This document outlines a complete refactoring plan for AI-Gents to improve security, performance, and maintainability while keeping the parseArger-based CLI architecture.

## Core Philosophy

**Keep What Works:**
- ParseArger-generated argument parsing (standardized, maintainable)
- Existing command structure (ask, chat, agent, race, mcp)
- User-controlled security model (power++ users, empty blacklist defaults)
- Simple configuration (.env files, no encryption complexity)

**Improve What Doesn't:**
- Security vulnerabilities (eval, injection risks)
- Code organization (modular lib structure)
- Performance (connection pooling, lazy loading, streaming)
- Maintainability (provider plugins, validation, error handling)

---

## Phase 1: Foundation & Security (Week 1)

### 1.1 Modular Library Structure

Create `src/bash/lib/` directory structure:

```
src/bash/lib/
├── core              # Core utilities (logging, common functions)
├── validation        # Input validation functions  
├── security          # Security functions (blacklist, safe ops)
├── api               # API communication utilities
└── providers/        # Provider plugins (dynamic loading)
    ├── _base         # Base provider interface
    ├── openrouter    # Priority 1
    ├── openai        # Priority 2
    ├── anthropic
    ├── lmstudio
    ├── ollama
    ├── deepseek
    └── moonshot
```

**No `.sh` extensions** - all files are executable bash scripts.

**Migration from `src/bash/common`:**
- Move `get_llm_provider_url()` → `providers/<name>` files
- Move `get_default_model()` → `providers/<name>` files  
- Move `get_provider_credential()` → `src/bash/lib/security`
- Move `get_agent_file()` → `src/bash/lib/core`
- Move task parsing functions → `src/bash/lib/core`
- Keep `common` as thin wrapper during migration, then remove

### 1.2 Remove Unsafe eval() Usage

**Current problematic patterns:**
```bash
# In ai, agent, chat, ask - Lines ~185, ~201
eval "if [ \"\$_one_of${_positional_name}\" != \"\" ];then [[ \"\${_one_of${_positional_name}[*]}\" =~ \"\${1}\" ]];fi"
eval "$_positional_name=\${1}"
```

**Replace with nameref (bash 4.3+):**
```bash
declare -n target_var="_arg_${positional_name}"
target_var="$1"

# For one-of validation:
validate_one_of() {
    local value="$1"
    shift
    local allowed=("$@")
    for item in "${allowed[@]}"; do
        [[ "$item" == "$value" ]] && return 0
    done
    return 1
}
```

**Files to update:**
- `ai` - Lines 185, 201
- `src/bash/agent` - Lines 185, 201
- `src/bash/chat` - Lines 554-556 (if applicable)
- `src/bash/ask` - Similar patterns

### 1.3 Input Validation Framework

**New file: `src/bash/lib/validation`**

```bash
#!/bin/bash

# LLM Parameter Validation
# All functions return 0 (valid) or 1 (invalid)

validate_temperature() {
    local val="$1"
    [[ "$val" =~ ^[0-9]+(\.[0-9]+)?$ ]] || return 1
    (( $(echo "$val >= 0 && $val <= 2" | bc -l) )) || return 1
    return 0
}

validate_top_p() {
    local val="$1"
    [[ "$val" =~ ^[0-9]+(\.[0-9]+)?$ ]] || return 1
    (( $(echo "$val >= 0 && $val <= 1" | bc -l) )) || return 1
    return 0
}

validate_max_tokens() {
    local val="$1"
    [[ "$val" =~ ^[0-9]+$ ]] || return 1
    (( val > 0 && val <= 100000 )) || return 1
    return 0
}

validate_provider() {
    local val="$1"
    # Check against available provider plugins
    local provider_file="${_SCRIPT_DIR}/lib/providers/${val}"
    [[ -f "$provider_file" ]] || return 1
    return 0
}

validate_frequency_penalty() {
    local val="$1"
    [[ "$val" =~ ^-?[0-9]+(\.[0-9]+)?$ ]] || return 1
    (( $(echo "$val >= -2 && $val <= 2" | bc -l) )) || return 1
    return 0
}

validate_presence_penalty() {
    local val="$1"
    [[ "$val" =~ ^-?[0-9]+(\.[0-9]+)?$ ]] || return 1
    (( $(echo "$val >= -2 && $val <= 2" | bc -l) )) || return 1
    return 0
}

validate_seed() {
    local val="$1"
    [[ "$val" =~ ^[0-9]+$ ]] || return 1
    return 0
}

# Generic validator dispatcher
validate_param() {
    local param="$1"
    local value="$2"
    
    case "$param" in
        temperature) validate_temperature "$value" ;;
        top_p) validate_top_p "$value" ;;
        max_tokens) validate_max_tokens "$value" ;;
        frequency_penalty) validate_frequency_penalty "$value" ;;
        presence_penalty) validate_presence_penalty "$value" ;;
        seed) validate_seed "$value" ;;
        provider) validate_provider "$value" ;;
        *) return 0 ;;  # Unknown params pass through
    esac
}
```

**Apply validation in `src/bash/ask`:**
Add validation after parseArger parsing but before API call:

```bash
# After parsing, before using parameters
for param in temperature top_p max_tokens frequency_penalty presence_penalty seed; do
    var_name="_arg_${param}"
    value="${!var_name}"
    if [[ -n "$value" ]]; then
        if ! validate_param "$param" "$value"; then
            die "Invalid value for --${param}: $value" 1
        fi
    fi
done
```

### 1.4 Command Blacklist System

**New file: `src/bash/lib/security`**

```bash
#!/bin/bash

# Command Blacklist System
# Empty by default - power++ users control their own security

# Global blacklist array
COMMAND_BLACKLIST=()

# Load blacklist from user config
load_command_blacklist() {
    local blacklist_file="${AI_USER_CONFIG_DIR}/command-blacklist"
    COMMAND_BLACKLIST=()  # Reset
    
    if [[ -f "$blacklist_file" ]]; then
        while IFS= read -r pattern; do
            # Skip empty lines and comments
            [[ -z "$pattern" || "$pattern" =~ ^[[:space:]]*# ]] && continue
            COMMAND_BLACKLIST+=("$pattern")
        done < "$blacklist_file"
    fi
    
    # Debug output if verbose
    if [[ "$_verbose_level" -ge 2 && ${#COMMAND_BLACKLIST[@]} -gt 0 ]]; then
        log "Loaded ${#COMMAND_BLACKLIST[@]} blacklist patterns" 2
    fi
}

# Check if command matches any blacklist pattern
is_command_blacklisted() {
    local cmd="$1"
    
    for pattern in "${COMMAND_BLACKLIST[@]}"; do
        if [[ "$cmd" =~ $pattern ]]; then
            return 0  # Blacklisted
        fi
    done
    
    return 1  # Allowed
}

# Filter command through blacklist
filter_command() {
    local cmd="$1"
    
    if is_command_blacklisted "$cmd"; then
        log "Command blocked by blacklist: $cmd" -1
        return 1
    fi
    
    return 0
}

# API Key handling (simple, from .env files)
get_provider_credential() {
    local provider="${1:-${AI_DEFAULT_PROVIDER}}"
    local cred_file="$HOME/.config/ai-gents/credentials/${provider}"
    
    # Check env variable first
    local env_var="AI_${provider^^}_API_KEY"
    if [[ -n "${!env_var:-}" ]]; then
        echo "${!env_var}"
        return 0
    fi
    
    # Fall back to file
    if [[ -f "$cred_file" ]]; then
        cat "$cred_file"
        return 0
    fi
    
    return 1
}
```

**Modify `src/bash/ask` command execution (Lines 606-632):**

```bash
# Load blacklist at startup
load_command_blacklist

# Extract commands between #!/ and ; from user prompt
_arg_prompt_cmds=()
matches=()
prompt_copy="$_arg_prompt"

while [[ "$prompt_copy" =~ \#\!/([^;]+)\; ]]; do
    pcmd="${BASH_REMATCH[1]}"
    matches+=("${BASH_REMATCH[0]}")
    
    # Check blacklist
    if ! filter_command "$pcmd"; then
        log "Skipping blacklisted command: $pcmd" -1
        prompt_copy="${prompt_copy//"${BASH_REMATCH[0]}"/ [BLOCKED]}"
        continue
    fi
    
    _arg_prompt_cmds+=("$pcmd")
    prompt_copy="${prompt_copy//"${BASH_REMATCH[0]}"/ }"
done

# Execute allowed commands
if [[ ${#_arg_prompt_cmds[@]} -gt 0 ]]; then
    for i in "${!_arg_prompt_cmds[@]}"; do
        match="${matches[$i]}"
        
        # Parse the command
        read -ra _tmpCmd <<< "$(parse_command "${_arg_prompt_cmds[$i]}")"
        
        # Double-check blacklist (in case of injection)
        if ! filter_command "${_tmpCmd[0]}"; then
            log "Command blocked: ${_tmpCmd[0]}" -1
            _arg_prompt="${_arg_prompt//$match/ [BLOCKED]}"
            continue
        fi
        
        # Execute
        to_put_in_arg_prompt=$("${_tmpCmd[@]}" 2>&1)
        
        if [[ $? -ne 0 ]]; then
            log "Command failed: ${_tmpCmd[*]}" -2
        else
            _arg_prompt="${_arg_prompt//$match/$to_put_in_arg_prompt}"
        fi
    done
fi
```

**User creates:** `~/.config/ai-gents/command-blacklist`
```bash
# Example blacklist file
# Patterns are bash regex
rm[[:space:]]+-rf[[:space:]]+/
mkfs\.
dd[[:space:]]+if=.*of=/dev
.*[[:space:]]>[[:space:]]+/dev
```

---

## Phase 2: Provider Plugin System (Week 2)

### 2.1 Base Provider Interface

**New file: `src/bash/lib/providers/_base`**

```bash
#!/bin/bash

# Base Provider Interface
# All providers must implement these functions:
# - provider_get_name
# - provider_get_url  
# - provider_get_default_model
# - provider_get_credential_env
# - provider_build_payload
# - provider_parse_stream_chunk
# - provider_parse_response

# Provider name (override in each provider)
provider_name=""

# Get provider name
provider_get_name() {
    echo "$provider_name"
}

# Get API base URL
# Override: Return the base URL for the provider
provider_get_url() {
    echo ""
}

# Get default model name
# Override: Return default model for the provider  
provider_get_default_model() {
    echo ""
}

# Get environment variable name for API key
# Override: Return env var name (e.g., OPENAI_API_KEY)
provider_get_credential_env() {
    echo ""
}

# Build JSON payload for API request
# Args: $1=model, $2=messages_json, $3=stream(true/false), $4=extra_params
# Override: Return JSON payload string
provider_build_payload() {
    echo ""
}

# Parse a streaming response chunk
# Args: $1=response_line
# Override: Extract and output content, return 1 to stop
provider_parse_stream_chunk() {
    echo ""
}

# Parse non-streaming response
# Args: $1=response_json
# Override: Extract and output content
provider_parse_response() {
    echo ""
}

# Check if provider supports function calling
# Override: Return "true" or "false"
provider_supports_functions() {
    echo "false"
}
```

### 2.2 Provider Implementation Priority

#### Priority 1: OpenRouter

**New file: `src/bash/lib/providers/openrouter`**

```bash
#!/bin/bash
source "$(dirname "${BASH_SOURCE[0]}")/_base"

provider_name="openrouter"

provider_get_url() {
    echo "https://openrouter.ai/api/v1"
}

provider_get_default_model() {
    echo "${AI_OPENROUTER_MODEL:-meta-llama/llama-3.2-1b-instruct:free}"
}

provider_get_credential_env() {
    echo "OPENROUTER_API_KEY"
}

provider_build_payload() {
    local model="$1"
    local messages="$2"
    local stream="$3"
    shift 3
    local extra_params=("$@")
    
    # Build JSON using jq for safety
    local payload
    payload=$(jq -n \
        --arg model "$model" \
        --argjson messages "$messages" \
        --argjson stream "$stream" \
        '{
            model: $model,
            messages: $messages,
            stream: $stream
        }')
    
    # Add extra params
    for param in "${extra_params[@]}"; do
        local key="${param%%:*}"
        local value="${param#*:}"
        payload=$(echo "$payload" | jq --arg key "$key" --arg value "$value" '. + {($key): $value}')
    done
    
    echo "$payload"
}

provider_parse_stream_chunk() {
    local line="$1"
    
    # OpenRouter uses standard OpenAI format
    if [[ "$line" == "data: [DONE]" ]]; then
        return 1  # Stop signal
    fi
    
    if [[ "$line" =~ ^data:\ (.*)$ ]]; then
        local json="${BASH_REMATCH[1]}"
        local content=$(echo "$json" | jq -r '.choices[0].delta.content // empty')
        if [[ -n "$content" ]]; then
            echo "$content"
        fi
    fi
}

provider_parse_response() {
    local response="$1"
    echo "$response" | jq -r '.choices[0].message.content // empty'
}

provider_supports_functions() {
    echo "true"
}
```

#### Priority 2: OpenAI

**New file: `src/bash/lib/providers/openai`**

```bash
#!/bin/bash
source "$(dirname "${BASH_SOURCE[0]}")/_base"

provider_name="openai"

provider_get_url() {
    echo "https://${AI_OPENAI_HOST:-api.openai.com}/v1"
}

provider_get_default_model() {
    echo "${AI_OPENAI_MODEL:-gpt-4o-mini}"
}

provider_get_credential_env() {
    echo "OPENAI_API_KEY"
}

provider_build_payload() {
    local model="$1"
    local messages="$2" 
    local stream="$3"
    shift 3
    local extra_params=("$@")
    
    local payload
    payload=$(jq -n \
        --arg model "$model" \
        --argjson messages "$messages" \
        --argjson stream "$stream" \
        '{
            model: $model,
            messages: $messages,
            stream: $stream
        }')
    
    # Add extra params
    for param in "${extra_params[@]}"; do
        local key="${param%%:*}"
        local value="${param#*:}"
        payload=$(echo "$payload" | jq --arg key "$key" --argjson value "$value" '. + {($key): $value}')
    done
    
    echo "$payload"
}

provider_parse_stream_chunk() {
    local line="$1"
    
    if [[ "$line" == "data: [DONE]" ]]; then
        return 1
    fi
    
    if [[ "$line" =~ ^data:\ (.*)$ ]]; then
        local json="${BASH_REMATCH[1]}"
        # Handle error responses
        if echo "$json" | jq -e '.error' >/dev/null 2>&1; then
            local error_msg=$(echo "$json" | jq -r '.error.message')
            log "API Error: $error_msg" -3 >&2
            return 1
        fi
        local content=$(echo "$json" | jq -r '.choices[0].delta.content // empty')
        if [[ -n "$content" ]]; then
            echo "$content"
        fi
    fi
}

provider_parse_response() {
    local response="$1"
    # Handle errors
    if echo "$response" | jq -e '.error' >/dev/null 2>&1; then
        local error_msg=$(echo "$response" | jq -r '.error.message')
        die "API Error: $error_msg" 1
    fi
    echo "$response" | jq -r '.choices[0].message.content // empty'
}

provider_supports_functions() {
    echo "true"
}
```

#### Priority 3+: Other Providers

Migrate remaining providers following same pattern:
- `anthropic` - Claude API
- `lmstudio` - Local LM Studio
- `ollama` - Local Ollama
- `deepseek` - DeepSeek API
- `moonshot` - Moonshot AI (with think tag handling)

### 2.3 Provider Loader

**New file: `src/bash/lib/providers`** (loader script)

```bash
#!/bin/bash

# Provider Loader
# Auto-discovers and loads provider plugins

PROVIDER_DIR="$(dirname "${BASH_SOURCE[0]}")/providers"
declare -A LOADED_PROVIDERS

# Load a provider by name
load_provider() {
    local provider_name="$1"
    
    # Check if already loaded
    [[ -n "${LOADED_PROVIDERS[$provider_name]:-}" ]] && return 0
    
    local provider_file="${PROVIDER_DIR}/${provider_name}"
    
    if [[ -f "$provider_file" ]]; then
        source "$provider_file"
        LOADED_PROVIDERS[$provider_name]="loaded"
        return 0
    fi
    
    return 1
}

# Check if provider exists
provider_exists() {
    local provider_name="$1"
    [[ -f "${PROVIDER_DIR}/${provider_name}" ]]
}

# List all available providers
list_providers() {
    for file in "${PROVIDER_DIR}"/*; do
        local name=$(basename "$file")
        [[ "$name" == "_base" ]] && continue
        [[ -f "$file" ]] && echo "$name"
    done
}

# Get provider info
get_provider_info() {
    local provider_name="$1"
    
    if ! load_provider "$provider_name"; then
        return 1
    fi
    
    echo "Name: $(provider_get_name)"
    echo "URL: $(provider_get_url)"
    echo "Default Model: $(provider_get_default_model)"
    echo "Credential Env: $(provider_get_credential_env)"
    echo "Supports Functions: $(provider_supports_functions)"
}

# Get provider URL (backward compat helper)
get_llm_provider_url() {
    local provider="${1:-${AI_DEFAULT_PROVIDER}}"
    
    if load_provider "$provider"; then
        provider_get_url
        return 0
    fi
    
    # Fall back to legacy (during migration)
    case "$provider" in
        # Legacy fallbacks...
    esac
}

# Get default model (backward compat helper)
get_default_model() {
    local provider="${1:-${AI_DEFAULT_PROVIDER}}"
    
    if load_provider "$provider"; then
        provider_get_default_model
        return 0
    fi
    
    # Legacy fallbacks...
}
```

### 2.4 Refactor ask/chat to Use Provider System

**Update `src/bash/ask`:**

1. Remove hardcoded provider logic:
```bash
# Remove this block (Lines ~586-604):
if [ "$_arg_provider" = "" ]; then
    if [[ "$_arg_model" == *":"* && "$_arg_model" != *":free"* ]]; then
        _arg_provider="${_arg_model%%:*}"
        _arg_model="${_arg_model#*:}"
    else
        _arg_provider="$AI_DEFAULT_PROVIDER"
    fi
fi

if [ "$_arg_model" = "" ]; then
    _arg_model="$(get_default_model "$_arg_provider")"
fi

if [ "$_arg_provider" != "" ]; then
    _arg_api="$(get_llm_provider_url "$_arg_provider")/chat/completions"
fi
```

2. Replace with provider-based flow:
```bash
# Source the provider loader
source "$_SCRIPT_DIR/lib/providers"

# Load provider
if ! load_provider "$_arg_provider"; then
    die "Unknown provider: $_arg_provider" 1
fi

# Get provider configuration
_arg_api="$(provider_get_url)/chat/completions"
if [[ -z "$_arg_model" ]]; then
    _arg_model="$(provider_get_default_model)"
fi

# Build messages array
messages_json=$(build_messages_array)

# Build payload via provider
extra_params=()
[[ -n "$_arg_temperature" ]] && extra_params+=("temperature:$_arg_temperature")
[[ -n "$_arg_max_tokens" ]] && extra_params+=("max_tokens:$_arg_max_tokens")
# ... etc

payload=$(provider_build_payload "$_arg_model" "$messages_json" "$_streamVal" "${extra_params[@]}")

# Send request
curl_opts=(
    -f -X POST "$_arg_api"
    -H "Content-Type: application/json"
    -d "$payload"
)

# Add auth header
api_key="${_arg_api_key:-$(get_provider_credential "$_arg_provider")}"
if [[ -n "$api_key" ]]; then
    curl_opts+=(-H "Authorization: Bearer $api_key")
fi

# Stream or non-stream
if [[ "$_arg_stream" == "on" ]]; then
    curl "${curl_opts[@]}" -N 2>/dev/null | while IFS= read -r line; do
        if ! provider_parse_stream_chunk "$line"; then
            break
        fi
    done
else
    response=$(curl "${curl_opts[@]}" -w "\n%{http_code}" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    response=$(echo "$response" | head -n -1)
    
    if [[ "$http_code" != "200" ]]; then
        die "HTTP Error: $http_code" 1
    fi
    
    provider_parse_response "$response"
fi
```

---

## Phase 3: Performance Optimizations (Week 3)

### 3.1 Connection Pooling

**New file: `src/bash/lib/api`**

```bash
#!/bin/bash

# API Client with connection pooling

CURL_COOKIE_JAR=""
API_CLIENT_INITIALIZED=false

init_api_client() {
    if [[ "$API_CLIENT_INITIALIZED" == "true" ]]; then
        return 0
    fi
    
    CURL_COOKIE_JAR=$(mktemp -t ai_gents_cookies.XXXXXX)
    chmod 600 "$CURL_COOKIE_JAR"
    API_CLIENT_INITIALIZED=true
    
    # Cleanup on exit
    trap cleanup_api_client EXIT
}

cleanup_api_client() {
    if [[ -f "$CURL_COOKIE_JAR" ]]; then
        rm -f "$CURL_COOKIE_JAR"
    fi
}

# Make API request with connection reuse
api_request() {
    local method="$1"
    local url="$2"
    local payload="$3"
    local api_key="$4"
    local stream="$5"
    
    init_api_client
    
    local curl_opts=(
        --http1.1
        --cookie-jar "$CURL_COOKIE_JAR"
        --cookie "$CURL_COOKIE_JAR"
        --max-time 120
        --connect-timeout 10
        --retry 0  # We handle retries ourselves
    )
    
    # Add headers
    curl_opts+=(-H "Content-Type: application/json")
    if [[ -n "$api_key" ]]; then
        curl_opts+=(-H "Authorization: Bearer $api_key")
    fi
    
    if [[ "$stream" == "true" ]]; then
        curl_opts+=(
            -N
            --no-buffer
        )
    fi
    
    curl "${curl_opts[@]}" -X "$method" -d "$payload" "$url"
}

# Request with retry logic
api_request_with_retry() {
    local max_retries=3
    local retry_delay=2
    
    local attempt=1
    while [[ $attempt -le $max_retries ]]; do
        if api_request "$@"; then
            return 0
        fi
        
        local exit_code=$?
        
        # Don't retry on client errors (4xx)
        if [[ $exit_code -eq 22 ]]; then
            return $exit_code
        fi
        
        log "Request failed (attempt $attempt/$max_retries)" -1
        sleep $((retry_delay * attempt))
        ((attempt++))
    done
    
    return 1
}
```

**Update `src/bash/ask` to use api_request:**
Replace direct curl calls with `api_request_with_retry`.

### 3.2 Streaming Optimization (Target: 60fps)

**Keep using jq** as requested, but optimize the hot path:

**Current approach issues:**
- jq called for every chunk (expensive)
- No output buffering
- String operations on every chunk

**Optimized with batching in `src/bash/ask`:**

```bash
# Streaming with 60fps target (16ms per frame)
stream_response_optimized() {
    local chunk_buffer=""
    local last_flush=$(date +%s%N)
    local min_flush_interval=16000000  # 16ms in nanoseconds
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip non-data lines quickly
        [[ ! "$line" =~ ^data: ]] && continue
        
        # Extract content using jq
        local content=$(echo "$line" | jq -r '(.choices[0].delta.content // "")')
        
        if [[ -n "$content" ]]; then
            chunk_buffer+="$content"
            
            # Check if we should flush (60fps target)
            local now=$(date +%s%N)
            local elapsed=$((now - last_flush))
            
            if [[ $elapsed -ge $min_flush_interval ]]; then
                # Process and output buffer
                process_content "$chunk_buffer"
                chunk_buffer=""
                last_flush=$now
            fi
        fi
        
        # Check for end signal
        [[ "$line" == "data: [DONE]" ]] && break
    done
    
    # Flush remaining buffer
    if [[ -n "$chunk_buffer" ]]; then
        process_content "$chunk_buffer"
    fi
}

# Process content (escape sequences, formatting)
process_content() {
    local content="$1"
    
    # Handle special sequences
    content="${content//\\\"/\"}"
    content="${content//\\n/$'\n'}"
    content="${content//\\t/$'\t'}"
    
    # Handle think tags
    content="${content//<think>/\e[38;5;4m}"
    content="${content//<\/think>/\e[0m}"
    content="${content//◁think▷/\e[38;5;4m}"
    content="${content//◁\/think▷/\e[0m}"
    
    printf '%b' "$content"
}
```

**Provider-specific optimization:**
Add `provider_uses_think_tags` function to providers so we only do think tag processing for relevant providers (moonshot).

### 3.3 Lazy Loading

**Implement in `src/bash/lib/core`:**

```bash
#!/bin/bash

# Lazy Loading Cache System

declare -A _AGENT_CACHE
declare -A _PROVIDER_CACHE
declare -A _CONFIG_CACHE
CACHE_MAX_AGE=300  # 5 minutes

# Lazy load agent configuration
lazy_load_agent() {
    local agent="$1"
    local cache_key="agent:$agent"
    
    # Check cache
    if [[ -n "${_AGENT_CACHE[$cache_key]:-}" ]]; then
        echo "${_AGENT_CACHE[$cache_key]}"
        return 0
    fi
    
    # Load from file/URL
    local agent_content
    agent_content=$(get_agent_file "$agent") || return 1
    
    # Cache it
    _AGENT_CACHE[$cache_key]="$agent_content"
    echo "$agent_content"
}

# Lazy load provider
lazy_load_provider() {
    local provider="$1"
    local cache_key="provider:$provider"
    
    [[ -n "${_PROVIDER_CACHE[$cache_key]:-}" ]] && return 0
    
    if load_provider "$provider"; then
        _PROVIDER_CACHE[$cache_key]="loaded"
        return 0
    fi
    
    return 1
}

# Invalidate cache entries
clear_cache() {
    local pattern="${1:-*}"
    
    for key in "${_AGENT_CACHE[@]}"; do
        [[ "$key" == $pattern ]] && unset '_AGENT_CACHE[$key]'
    done
    
    for key in "${_PROVIDER_CACHE[@]}"; do
        [[ "$key" == $pattern ]] && unset '_PROVIDER_CACHE[$key]'
    done
}

# Cache management with TTL (optional)
init_cache_cleanup() {
    # Periodic cleanup in background (optional for now)
    (
        while true; do
            sleep $CACHE_MAX_AGE
            clear_cache
        done
    ) &
}
```

**Apply to `src/bash/_agent/ask` and `chat`:**
Replace eager `get_agent_file` calls with `lazy_load_agent`.

### 3.4 Parallel Processing Improvements

**Improve `src/bash/race` with semaphore pattern:**

```bash
#!/bin/bash

# Semaphore-based parallel execution

MAX_PARALLEL_JOBS=4
JOB_SEMAPHORE=""

init_semaphore() {
    JOB_SEMAPHORE=$(mktemp -u -t ai_gents_sem.XXXXXX)
    mkfifo "$JOB_SEMAPHORE"
    exec 3<>"$JOB_SEMAPHORE"
    
    # Initialize with tokens
    for ((i=0; i<MAX_PARALLEL_JOBS; i++)); do
        echo >&3
    done
    
    trap cleanup_semaphore EXIT
}

cleanup_semaphore() {
    if [[ -p "$JOB_SEMAPHORE" ]]; then
        exec 3<&-  # Close FD
        rm -f "$JOB_SEMAPHORE"
    fi
}

# Run command with parallel limit
run_limited() {
    local cmd="$1"
    local output_file="$2"
    
    # Acquire token
    read -u 3
    
    # Run in subshell
    (
        eval "$cmd" > "$output_file" 2>&1
        local exit_code=$?
        echo >&3  # Release token
        exit $exit_code
    ) &
}

# Wait for all jobs
wait_all() {
    wait
}
```

**Apply to `src/bash/race` Lines 389-408:**

```bash
# Initialize semaphore
init_semaphore

# Run models with limit
for model in "${_arg_model[@]}"; do
    output_file="$tmp_dir/${model//\//_}"
    run_limited "run_model '$model' '$output_file'" "$output_file"
done

# Wait for completion
wait_all
```

---

## Phase 4: Code Quality & Error Handling (Week 4)

### 4.1 Standardized Error Handling

**New file: `src/bash/lib/core`** (if not already created)

```bash
#!/bin/bash

# Error Handling & Logging

# Exit codes
E_OK=0
E_GENERAL=1
E_INVALID_ARGS=2
E_NOT_FOUND=3
E_PERMISSION=4
E_NETWORK=5
E_TIMEOUT=6
E_PROVIDER_ERROR=7
E_USER_CANCEL=130

# Color codes (only if terminal)
setup_colors() {
    _has_colors=0
    if [[ -t 1 ]]; then
        local ncolors=$(tput colors 2>/dev/null)
        [[ -n "$ncolors" && "$ncolors" -ge 8 ]] && _has_colors=1
    fi
}

# Standardized log function
log() {
    local msg="$1"
    local level="${2:-0}"  # -3=fatal, -2=error, -1=warn, 0=info, 1=success, 2=debug, 3=trace
    
    [[ "$level" -gt "${_verbose_level:-0}" ]] && return 0
    
    local color="\033[0m"
    case "$level" in
        -3) color="\033[0;31m" ;;  # Red - fatal
        -2) color="\033[0;31m" ;;  # Red - error  
        -1) color="\033[0;33m" ;;  # Yellow - warning
        0)  color="\033[0m" ;;     # Default - info
        1)  color="\033[0;32m" ;;  # Green - success
        2)  color="\033[1;36m" ;;  # Cyan - debug
        3)  color="\033[0;36m" ;;  # Light cyan - trace
    esac
    
    if [[ "$_has_colors" == "1" ]]; then
        echo -e "${color}${msg}\033[0m" >&2
    else
        echo "$msg" >&2
    fi
}

# Fatal error - exit immediately
fatal() {
    local msg="$1"
    local exit_code="${2:-$E_GENERAL}"
    log "$msg" -3
    exit "$exit_code"
}

# Error - log but continue
error() {
    log "$1" -2
}

# Warning
warn() {
    log "$1" -1
}

# Info
info() {
    log "$1" 0
}

# Success
success() {
    log "$1" 1
}

# Debug
debug() {
    log "$1" 2
}

# Die function (backward compat with parseArger)
die() {
    local msg="$1"
    local exit_code="${2:-1}"
    
    # Print help if requested
    if [[ "${_PRINT_HELP:-no}" == "yes" ]]; then
        print_help >&2
    fi
    
    fatal "$msg" "$exit_code"
}

# Validation error
validation_error() {
    local param="$1"
    local value="$2"
    local reason="$3"
    
    die "Invalid value for --${param}: ${value} (${reason})" $E_INVALID_ARGS
}
```

**Replace all bare `echo` and `exit` error patterns with standardized functions.**

### 4.2 YAML Safety Improvements

**Update `src/bash/_agent/create`:**

```bash
# Before (unsafe):
yq ".name = \"${_arg_name}\"" "$template"

# After (safe with --arg):
yq --arg name "$_arg_name" \
   --arg prompt "$_arg_prompt" \
   --arg provider "$_arg_provider" \
   --arg model "$_arg_model" \
   --arg temperature "$_arg_temperature" \
   '
   .name = $name |
   .system.prompt = $prompt |
   .model.provider = $provider |
   .model.name = $model |
   .model.temperature = ($temperature | tonumber)
   ' "$template" > "$config_file"
```

### 4.3 Variable Naming Convention

**Standardize across all files:**

| Type | Pattern | Example |
|------|---------|---------|
| Arguments | `_arg_<name>` | `_arg_prompt`, `_arg_model` |
| Local vars | lowercase | `local response`, `local i` |
| Constants | `UPPERCASE` | `MAX_RETRIES`, `CACHE_TTL` |
| Temp files | `tmp_*` | `tmp_payload`, `tmp_response` |
| Arrays | `<name>_arr` (if needed) | `models_arr` |
| File paths | `*_file` | `config_file`, `agent_file` |

**Refactoring targets:**
- `src/bash/ask`: `tmp_response` → `tmp_response_file`, `gen_time` → `generation_time`
- `src/bash/chat`: Standardize all locals
- `src/bash/common`: Already mostly consistent, verify

---

## Phase 5: Testing (Week 5)

### 5.1 BATS Test Suite

**Install BATS:**
```bash
# Add to install script
git clone https://github.com/bats-core/bats-core.git
cd bats-core
./install.sh $HOME/.local
```

**Test structure:**

```
tests/
├── lib/
│   ├── test_validation.bats
│   ├── test_security.bats
│   └── test_providers.bats
├── commands/
│   ├── test_ask.bats
│   └── test_chat.bats
└── helper.bash
```

**Example test file: `tests/lib/test_validation.bats`**

```bash
#!/usr/bin/env bats

load '../helper'

setup() {
    source "${BATS_TEST_DIRNAME}/../../src/bash/lib/validation"
}

@test "validate_temperature accepts valid values" {
    run validate_temperature "0.7"
    assert_success
    
    run validate_temperature "2.0"
    assert_success
    
    run validate_temperature "0"
    assert_success
}

@test "validate_temperature rejects invalid values" {
    run validate_temperature "3.0"
    assert_failure
    
    run validate_temperature "-0.1"
    assert_failure
    
    run validate_temperature "abc"
    assert_failure
}

@test "validate_max_tokens accepts valid values" {
    run validate_max_tokens "1000"
    assert_success
    
    run validate_max_tokens "1"
    assert_success
}

@test "validate_max_tokens rejects invalid values" {
    run validate_max_tokens "-100"
    assert_failure
    
    run validate_max_tokens "0"
    assert_failure
    
    run validate_max_tokens "abc"
    assert_failure
}
```

**Example test file: `tests/lib/test_security.bats`**

```bash
#!/usr/bin/env bats

load '../helper'

setup() {
    source "${BATS_TEST_DIRNAME}/../../src/bash/lib/security"
    export AI_USER_CONFIG_DIR="${BATS_TEST_TMPDIR}/.config/ai-gents"
    mkdir -p "$AI_USER_CONFIG_DIR"
}

@test "load_command_blacklist loads empty by default" {
    load_command_blacklist
    [[ ${#COMMAND_BLACKLIST[@]} -eq 0 ]]
}

@test "load_command_blacklist loads user patterns" {
    cat > "$AI_USER_CONFIG_DIR/command-blacklist" << 'EOF'
rm\s+-rf
mkfs\.
EOF
    
    load_command_blacklist
    [[ ${#COMMAND_BLACKLIST[@]} -eq 2 ]]
    [[ "${COMMAND_BLACKLIST[0]}" == "rm\s+-rf" ]]
}

@test "is_command_blacklisted matches patterns" {
    COMMAND_BLACKLIST=("rm\s+-rf")
    
    run is_command_blacklisted "rm -rf /"
    assert_success  # Returns 0 (blacklisted)
    
    run is_command_blacklisted "ls -la"
    assert_failure  # Returns 1 (not blacklisted)
}
```

**Example test file: `tests/commands/test_ask.bats`**

```bash
#!/usr/bin/env bats

load '../helper'

setup() {
    # Setup mock provider
    export AI_DEFAULT_PROVIDER="mock"
    export PATH="${BATS_TEST_DIRNAME}/mocks:$PATH"
}

test "ask with invalid temperature fails" {
    run ./ai ask "Hello" --temperature 5.0
    assert_failure
    assert_output --partial "Invalid value"
}

test "ask with blacklisted command is blocked" {
    echo "date" > "${BATS_TEST_TMPDIR}/.config/ai-gents/command-blacklist"
    
    run ./ai ask "Run #!/date; for me"
    assert_output --partial "BLOCKED"
}
```

**Test helper: `tests/helper.bash`**

```bash
#!/bin/bash

# BATS helper functions

assert_success() {
    [[ "$status" -eq 0 ]]
}

assert_failure() {
    [[ "$status" -ne 0 ]]
}

assert_output() {
    local expected="$1"
    [[ "$output" == *"$expected"* ]]
}

# Setup test environment
setup_test_env() {
    export TMPDIR="${BATS_TEST_TMPDIR}"
    export HOME="${BATS_TEST_TMPDIR}"
    export AI_USER_CONFIG_DIR="${HOME}/.config/ai-gents"
    export AI_GENTS_DIR="${BATS_TEST_DIRNAME}/.."
    
    mkdir -p "$AI_USER_CONFIG_DIR"
    mkdir -p "$AI_USER_CONFIG_DIR/credentials"
    mkdir -p "$AI_USER_CONFIG_DIR/agents"
}
```

### 5.2 Running Tests

**Add to Makefile or test runner:**

```bash
#!/bin/bash
# test.sh

echo "Running AI-Gents test suite..."

# Find and run all .bats files
for test_file in tests/**/*.bats; do
    echo "Testing: $test_file"
    bats "$test_file"
done

echo "Tests complete!"
```

---

## Phase 6: Documentation (Week 6)

### 6.1 Update README.md

**Add sections:**

```markdown
## Architecture

AI-Gents uses a modular architecture with:
- **ParseArger** for standardized CLI parsing
- **Provider Plugins** for LLM service integration
- **Lazy Loading** for optimal performance
- **Connection Pooling** for efficient API usage

## Provider Plugins

Providers are dynamically loaded from `src/bash/lib/providers/`.

### Available Providers
- openrouter (default)
- openai
- anthropic
- lmstudio
- ollama
- deepseek
- moonshot

### Creating Custom Providers

Create a file in `src/bash/lib/providers/your-provider`:

```bash
#!/bin/bash
source "$(dirname "${BASH_SOURCE[0]}")/_base"

provider_name="your-provider"

provider_get_url() {
    echo "https://api.your-provider.com/v1"
}

provider_get_default_model() {
    echo "default-model"
}

# ... implement other required functions
```

## Security

### Command Blacklist

AI-Gents allows executing commands in prompts via `#!/command;` syntax.
For security, you can configure a blacklist:

Create `~/.config/ai-gents/command-blacklist`:
```
rm\s+-rf
mkfs\.
dd\s+if=.*of=/dev
```

Patterns are bash regex. Empty by default (power++ users).

### Input Validation

All LLM parameters are validated:
- Temperature: 0.0 - 2.0
- Top P: 0.0 - 1.0
- Max Tokens: positive integer
- Frequency/Presence Penalty: -2.0 - 2.0

## Performance

### Connection Pooling

HTTP connections are reused across requests to the same provider.

### Streaming Optimization

Streaming responses are batched to maintain ~60fps output.

### Lazy Loading

Agent configurations and provider plugins are loaded on-demand.
```

### 6.2 Create docs/ARCHITECTURE.md

```markdown
# AI-Gents Architecture

## Overview

AI-Gents is a bash-based CLI tool for interacting with LLMs.
It features a modular plugin system for providers, configurable agents,
and advanced features like multi-model racing.

## Directory Structure

```
src/bash/
├── ai              # Main entry point
├── ask             # Single query command
├── chat            # Interactive chat
├── agent           # Agent management
├── race            # Multi-model racing
├── mcp             # MCP server management
├── _agent/         # Agent subcommands
│   ├── ask
│   ├── chat
│   ├── create
│   └── list
└── lib/            # Core libraries (no .sh extensions)
    ├── core        # Common utilities, logging, caching
    ├── validation  # Input validation
    ├── security    # Blacklist, credentials
    ├── api         # HTTP client, connection pooling
    └── providers/  # Provider plugins
        ├── _base   # Base interface
        ├── openrouter
        ├── openai
        └── ...
```

## Provider Plugin System

### Interface

All providers must implement:

1. `provider_get_name()` - Return provider identifier
2. `provider_get_url()` - Return API base URL
3. `provider_get_default_model()` - Return default model
4. `provider_get_credential_env()` - Return API key env var name
5. `provider_build_payload()` - Construct API request payload
6. `provider_parse_stream_chunk()` - Extract content from stream
7. `provider_parse_response()` - Extract content from response
8. `provider_supports_functions()` - Return "true" or "false"

### Loading

Providers are loaded dynamically:
1. User specifies `--provider <name>`
2. System looks for `src/bash/lib/providers/<name>`
3. Sources the file and calls provider functions
4. Falls back to legacy if not found (during migration)

## Data Flow

### Ask Command

1. Parse arguments with parseArger
2. Validate inputs
3. Load provider plugin
4. Build messages array
5. Provider builds payload
6. API client sends request
7. Provider parses response
8. Output to user

### Chat Command

1. Parse arguments
2. Load agent (lazy)
3. Start interactive loop
4. For each message:
   - Get user input (rlwrap)
   - Process tasks
   - Call ask command
   - Update history
5. Cleanup temp files

## Security Model

### Trust Model

AI-Gents assumes the user is a "power++" terminal user:
- Full shell access already available
- Commands in prompts are intentional
- User configures their own security boundaries

### Safety Mechanisms

1. **Input Validation** - Prevent invalid LLM parameters
2. **Command Blacklist** - User-configurable pattern matching
3. **No eval()** - Use nameref for dynamic variables
4. **Temp File Cleanup** - Always cleanup on exit

## Performance Features

### Connection Pooling

- Reuse HTTP connections via curl cookie jar
- Reduce connection overhead
- Especially effective for chat sessions

### Lazy Loading

- Agents loaded only when needed
- Provider plugins loaded on first use
- Cached for subsequent calls

### Streaming Batching

- Buffer chunks for 16ms (60fps target)
- Reduce output flicker
- Minimize jq calls

### Parallel Execution

- Semaphore-based job control
- Limit concurrent requests
- Used in race command
```

---

## Implementation Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Foundation | Modular lib structure, validation, blacklist, no-eval |
| 2 | Providers | Plugin system, openrouter, openai, others |
| 3 | Performance | Connection pooling, streaming optimization, lazy loading |
| 4 | Quality | Error handling, YAML safety, naming standards |
| 5 | Testing | BATS test suite, validation tests, integration tests |
| 6 | Docs | Updated README, architecture docs, provider guide |

---

## No Backward Compatibility

Since you're the sole user, we can make breaking changes freely:

**Changes that affect you:**
1. New `src/bash/lib/` structure (just source the right files)
2. Provider configuration moves to plugins (should be transparent)
3. May need to create `~/.config/ai-gents/command-blacklist` if you want blocking
4. New validation may reject previously-accepted invalid values

**Migration for you:**
```bash
# After pulling new code
./utils/install  # Re-run installer if needed

# Optional: create blacklist
touch ~/.config/ai-gents/command-blacklist

# Test basic functionality
./ai ask "Hello" --provider openrouter
./ai chat "Hi"
./ai agent list
```

---

## Success Criteria

**Phase 1:**
- [ ] `src/bash/lib/` structure created
- [ ] All `eval()` removed, using nameref
- [ ] Validation functions working
- [ ] Blacklist system functional (empty by default)

**Phase 2:**
- [ ] Provider plugins loading dynamically
- [ ] OpenRouter and OpenAI migrated
- [ ] Other providers working
- [ ] `ask` and `chat` using provider system

**Phase 3:**
- [ ] Connection pooling working (observe via timing)
- [ ] Streaming smooth (no visible flicker)
- [ ] Lazy loading verified (first call slower, subsequent fast)
- [ ] Race command using semaphore

**Phase 4:**
- [ ] All errors use standardized functions
- [ ] Variable naming consistent
- [ ] YAML operations safe
- [ ] No shellcheck warnings

**Phase 5:**
- [ ] BATS tests passing
- [ ] Validation thoroughly tested
- [ ] Security features tested
- [ ] CI/CD running tests (optional)

**Phase 6:**
- [ ] README updated
- [ ] Architecture doc complete
- [ ] Provider development guide written

---

## Notes

### ParseArger Preservation

All parseArger-generated code remains:
- CLI parsing in each command file
- Help text generation
- Argument validation patterns

Only the content *after* `# @parseArger-end` changes.

### Security Philosophy

Power++ users deserve power++ tools:
- No hand-holding
- User controls their own safety
- Empty blacklist by default
- Simple .env configuration
- Assume user knows what they're doing

### Performance Philosophy

Optimize where it matters:
- Connection pooling (saves time)
- Lazy loading (saves startup)
- 60fps streaming (smooth UX)
- But: Keep jq (not awk) - simplicity > micro-optimization

---

*Plan v1.0 - Ready for implementation*