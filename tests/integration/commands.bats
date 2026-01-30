#!/usr/bin/env bats
#
# Integration tests for AI-Gents commands
#

load test_helper

setup() {
    setup
    source_lib "validation"
    source_lib "security"
    source_lib "core"
}

teardown() {
    teardown
}

@test "ask command: validates temperature parameter" {
    # This tests that ask would validate temperature
    run validate_temperature "5"
    [[ $status -ne 0 ]]
}

@test "chat command: validates max_tokens parameter" {
    run validate_max_tokens "0"
    [[ $status -ne 0 ]]
    
    run validate_max_tokens "-100"
    [[ $status -ne 0 ]]
}

@test "agent create: agent file is created correctly" {
    skip_if_no_dependency yq
    
    local agent_name="test-agent-$(random_string 6)"
    local agent_file
    agent_file=$(create_test_agent "$agent_name" "Test prompt" "openai" "gpt-4")
    
    [[ -f "$agent_file" ]]
    
    # Verify content
    run yq -r '.name' "$agent_file"
    [[ "$output" == "$agent_name" ]]
    
    run yq -r '.system.prompt' "$agent_file"
    [[ "$output" == "Test prompt" ]]
}

@test "agent creation: validates agent name" {
    # Agent names with unsafe characters should be rejected
    run validate_yaml_safe "agent/name"
    [[ $status -ne 0 ]]
    
    run validate_yaml_safe "agent:name"
    [[ $status -ne 0 ]]
}

@test "provider system: discovers available providers" {
    source "$_LIB_DIR/providers/_loader"
    
    run provider_discover
    [[ $status -eq 0 ]]
    
    [[ ${#_AVAILABLE_PROVIDERS[@]} -ge 7 ]]
}

@test "provider system: loads provider correctly" {
    source "$_LIB_DIR/providers/_loader"
    provider_discover
    
    run provider_load "openai"
    [[ $status -eq 0 ]]
    
    run provider_get_name
    [[ "$output" == "openai" ]]
}

@test "provider system: handles missing provider" {
    source "$_LIB_DIR/providers/_loader"
    
    run provider_load "nonexistent"
    [[ $status -ne 0 ]]
}

@test "api library: initializes connection pool" {
    source_lib "api"
    
    run api_init_pool
    [[ $status -eq 0 ]]
    
    [[ -d "${TMPDIR:-/tmp}/ai-gents-conn" ]]
}

@test "api library: builds curl command with pooling" {
    source_lib "api"
    api_init_pool
    
    local curl_args=()
    run api_curl_cmd "https://api.openai.com/v1/chat/completions" curl_args
    
    # Check that curl_args was populated
    [[ ${#curl_args[@]} -gt 0 ]]
    
    # Check for expected flags
    [[ "${curl_args[*]}" == *"keepalive-time"* ]]
}

@test "error handling: standardized exit codes work" {
    source_lib "errors"
    
    [[ $E_SUCCESS -eq 0 ]]
    [[ $E_GENERIC -eq 1 ]]
    [[ $E_INVALID_ARGS -eq 2 ]]
    [[ $E_API_ERROR -eq 6 ]]
}

@test "cache system: stores and retrieves values" {
    source_lib "core"
    
    cache_set "test_key" "test_value"
    
    run cache_get "test_key"
    [[ "$output" == "test_value" ]]
    
    run cache_has "test_key"
    [[ $status -eq 0 ]]
    
    run cache_has "nonexistent_key"
    [[ $status -ne 0 ]]
}

@test "lazy loading: caches function results" {
    source_lib "core"
    
    # Mock loader function
    mock_loader() {
        echo "loaded_$(date +%s%N)"
    }
    
    # First call should execute
    local result1
    result1=$(lazy_load "test_cache" mock_loader)
    
    # Second call should return cached value
    local result2
    result2=$(lazy_load "test_cache" mock_loader)
    
    # Results should be identical (cached)
    [[ "$result1" == "$result2" ]]
}

@test "parallel library: initializes correctly" {
    source_lib "parallel"
    
    run parallel_init 4
    [[ $status -eq 0 ]]
    
    # Cleanup
    parallel_cleanup
}

@test "integration: full validation pipeline" {
    # Simulate what ask command does
    _arg_temperature="0.7"
    _arg_max_tokens="1000"
    _arg_top_p="0.9"
    
    run validate_all_llm_params
    [[ $status -eq 0 ]]
    
    # Invalid parameters
    _arg_temperature="5"
    run validate_all_llm_params
    [[ $status -ne 0 ]]
}

@test "integration: security blacklist with command extraction" {
    create_test_blacklist "rm.*-rf"
    load_command_blacklist
    
    # Extract commands from prompt
    run extract_prompt_commands "#!/echo hello;"
    [[ ${#_arg_prompt_cmds[@]} -eq 1 ]]
    
    # Blocked command should not be extracted
    run extract_prompt_commands "#!/rm -rf /;"
    [[ ${#_arg_prompt_cmds[@]} -eq 0 ]]
}

@test "file operations: temp directory creation" {
    [[ -d "$TEST_TEMP_DIR" ]]
    [[ -d "$AI_USER_CONFIG_DIR" ]]
    [[ -d "$AI_USER_CONFIG_DIR/agents" ]]
    [[ -d "$AI_USER_CONFIG_DIR/credentials" ]]
}
