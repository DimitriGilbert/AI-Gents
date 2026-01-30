# Provider Plugin Development Guide

This guide walks you through creating a custom LLM provider plugin for AI-Gents.

## Overview

Provider plugins standardize interaction with different LLM services. They implement a common interface that AI-Gents uses to communicate with any supported LLM API.

## Prerequisites

- Understanding of bash scripting
- Familiarity with the LLM provider's API
- jq installed for JSON manipulation

## Quick Start

Create a new provider file:

```bash
cat > src/bash/lib/providers/myprovider << 'PROVIDER'
#!/bin/bash

# Source the base interface
source "${_SCRIPT_DIR}/lib/providers/_base"

# Set metadata
PROVIDER_NAME="myprovider"
PROVIDER_URL="https://api.myprovider.com/v1"
PROVIDER_DEFAULT_MODEL="my-model-1"
PROVIDER_API_KEY_ENV="AI_MYPROVIDER_API_KEY"

# Override functions as needed
provider_get_url() {
    echo "${AI_MYPROVIDER_HOST:-https://api.myprovider.com}/v1"
}

provider_build_payload() {
    local model="$1"
    local messages_json="$2"
    local stream="$3"
    shift 3
    
    # Build your JSON payload here
    jq -n \
        --arg model "$model" \
        --argjson messages "$messages_json" \
        --argjson stream "$stream" \
        '{model: $model, messages: $messages, stream: $stream}'
}

provider_parse_stream_chunk() {
    local chunk="$1"
    # Extract content from streaming response
    echo "$chunk" | jq -r '.choices[0].delta.content // ""'
}
PROVIDER

chmod +x src/bash/lib/providers/myprovider
```

Test it:

```bash
ai ask "Hello" --provider myprovider
```

## Detailed Guide

### Step 1: Create the File

Create a new file in `src/bash/lib/providers/` with your provider name (no extension):

```bash
touch src/bash/lib/providers/myprovider
chmod +x src/bash/lib/providers/myprovider
```

### Step 2: Source the Base Interface

Always start by sourcing the base interface:

```bash
#!/bin/bash

# shellcheck source=_base
source "${_SCRIPT_DIR}/lib/providers/_base"
```

### Step 3: Set Metadata Variables

Define the provider metadata:

```bash
# Unique identifier for the provider
PROVIDER_NAME="myprovider"

# Base URL for API requests
PROVIDER_URL="https://api.myprovider.com/v1"

# Default model when none specified
PROVIDER_DEFAULT_MODEL="my-default-model"

# Environment variable for API key
PROVIDER_API_KEY_ENV="AI_MYPROVIDER_API_KEY"
```

### Step 4: Override Functions

#### Required Overrides

**provider_get_url()**

Returns the API base URL. Support custom hosts via environment variables:

```bash
provider_get_url() {
    echo "${AI_MYPROVIDER_HOST:-https://api.myprovider.com}/v1"
}
```

**provider_build_payload()**

Builds the JSON payload for API requests:

```bash
provider_build_payload() {
    local model="$1"        # Model name
    local messages_json="$2" # Messages array as JSON string
    local stream="$3"       # true/false
    shift 3
    
    # Start with base payload
    local payload
    payload=$(jq -n \
        --arg model "$model" \
        --argjson messages "$messages_json" \
        --argjson stream "$stream" \
        '{model: $model, messages: $messages, stream: $stream}')
    
    # Add extra parameters
    for param in "$@"; do
        if [[ "$param" =~ ^([^=]+)=(.*)$ ]]; then
            local key="${BASH_REMATCH[1]}"
            local value="${BASH_REMATCH[2]}"
            
            # Add to payload based on type
            if [[ "$value" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
                payload=$(echo "$payload" | jq --arg key "$key" --argjson val "$value" '. + {($key): $val}')
            elif [[ "$value" == "true" || "$value" == "false" ]]; then
                payload=$(echo "$payload" | jq --arg key "$key" --argjson val "$value" '. + {($key): $val}')
            else
                payload=$(echo "$payload" | jq --arg key "$key" --arg val "$value" '. + {($key): $val}')
            fi
        fi
    done
    
    echo "$payload"
}
```

**provider_parse_stream_chunk()**

Extracts content from streaming response chunks:

```bash
provider_parse_stream_chunk() {
    local chunk="$1"
    local content
    
    # Check for errors
    if echo "$chunk" | jq -e '.error' >/dev/null 2>&1; then
        return 1
    fi
    
    # Extract content (provider-specific path)
    content=$(echo "$chunk" | jq -r '.choices[0].delta.content // ""')
    
    # Handle any special formatting
    content="${content//\\\"/\"}"  # Unescape quotes
    content="${content//\\n/$'\n'}"  # Unescape newlines
    
    printf '%b' "$content"
}
```

#### Optional Overrides

**provider_get_headers()**

Customize HTTP headers:

```bash
provider_get_headers() {
    local api_key="$1"
    local -n headers="$2"
    
    headers=(-H "Content-Type: application/json")
    
    if [[ -n "$api_key" ]]; then
        # Provider-specific auth format
        headers+=(-H "X-API-Key: ${api_key}")
    fi
}
```

**provider_parse_response()**

Parse non-streaming responses:

```bash
provider_parse_response() {
    local response="$1"
    echo "$response" | jq -r '.choices[0].message.content // ""'
}
```

**provider_has_error()**

Detect errors in responses:

```bash
provider_has_error() {
    local response="$1"
    echo "$response" | jq -e '.error' >/dev/null 2>&1
}
```

**provider_parse_error()**

Extract error messages:

```bash
provider_parse_error() {
    local response="$1"
    echo "$response" | jq -r '.error.message // .error.type // empty'
}
```

### Step 5: Test the Provider

#### Discovery Test

```bash
# Source the loader
source src/bash/lib/providers/_loader

# Discover providers
provider_discover

# Check if your provider is listed
provider_list_available
```

#### Load Test

```bash
# Load the provider
provider_load "myprovider"

# Verify it loaded
echo "Name: $(provider_get_name)"
echo "URL: $(provider_get_url)"
echo "Default Model: $(provider_get_default_model)"
```

#### API Test

```bash
# Set API key
export AI_MYPROVIDER_API_KEY="test-key"

# Test with ask command
ai ask "Hello" --provider myprovider --model my-model
```

### Step 6: Add Tests

Create tests in `tests/unit/myprovider.bats`:

```bash
#!/usr/bin/env bats

load test_helper

setup() {
    setup
    source_lib "providers/_loader"
    provider_discover
}

@test "myprovider: is registered" {
    run provider_is_registered "myprovider"
    [[ $status -eq 0 ]]
}

@test "myprovider: loads correctly" {
    run provider_load "myprovider"
    [[ $status -eq 0 ]]
    
    run provider_get_name
    [[ "$output" == "myprovider" ]]
}

@test "myprovider: returns correct URL" {
    provider_load "myprovider"
    
    run provider_get_url
    [[ "$output" == "https://api.myprovider.com/v1" ]]
}

@test "myprovider: builds payload correctly" {
    provider_load "myprovider"
    
    local messages='[{"role":"user","content":"Hello"}]'
    run provider_build_payload "my-model" "$messages" "false"
    
    [[ $status -eq 0 ]]
    [[ "$output" == *"my-model"* ]]
}
```

## Examples

### Simple Provider (Ollama-style)

```bash
#!/bin/bash
source "${_SCRIPT_DIR}/lib/providers/_base"

PROVIDER_NAME="myprovider"
PROVIDER_URL="http://localhost:11434/v1"
PROVIDER_DEFAULT_MODEL="llama2"
PROVIDER_API_KEY_ENV=""  # No API key needed

provider_get_url() {
    echo "http://${AI_MYPROVIDER_HOST:-localhost}:${AI_MYPROVIDER_PORT:-11434}/v1"
}
```

### Full-Featured Provider (OpenAI-style)

```bash
#!/bin/bash
source "${_SCRIPT_DIR}/lib/providers/_base"

PROVIDER_NAME="myprovider"
PROVIDER_URL="https://api.myprovider.com/v1"
PROVIDER_DEFAULT_MODEL="gpt-4"
PROVIDER_API_KEY_ENV="AI_MYPROVIDER_API_KEY"

provider_get_url() {
    echo "https://${AI_MYPROVIDER_HOST:-api.myprovider.com}/v1"
}

provider_get_headers() {
    local api_key="$1"
    local -n headers="$2"
    
    headers=(-H "Content-Type: application/json")
    
    if [[ -n "$api_key" ]]; then
        headers+=(-H "Authorization: Bearer ${api_key}")
    fi
}

provider_build_payload() {
    local model="$1"
    local messages_json="$2"
    local stream="$3"
    shift 3
    
    jq -n \
        --arg model "$model" \
        --argjson messages "$messages_json" \
        --argjson stream "$stream" \
        '{model: $model, messages: $messages, stream: $stream}'
}

provider_parse_stream_chunk() {
    local chunk="$1"
    echo "$chunk" | jq -r '.choices[0].delta.content // ""'
}

provider_parse_response() {
    local response="$1"
    echo "$response" | jq -r '.choices[0].message.content // ""'
}
```

### Provider with Special Features (Moonshot-style)

```bash
#!/bin/bash
source "${_SCRIPT_DIR}/lib/providers/_base"

PROVIDER_NAME="moonshot"
PROVIDER_URL="https://api.moonshot.cn/v1"
PROVIDER_DEFAULT_MODEL="moonshot-v1-8k"
PROVIDER_API_KEY_ENV="AI_MOONSHOT_API_KEY"

provider_parse_stream_chunk() {
    local chunk="$1"
    local content
    
    content=$(echo "$chunk" | jq -r '.choices[0].delta.content // ""')
    
    # Moonshot uses special think tags
    content="${content//◁think▷/\\e[38;5;4m}"
    content="${content//◁\\/think▷/\\e[0m}"
    
    printf '%b' "$content"
}
```

## Troubleshooting

### Provider not discovered

- Check file is executable: `chmod +x src/bash/lib/providers/myprovider`
- Verify file is in correct directory
- Check for syntax errors: `bash -n src/bash/lib/providers/myprovider`

### Provider loads but doesn't work

- Verify metadata variables are set
- Check provider_get_url returns correct URL
- Test payload building manually
- Check API key is set correctly

### Streaming doesn't work

- Ensure provider_parse_stream_chunk extracts content correctly
- Verify jq query matches provider's response format
- Test with non-streaming first

### Special characters not displayed correctly

- Unescape in provider_parse_stream_chunk:
  ```bash
  content="${content//\\\"/\"}"
  content="${content//\\n/$'\n'}"
  ```

## Best Practices

1. **Support custom hosts** via environment variables
2. **Handle errors gracefully** - check for error responses
3. **Follow naming conventions** - use lowercase provider names
4. **Make it executable** - chmod +x
5. **Test thoroughly** - add BATS tests
6. **Document special features** - note any unique behaviors
7. **Handle authentication** - support both env vars and files

## Submitting Your Provider

To submit a new provider for inclusion:

1. Create the provider file
2. Add comprehensive tests
3. Update README.md with provider information
4. Submit a PR with description

## See Also

- [Base Provider Interface](../src/bash/lib/providers/_base)
- [Provider Loader](../src/bash/lib/providers/_loader)
- [Architecture Documentation](ARCHITECTURE.md)
- [Coding Standards](CODING_STANDARDS)
