# AI-Gents Test Suite

This directory contains the BATS (Bash Automated Testing System) test suite for AI-Gents.

## Installation

### Install BATS

**macOS:**
```bash
brew install bats-core
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get install bats
```

**From source:**
```bash
git clone https://github.com/bats-core/bats-core.git
cd bats-core
./install.sh /usr/local
```

## Running Tests

### Run all tests:
```bash
bats tests/
```

### Run specific test file:
```bash
bats tests/unit/validation.bats
bats tests/security/blacklist.bats
bats tests/integration/commands.bats
```

### Run with verbose output:
```bash
bats -t tests/
```

### Run with TAP format:
```bash
bats --tap tests/
```

## Test Structure

```
tests/
├── test_helper.bash      # Common test utilities and setup
├── unit/                 # Unit tests for individual functions
│   ├── validation.bats   # Tests for validation library
│   └── ...
├── security/             # Security-focused tests
│   └── blacklist.bats    # Tests for blacklist system
└── integration/          # Integration tests
    └── commands.bats     # Tests for command workflows
```

## Writing Tests

### Basic test structure:

```bash
#!/usr/bin/env bats

load test_helper

setup() {
    # Runs before each test
    setup
    source_lib "validation"
}

teardown() {
    # Runs after each test
    teardown
}

@test "description of what this test checks" {
    run some_command
    [[ $status -eq 0 ]]
    [[ "$output" == "expected output" ]]
}
```

### Available helpers:

- `setup()` - Initialize test environment with temp directory
- `teardown()` - Clean up test environment
- `source_lib <name>` - Source a library file (e.g., `source_lib "validation"`)
- `create_test_agent <name> [prompt] [provider] [model]` - Create mock agent
- `create_test_credential <provider> [key]` - Create mock credential file
- `create_test_blacklist [patterns]` - Create mock blacklist file
- `random_string [length]` - Generate random string for unique IDs
- `skip_if_no_dependency <cmd>` - Skip test if dependency missing

### Assertions:

- `[[ $status -eq 0 ]]` - Command succeeded
- `[[ $status -ne 0 ]]` - Command failed
- `[[ "$output" == "expected" ]]` - Output equals expected
- `[[ "$output" == *"substring"* ]]` - Output contains substring
- `[[ -f "$file" ]]` - File exists
- `[[ -d "$dir" ]]` - Directory exists

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml (GitHub Actions example)
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install BATS
        run: sudo apt-get install -y bats
      - name: Run tests
        run: bats tests/
```

## Debugging Failed Tests

1. **Run single test:**
   ```bash
   bats tests/unit/validation.bats -f "temperature"
   ```

2. **Add debug output:**
   ```bash
   @test "example" {
       run some_command
       echo "Exit code: $status"  # This will be shown on failure
       echo "Output: $output"
       [[ $status -eq 0 ]]
   }
   ```

3. **Use --verbose-run:**
   ```bash
   bats --verbose-run tests/
   ```

## Best Practices

1. **Independent tests**: Each test should be independent and not rely on state from other tests
2. **Use setup/teardown**: Initialize and clean up in these hooks
3. **Descriptive names**: Test descriptions should explain what's being tested
4. **One assertion per test**: Focus on testing one thing per test
5. **Skip unavailable tests**: Use `skip_if_no_dependency` for optional dependencies
6. **Mock external calls**: Don't hit real APIs in unit tests

## Coverage

- **Unit Tests**: Individual function validation
- **Security Tests**: Blacklist, injection prevention
- **Integration Tests**: Full command workflows

## Known Limitations

- Some tests require `yq` to be installed (YAML processing)
- API integration tests are mocked (no real network calls)
- Provider discovery tests may fail if providers aren't executable
