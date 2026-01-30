#!/usr/bin/env bats
#
# Security tests for blacklist system
#

load test_helper

setup() {
    setup
    source_lib "security"
    source_lib "core"
}

teardown() {
    teardown
}

@test "load_command_blacklist: loads from config file" {
    create_test_blacklist "rm.*-rf.*\/.*"
    
    run load_command_blacklist
    [[ $status -eq 0 ]]
    
    [[ ${#COMMAND_BLACKLIST[@]} -eq 1 ]]
    [[ "${COMMAND_BLACKLIST[0]}" == "rm.*-rf.*\/.*" ]]
}

@test "load_command_blacklist: handles empty blacklist" {
    # No blacklist file created
    run load_command_blacklist
    [[ $status -eq 0 ]]
    
    [[ ${#COMMAND_BLACKLIST[@]} -eq 0 ]]
}

@test "load_command_blacklist: skips comments and empty lines" {
    cat > "$AI_USER_CONFIG_DIR/command-blacklist" <<EOF
# This is a comment

rm.*-rf.*\/.*

# Another comment
mkfs\..*
EOF
    
    run load_command_blacklist
    [[ $status -eq 0 ]]
    
    [[ ${#COMMAND_BLACKLIST[@]} -eq 2 ]]
}

@test "is_command_blacklisted: matches blocked commands" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run is_command_blacklisted "rm -rf /"
    [[ $status -eq 0 ]]
    
    run is_command_blacklisted "rm -rf /home/user"
    [[ $status -eq 0 ]]
}

@test "is_command_blacklisted: allows safe commands" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run is_command_blacklisted "ls -la"
    [[ $status -ne 0 ]]
    
    run is_command_blacklisted "cat file.txt"
    [[ $status -ne 0 ]]
    
    run is_command_blacklisted "echo hello"
    [[ $status -ne 0 ]]
}

@test "is_command_blacklisted: empty blacklist allows all" {
    # No blacklist loaded
    COMMAND_BLACKLIST=()
    
    run is_command_blacklisted "rm -rf /"
    [[ $status -ne 0 ]]
    
    run is_command_blacklisted "any dangerous command"
    [[ $status -ne 0 ]]
}

@test "filter_command: blocks blacklisted commands" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run filter_command "rm -rf /"
    [[ $status -ne 0 ]]
}

@test "filter_command: allows safe commands" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run filter_command "ls -la"
    [[ $status -eq 0 ]]
}

@test "extract_prompt_commands: extracts commands from prompt" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run extract_prompt_commands "Please run #!/ls -la; and show me the output"
    [[ $status -eq 0 ]]
    
    [[ ${#_arg_prompt_cmds[@]} -eq 1 ]]
    [[ "${_arg_prompt_cmds[0]}" == "ls -la" ]]
}

@test "extract_prompt_commands: skips blacklisted commands" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run extract_prompt_commands "Run #!/rm -rf /; please"
    [[ $status -eq 0 ]]
    
    # Should be empty because command was blocked
    [[ ${#_arg_prompt_cmds[@]} -eq 0 ]]
}

@test "extract_prompt_commands: handles multiple commands" {
    create_test_blacklist ""
    load_command_blacklist
    
    run extract_prompt_commands "#!/ls -la; and then #!/pwd;"
    [[ $status -eq 0 ]]
    
    [[ ${#_arg_prompt_cmds[@]} -eq 2 ]]
    [[ "${_arg_prompt_cmds[0]}" == "ls -la" ]]
    [[ "${_arg_prompt_cmds[1]}" == "pwd" ]]
}

@test "is_command_safe: validates command safety" {
    create_test_blacklist "rm.*-rf.*\/.*"
    load_command_blacklist
    
    run is_command_safe "rm -rf /"
    [[ $status -ne 0 ]]
    
    run is_command_safe "ls -la"
    [[ $status -eq 0 ]]
}

@test "get_provider_credential: reads from env variable" {
    export AI_TEST_PROVIDER_API_KEY="test-env-key-12345"
    
    run get_provider_credential "TEST_PROVIDER"
    [[ $status -eq 0 ]]
    [[ "$output" == "test-env-key-12345" ]]
    
    unset AI_TEST_PROVIDER_API_KEY
}

@test "get_provider_credential: reads from file" {
    create_test_credential "testprov" "file-key-67890"
    
    run get_provider_credential "testprov"
    [[ $status -eq 0 ]]
    [[ "$output" == "file-key-67890" ]]
}

@test "get_provider_credential: fails when not found" {
    run get_provider_credential "nonexistent"
    [[ $status -ne 0 ]]
}

@test "get_provider_credential: prefers env over file" {
    create_test_credential "myprov" "file-key"
    export AI_MYPROV_API_KEY="env-key"
    
    run get_provider_credential "myprov"
    [[ $status -eq 0 ]]
    [[ "$output" == "env-key" ]]
    
    unset AI_MYPROV_API_KEY
}

@test "complex blacklist patterns: regex matching" {
    cat > "$AI_USER_CONFIG_DIR/command-blacklist" <<EOF
rm[[:space:]]+-rf[[:space:]]+/
mkfs\.
dd[[:space:]]+if=.*of=/dev
EOF
    load_command_blacklist
    
    run is_command_blacklisted "rm -rf /"
    [[ $status -eq 0 ]]
    
    run is_command_blacklisted "mkfs.ext4 /dev/sda"
    [[ $status -eq 0 ]]
    
    run is_command_blacklisted "dd if=/dev/zero of=/dev/sda"
    [[ $status -eq 0 ]]
    
    run is_command_blacklisted "ls -la"
    [[ $status -ne 0 ]]
}
