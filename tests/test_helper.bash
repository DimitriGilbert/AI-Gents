#!/bin/bash
#
# Test Helper Library for AI-Gents BATS Tests
# Source this in your test files: load test_helper
#

# Find project root
_PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
_LIB_DIR="$_PROJECT_ROOT/src/bash/lib"

# Source library files for testing
source_lib() {
    local lib_name="$1"
    source "$_LIB_DIR/$lib_name"
}

# Setup test environment
setup() {
    # Create temp directory for tests
    TEST_TEMP_DIR=$(mktemp -d)
    export TEST_TEMP_DIR
    
    # Set test config directory
    export AI_USER_CONFIG_DIR="$TEST_TEMP_DIR/.config/ai-gents"
    mkdir -p "$AI_USER_CONFIG_DIR/agents"
    mkdir -p "$AI_USER_CONFIG_DIR/credentials"
    
    # Initialize verbose level for testing
    export _verbose_level=0
}

# Teardown test environment
teardown() {
    # Clean up temp directory
    if [[ -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
    fi
}

# Create a mock agent file for testing
create_test_agent() {
    local name="${1:-test-agent}"
    local prompt="${2:-You are a test agent}"
    local provider="${3:-openai}"
    local model="${4:-gpt-4o-mini}"
    
    local agent_file="$AI_USER_CONFIG_DIR/agents/${name}.yml"
    
    cat > "$agent_file" <<EOF
name: ${name}
system:
  prompt: ${prompt}
model:
  provider: ${provider}
  name: ${model}
  temperature: 0.7
EOF
    
    echo "$agent_file"
}

# Create a test credential file
create_test_credential() {
    local provider="${1:-openai}"
    local key="${2:-test-api-key-12345}"
    
    local cred_file="$AI_USER_CONFIG_DIR/credentials/${provider}"
    echo "$key" > "$cred_file"
    chmod 600 "$cred_file"
    
    echo "$cred_file"
}

# Create a test blacklist file
create_test_blacklist() {
    local content="${1:-rm.*-rf.*\/}"
    
    local blacklist_file="$AI_USER_CONFIG_DIR/command-blacklist"
    echo "$content" > "$blacklist_file"
    
    echo "$blacklist_file"
}

# Assert that a command succeeds
assert_success() {
    local cmd="$1"
    local msg="${2:-Command should succeed}"
    
    run eval "$cmd"
    [[ $status -eq 0 ]] || fail "$msg (exit code: $status)"
}

# Assert that a command fails
assert_failure() {
    local cmd="$1"
    local msg="${2:-Command should fail}"
    
    run eval "$cmd"
    [[ $status -ne 0 ]] || fail "$msg (expected failure but succeeded)"
}

# Assert output contains string
assert_output_contains() {
    local expected="$1"
    local msg="${2:-Output should contain '$expected'}"
    
    [[ "$output" == *"$expected"* ]] || fail "$msg"
}

# Assert output equals string
assert_output_equals() {
    local expected="$1"
    local msg="${2:-Output should equal '$expected'}"
    
    [[ "$output" == "$expected" ]] || fail "$msg (got: $output)"
}

# Skip test if dependency missing
skip_if_no_dependency() {
    local cmd="$1"
    
    if ! command -v "$cmd" &>/dev/null; then
        skip "Required dependency not found: $cmd"
    fi
}

# Create mock API response
create_mock_response() {
    local content="${1:-Test response}"
    
    cat <<EOF
{
  "id": "test-123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "$content"
      },
      "finish_reason": "stop"
    }
  ]
}
EOF
}

# Mock API request (for testing without network)
mock_api_request() {
    local response_file="$1"
    local expected_exit="${2:-0}"
    
    if [[ -f "$response_file" ]]; then
        cat "$response_file"
        return "$expected_exit"
    else
        echo '{"error": {"message": "Mock response file not found"}}'
        return 1
    fi
}

# Generate random string for unique test IDs
random_string() {
    local length="${1:-8}"
    tr -dc 'a-z0-9' </dev/urandom | head -c "$length"
}
