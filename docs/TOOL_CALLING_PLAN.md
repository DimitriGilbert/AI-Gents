# Tool Calling Modernization Plan

## Objective
Implement modern, provider-specific tool calling with proper tool use loops for AI-Gents CLI.

## User Requirements
1. Default system prompt ALWAYS used (with capabilities, date, program name)
2. Proper multi-turn tool use loop
3. Safe mode is opt-in (NOT default)
4. Provider-specific implementations (extend existing architecture)

## Primary Target
**OpenRouter** - User's primary provider (MUST WORK PERFECTLY)

## Secondary Targets (Subagent Delegation)
- OpenAI
- Anthropic  
- Ollama
- DeepSeek
- LMStudio
- Moonshot

## Architecture

### Base Provider Interface Extensions
Add to `src/bash/lib/providers/_base`:

```bash
# Format tools for provider API request
provider_format_tools() {
    local tools_json="$1"  # Standardized tools array
    # Return: Provider-specific tools format
}

# Parse tool calls from response (standardized output)
provider_parse_tool_calls() {
    local response="$1"
    # Return: [{"id": "...", "name": "...", "arguments": "..."}]
}

# Format tool result for conversation history
provider_format_tool_result() {
    local tool_call_id="$1"
    local tool_name="$2"
    local result="$3"
    # Return: Provider-specific message JSON
}

# Check if provider supports tool calling
provider_supports_tools() {
    # Return: 0 (yes) or 1 (no)
}
```

### Standardized Data Format

**Input Tools Format (Standardized):**
```json
[
  {
    "type": "function",
    "function": {
      "name": "tool_name",
      "description": "Tool description",
      "parameters": {
        "type": "object",
        "properties": {...},
        "required": [...]
      }
    }
  }
]
```

**Tool Calls Output Format (Standardized):**
```json
[
  {
    "id": "call_abc123",
    "name": "tool_name",
    "arguments": "{\"param\": \"value\"}"
  }
]
```

### Main Script Changes (`src/bash/ask`)

1. **Default System Prompt Function**
   - Add to `lib/core` or `lib/prompts`
   - Always prepended to user system prompt

2. **Tool Use Loop Implementation**
   - Replace `process_function_call()` with `execute_tool_loop()`
   - Loop structure:
     ```
     while has_tool_calls and iteration < max_iterations:
         send_request()
         if response.has_tool_calls:
             for each tool_call in response:
                 result = execute_tool(tool_call)
                 add_tool_result_to_conversation(tool_call.id, result)
         else:
             return content
     ```

3. **Provider Integration**
   - Use `provider_format_tools()` when building payload
   - Use `provider_parse_tool_calls()` to extract calls
   - Use `provider_format_tool_result()` to format results

## Implementation Phases

### Phase 1: Foundation (Base + OpenRouter)
**Owner:** Main agent (YOU)

1. Extend `_base` with tool functions
2. Update OpenRouter provider
3. Update `ask` script with tool loop and default prompt
4. Test end-to-end with OpenRouter

### Phase 2: OpenAI
**Owner:** Subagent

Implement OpenAI-specific tool handling:
- `provider_format_tools()`: Already supported in build_payload, verify
- `provider_parse_tool_calls()`: Parse `.choices[0].message.tool_calls[]`
- `provider_format_tool_result()`: `{"role": "tool", "tool_call_id": "...", "content": "..."}`

### Phase 3: Anthropic
**Owner:** Subagent

Implement Anthropic-specific tool handling:
- `provider_format_tools()`: Convert to Anthropic `tools` with `input_schema`
- `provider_parse_tool_calls()`: Parse `tool_use` content blocks
- `provider_format_tool_result()`: Format `tool_result` content block

### Phase 4: Ollama
**Owner:** Subagent

Research and implement Ollama tool format (if supported).

### Phase 5: Other Providers
**Owner:** Subagents as needed

DeepSeek, LMStudio, Moonshot.

## Files to Modify

### Core Changes
- `src/bash/lib/providers/_base` - Add tool interface functions
- `src/bash/lib/core` or new `src/bash/lib/prompts` - Default system prompt
- `src/bash/ask` - Tool loop and provider integration

### Provider Changes
- `src/bash/lib/providers/openrouter` - Implement tool functions
- `src/bash/lib/providers/openai` - Implement tool functions
- `src/bash/lib/providers/anthropic` - Implement tool functions
- `src/bash/lib/providers/ollama` - Research and implement
- (Others as needed)

## Success Criteria

1. OpenRouter shows correct app attribution (already done)
2. Default system prompt appears in EVERY request
3. Tool use loop executes multiple tool calls properly
4. Each provider handles its own format correctly
5. Safe mode remains opt-in (disabled by default)

## References

- See `docs/TOOL_CALLING_RESEARCH.md` for provider-specific API details
- See provider files in `src/bash/lib/providers/`
- See current implementation in `src/bash/ask` (lines 565-633, 785-835)
