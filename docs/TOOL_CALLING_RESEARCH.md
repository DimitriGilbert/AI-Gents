# Tool Calling API Research Reference

## Standardized Internal Format

All providers must convert TO/FROM this internal format for consistency:

### Tool Definition (Input)
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

### Tool Call (Output from provider_parse_tool_calls)
```json
[
  {
    "id": "call_abc123",
    "name": "tool_name",
    "arguments": "{\"param\": \"value\"}"
  }
]
```

## Provider-Specific Formats

### OpenAI
**API Documentation:** https://platform.openai.com/docs/guides/function-calling

**Request - Tools Parameter:**
```json
{
  "model": "gpt-4o",
  "messages": [...],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string"}
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

**Response - Assistant with Tool Calls:**
```json
{
  "role": "assistant",
  "content": null,
  "tool_calls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"location\": \"Paris\"}"
      }
    }
  ]
}
```

**Tool Result Message:**
```json
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "{\"temperature\": 25, \"unit\": \"C\"}"
}
```

**Key Points:**
- Uses `tools` parameter (not `functions` - that's deprecated)
- Response has `tool_calls` array with unique `id` per call
- Tool result uses `role: "tool"` with `tool_call_id` matching the call
- Supports multiple parallel tool calls

---

### Anthropic Claude
**API Documentation:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use

**Request - Tools Parameter:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {"type": "string"}
        },
        "required": ["location"]
      }
    }
  ],
  "messages": [...]
}
```

**Response - Assistant with Tool Use:**
```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the weather for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01ABC123",
      "name": "get_weather",
      "input": {"location": "Paris"}
    }
  ]
}
```

**Tool Result Message:**
```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01ABC123",
      "content": "Current temperature in Paris is 25°C"
    }
  ]
}
```

**Key Points:**
- Uses `input_schema` instead of `parameters`
- Content is an array of blocks (text, tool_use, etc.)
- Tool call has `input` (parsed JSON) not `arguments` (string)
- Tool result goes in `role: "user"` with `tool_result` block type
- Result uses `tool_use_id` to match the call

---

### Ollama
**API Documentation:** https://docs.ollama.com/capabilities/tool-calling

**Request - Tools Parameter:**
```json
{
  "model": "qwen3",
  "messages": [...],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "add",
        "description": "Add two numbers",
        "parameters": {
          "type": "object",
          "required": ["a", "b"],
          "properties": {
            "a": {"type": "integer"},
            "b": {"type": "integer"}
          }
        }
      }
    }
  ],
  "stream": false
}
```

**Response - Assistant with Tool Calls:**
```json
{
  "message": {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "function": {
          "name": "add",
          "arguments": {"a": 11434, "b": 12341}
        }
      }
    ]
  }
}
```

**Tool Result Message:**
```json
{
  "role": "tool",
  "tool_name": "add",
  "content": "23775"
}
```

**Key Points:**
- Similar to OpenAI format but simplified
- Uses `tool_calls` array
- Arguments are parsed JSON object (not string)
- Tool result uses `role: "tool"` with `tool_name` (not `tool_call_id`)
- No unique ID tracking for tool calls
- NOTE: Ollama API is evolving, check latest docs

---

### OpenRouter
**Behavior:** Pass-through to underlying provider

**Key Points:**
- Accepts standard OpenAI format (`tools`, `tool_calls`)
- Routes to actual provider (OpenAI, Anthropic, etc.) and normalizes response
- Should work with OpenAI-compatible tool format
- Headers for attribution already implemented (HTTP-Referer, X-Title)

**Implementation:**
- Use standard OpenAI format for requests
- Parse standard OpenAI format from responses
- OpenRouter handles provider-specific conversions internally

---

## Function Mapping by Provider

### provider_format_tools(tools_json)

| Provider | Input | Output | Notes |
|----------|-------|--------|-------|
| OpenAI | Standard | Pass-through | Same format |
| Anthropic | Standard | Convert `parameters` → `input_schema` | Remove `type: "function"` wrapper |
| Ollama | Standard | Pass-through | Similar to OpenAI |
| OpenRouter | Standard | Pass-through | OpenAI format |

### provider_parse_tool_calls(response)

| Provider | Source Path | Output Format | Notes |
|----------|-------------|---------------|-------|
| OpenAI | `.choices[0].message.tool_calls[]` | `[{id, name, arguments}]` | arguments is JSON string |
| Anthropic | `.content[]` select `type: "tool_use"` | `[{id, name, arguments}]` | Convert `input` to JSON string for `arguments` |
| Ollama | `.message.tool_calls[]` | `[{id, name, arguments}]` | Generate fake ID (no ID in response), arguments is JSON string |
| OpenRouter | `.choices[0].message.tool_calls[]` | `[{id, name, arguments}]` | Same as OpenAI |

### provider_format_tool_result(id, name, result)

| Provider | Output Format | Notes |
|----------|---------------|-------|
| OpenAI | `{"role": "tool", "tool_call_id": id, "content": result}` | Standard |
| Anthropic | `{"role": "user", "content": [{"type": "tool_result", "tool_use_id": id, "content": result}]}` | Content blocks array |
| Ollama | `{"role": "tool", "tool_name": name, "content": result}` | Uses name, not ID |
| OpenRouter | `{"role": "tool", "tool_call_id": id, "content": result}` | Same as OpenAI |

## Implementation Notes

### Tool Call ID Generation
- OpenAI/Anthropic: Use ID from API response
- Ollama: Generate unique ID (e.g., `call_$(date +%s%N)`)

### Arguments Format
- Standard internal: JSON string (e.g., `'{"key": "value"}'`)
- Anthropic: Parse from `input` object
- Ollama: Convert `arguments` object to JSON string

### Message Role for Tool Results
- OpenAI/OpenRouter/Ollama: `role: "tool"`
- Anthropic: `role: "user"` with content blocks

## Current AI-Gents Status

### What Works Now
- OpenAI provider has `provider_parse_function_call()` that checks both old and new formats
- Payload building accepts `tools` parameter
- Basic single tool call execution (legacy format)

### What's Broken
- Uses legacy `function_call` and `role: "function"` in conversation
- No `tool_call_id` tracking
- No multi-tool call support
- Anthropic has NO tool support implemented
- Inconsistent parameter naming (`functions` vs `tools` in some paths)

## Files to Reference

- `src/bash/lib/providers/_base` - Base interface (lines 1-166)
- `src/bash/lib/providers/openai` - Has some tool parsing (lines 121-150)
- `src/bash/lib/providers/anthropic` - NO tool support
- `src/bash/lib/providers/ollama` - NO tool support researched
- `src/bash/lib/providers/openrouter` - Headers only, no tool specifics
- `src/bash/ask` - Main script with legacy tool handling (lines 565-633)
