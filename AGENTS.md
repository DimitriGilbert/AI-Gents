# AI-Gents

A sophisticated bash-based AI chat interface supporting multiple LLM providers with agents, streaming, and parallel processing.

## Project Structure

This repository contains two main components:
- **Root**: Bash-based CLI tool (`ai` command)
- **`site/`**: Next.js web application (T3 Stack) for documentation/UI

## Test Commands

This project uses **BATS** (Bash Automated Testing System) for testing.

```bash
# Run all tests
bats tests/

# Run specific test file
bats tests/unit/validation.bats
bats tests/security/blacklist.bats
bats tests/integration/commands.bats

# Run single test by name filter
bats tests/unit/validation.bats -f "temperature"
bats tests/unit/validation.bats -f "validate_temperature: accepts"

# Run with verbose output
bats -t tests/
bats --verbose-run tests/

# Run with TAP format
bats --tap tests/
```

## Dependencies

Required: `bash 4.3+`, `jq`, `yq`, `curl`, `bc`
Optional: `rlwrap` (for interactive chat)
Test framework: `bats-core`

## Code Style Guidelines

### Variable Naming (Strict Conventions)

| Type                       | Pattern                         | Example                            |
| -------------------------- | ------------------------------- | ---------------------------------- |
| CLI Arguments (parseArger) | `_arg_<name>`                   | `_arg_prompt=""`, `_arg_model=""`  |
| Positional Arguments       | `_arg_<name>` or `_positionals` | `_positionals=()`                  |
| Local Variables            | `lowercase_with_underscores`    | `local config_dir="$HOME/.config"` |
| Constants                  | `UPPERCASE_WITH_UNDERSCORES`    | `readonly MAX_RETRIES=3`           |
| Private/Internal           | `_<lowercase>`                  | `_cache=()`, `_verbose_level="0"`  |
| Global Arrays              | `UPPERCASE`                     | `COMMAND_BLACKLIST=()`             |

### Exit Codes

Use standardized exit codes from `src/bash/lib/errors`:

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

### Error Handling Pattern

```bash
# Use die() for fatal errors
die "Invalid temperature: $temp" $E_VALIDATION_ERROR

# Use require_cmds to check dependencies
require_cmds jq yq curl

# Use try/catch for recoverable operations
try "risky_operation" handle_error || fallback_operation

# Set up interrupt handlers
setup_interrupt_handler
```

### File Organization

**Script structure:**

```bash
#!/bin/bash
# @parseArger-begin (generated CLI parsing markers)
# ... parseArger declarations ...
# @parseArger-end

# Set script directory
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

# Source libraries (order matters: core → validation → security → providers)
source "$_SCRIPT_DIR/lib/core"
source "$_SCRIPT_DIR/lib/validation"
source "$_SCRIPT_DIR/lib/security"
source "$_SCRIPT_DIR/lib/providers/_loader"

# Main logic
main() {
    load_command_blacklist
    validate_all_llm_params
    # ... implementation
}

main "$@"
```

### File Naming

- **No `.sh` extensions** - scripts should be executable without extension
- Lowercase with underscores for multi-word names (e.g., `command_blacklist`)
- Provider files use provider name directly (e.g., `openai`, `openrouter`)

### Library Sourcing

```bash
# Standard library loading pattern
source_lib() {
    local lib_name="$1"
    source "$_LIB_DIR/$lib_name"
}

# In tests, use: load test_helper
# Then: source_lib "validation"
```

### Shellcheck Directives

Use inline directives (no config file):

```bash
# shellcheck source=$HOME/.config/ai-gents/config
source "$AI_USER_CONFIG_DIR/config"

# shellcheck disable=SC2145
echo "DEBUG: $0 $@"
```

### Test Patterns

```bash
#!/usr/bin/env bats
load test_helper

setup() {
    source_lib "validation"
    source_lib "core"
}

@test "function_name: describes the test" {
    run function_name "argument"
    [[ $status -eq 0 ]]
    [[ "$output" == *"expected"* ]]
}
```

## Architecture

- **Modular library system**: `lib/core`, `lib/validation`, `lib/security`, `lib/api`, `lib/parallel`, `lib/errors`
- **Provider plugin system**: Dynamic loading of LLM providers in `lib/providers/`
- **parseArger-generated CLI**: Commands use parseArger markers for argument parsing
- **Agent system**: YAML-based agent configuration in `~/.config/ai-gents/agents/`

## Configuration Directories

```bash
export AI_USER_CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/ai-gents"
# Subdirectories: agents/, credentials/
# Files: command-blacklist, config
```

## Site (Next.js App)

The `site/` directory contains a Next.js 16 application using the T3 Stack:

**IMPORTANT: All site/ commands below MUST be run from the `site/` directory.**

### Site Commands

```bash
# Development
cd site && bun run dev

# Build
cd site && bun run build

# Linting and formatting
cd site && bun run lint
cd site && bun run lint:fix
cd site && bun run format:write
cd site && bun run format:check
cd site && bun run typecheck

# Deploy to GitHub Pages
cd site && bun run do-the-site
```

### Site Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Types**: TypeScript 5 with strict mode
- **Package Manager**: Bun
- **Deployment**: GitHub Pages (static export)

## Progressive Disclosure

- **Coding Standards**: docs/CODING_STANDARDS (detailed variable naming)
- **Architecture**: docs/ARCHITECTURE.md
- **Security**: docs/SECURITY.md
- **Provider Development**: docs/PROVIDER_DEVELOPMENT.md
