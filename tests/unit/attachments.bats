#!/usr/bin/env bats
load test_helper

@test "attachments: detect_mime_type detects image/jpeg" {
    # Create a test JPEG file
    test_file="$BATS_TEST_TMPDIR/test.jpg"
    # Create minimal valid JPEG header
    printf '\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xd9' > "$test_file"
    
    result=$(detect_mime_type "$test_file")
    [[ "$result" == "image/jpeg" ]] || [[ "$result" == "image/jpg" ]] || [[ "$result" == "application/octet-stream" ]]
}

@test "attachments: detect_mime_type detects text/plain" {
    test_file="$BATS_TEST_TMPDIR/test.txt"
    echo "Hello World" > "$test_file"
    
    result=$(detect_mime_type "$test_file")
    [[ "$result" == "text/plain" ]]
}

@test "attachments: is_image_mime returns 0 for image/jpeg" {
    run is_image_mime "image/jpeg"
    [[ $status -eq 0 ]]
}

@test "attachments: is_image_mime returns 1 for text/plain" {
    run is_image_mime "text/plain"
    [[ $status -eq 1 ]]
}

@test "attachments: is_binary_file returns 1 for text file" {
    test_file="$BATS_TEST_TMPDIR/test.txt"
    echo "Hello World" > "$test_file"
    
    run is_binary_file "$test_file"
    [[ $status -eq 1 ]]
}

@test "attachments: get_content_category returns text for .txt file" {
    test_file="$BATS_TEST_TMPDIR/test.txt"
    echo "Hello World" > "$test_file"
    
    result=$(get_content_category "$test_file")
    [[ "$result" == "text" ]]
}

@test "attachments: build_mixed_content with text only" {
    test_file="$BATS_TEST_TMPDIR/test.txt"
    echo "Hello World" > "$test_file"
    
    result=$(build_mixed_content "My prompt" "$test_file")
    [[ $(echo "$result" | jq '.[0].type') == '"text"' ]]
    [[ $(echo "$result" | jq '.[0].text') == '"My prompt\n\n--- Attached file: test.txt ---\nHello World\n--- End of test.txt ---"' ]]
}

@test "attachments: build_mixed_content with no attachments" {
    result=$(build_mixed_content "My prompt")
    [[ $(echo "$result" | jq length) -eq 1 ]]
    [[ $(echo "$result" | jq '.[0].type') == '"text"' ]]
    [[ $(echo "$result" | jq '.[0].text') == '"My prompt"' ]]
}

@test "attachments: provider_supports_multimodal returns 0 for openai" {
    run provider_supports_multimodal "openai"
    [[ $status -eq 0 ]]
}

@test "attachments: provider_supports_multimodal returns 0 for openrouter" {
    run provider_supports_multimodal "openrouter"
    [[ $status -eq 0 ]]
}

@test "attachments: provider_supports_multimodal returns 0 for anthropic" {
    run provider_supports_multimodal "anthropic"
    [[ $status -eq 0 ]]
}

@test "attachments: provider_supports_multimodal returns 1 for ollama" {
    run provider_supports_multimodal "ollama"
    [[ $status -eq 1 ]]
}

@test "attachments: provider_supports_multimodal returns 1 for unknown provider" {
    run provider_supports_multimodal "unknown"
    [[ $status -eq 1 ]]
}
