#!/usr/bin/env bats
#
# Unit tests for validation library
#

load test_helper

setup() {
    source_lib "validation"
    source_lib "core"
}

@test "validate_temperature: accepts valid values" {
    run validate_temperature "0"
    [[ $status -eq 0 ]]
    
    run validate_temperature "0.5"
    [[ $status -eq 0 ]]
    
    run validate_temperature "1"
    [[ $status -eq 0 ]]
    
    run validate_temperature "1.5"
    [[ $status -eq 0 ]]
    
    run validate_temperature "2"
    [[ $status -eq 0 ]]
}

@test "validate_temperature: rejects values out of range" {
    run validate_temperature "-0.1"
    [[ $status -ne 0 ]]
    
    run validate_temperature "2.1"
    [[ $status -ne 0 ]]
    
    run validate_temperature "10"
    [[ $status -ne 0 ]]
}

@test "validate_temperature: rejects non-numeric values" {
    run validate_temperature "abc"
    [[ $status -ne 0 ]]
    
    run validate_temperature ""
    [[ $status -ne 0 ]]
    
    run validate_temperature "1.2.3"
    [[ $status -ne 0 ]]
}

@test "validate_top_p: accepts valid values" {
    run validate_top_p "0"
    [[ $status -eq 0 ]]
    
    run validate_top_p "0.5"
    [[ $status -eq 0 ]]
    
    run validate_top_p "1"
    [[ $status -eq 0 ]]
}

@test "validate_top_p: rejects values out of range" {
    run validate_top_p "-0.1"
    [[ $status -ne 0 ]]
    
    run validate_top_p "1.1"
    [[ $status -ne 0 ]]
}

@test "validate_max_tokens: accepts valid positive integers" {
    run validate_max_tokens "1"
    [[ $status -eq 0 ]]
    
    run validate_max_tokens "100"
    [[ $status -eq 0 ]]
    
    run validate_max_tokens "4096"
    [[ $status -eq 0 ]]
}

@test "validate_max_tokens: rejects invalid values" {
    run validate_max_tokens "0"
    [[ $status -ne 0 ]]
    
    run validate_max_tokens "-100"
    [[ $status -ne 0 ]]
    
    run validate_max_tokens "abc"
    [[ $status -ne 0 ]]
    
    run validate_max_tokens "100.5"
    [[ $status -ne 0 ]]
}

@test "validate_frequency_penalty: accepts valid range" {
    run validate_frequency_penalty "-2"
    [[ $status -eq 0 ]]
    
    run validate_frequency_penalty "0"
    [[ $status -eq 0 ]]
    
    run validate_frequency_penalty "2"
    [[ $status -eq 0 ]]
}

@test "validate_frequency_penalty: rejects out of range" {
    run validate_frequency_penalty "-2.1"
    [[ $status -ne 0 ]]
    
    run validate_frequency_penalty "2.1"
    [[ $status -ne 0 ]]
}

@test "validate_presence_penalty: accepts valid range" {
    run validate_presence_penalty "-2"
    [[ $status -eq 0 ]]
    
    run validate_presence_penalty "0"
    [[ $status -eq 0 ]]
    
    run validate_presence_penalty "2"
    [[ $status -eq 0 ]]
}

@test "validate_seed: accepts non-negative integers" {
    run validate_seed "0"
    [[ $status -eq 0 ]]
    
    run validate_seed "42"
    [[ $status -eq 0 ]]
    
    run validate_seed "123456789"
    [[ $status -eq 0 ]]
}

@test "validate_seed: rejects invalid values" {
    run validate_seed "-1"
    [[ $status -ne 0 ]]
    
    run validate_seed "abc"
    [[ $status -ne 0 ]]
    
    run validate_seed "3.14"
    [[ $status -ne 0 ]]
}

@test "validate_one_of: validates against allowed values" {
    run validate_one_of "apple" "apple" "banana" "cherry"
    [[ $status -eq 0 ]]
    
    run validate_one_of "banana" "apple" "banana" "cherry"
    [[ $status -eq 0 ]]
}

@test "validate_one_of: rejects invalid values" {
    run validate_one_of "grape" "apple" "banana" "cherry"
    [[ $status -ne 0 ]]
    
    run validate_one_of "" "apple" "banana"
    [[ $status -ne 0 ]]
}

@test "validate_param: dispatches to correct validator" {
    run validate_param "temperature" "0.7"
    [[ $status -eq 0 ]]
    
    run validate_param "temperature" "5"
    [[ $status -ne 0 ]]
    
    run validate_param "max_tokens" "100"
    [[ $status -eq 0 ]]
    
    run validate_param "unknown_param" "any_value"
    [[ $status -eq 0 ]]
}

@test "validate_yaml_safe: rejects unsafe characters" {
    run validate_yaml_safe "hello world"
    [[ $status -eq 0 ]]
    
    run validate_yaml_safe "test-value"
    [[ $status -eq 0 ]]
}

@test "validate_yaml_safe: rejects newlines and special chars" {
    run validate_yaml_safe $'line1\nline2'
    [[ $status -ne 0 ]]
}
