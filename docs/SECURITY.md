# AI-Gents Security Guide

This document describes the security features and best practices for AI-Gents.

## Overview

AI-Gents follows a **"power++ user"** security model:
- Users are assumed to be advanced terminal users
- Empty security restrictions by default
- User-configurable security controls
- No hand-holding, full user responsibility

## Security Features

### 1. Command Blacklist System

The primary security mechanism is a user-configurable command blacklist.

#### How It Works

When a prompt contains `#!/command;` syntax:
1. Command is extracted from the prompt
2. Checked against blacklist patterns
3. Blocked commands show `[BLOCKED]` in output
4. Allowed commands are executed
5. Output replaces the command in the prompt

#### Configuration

Create `~/.config/ai-gents/command-blacklist`:

```bash
# Example blacklist file
# Patterns are bash regular expressions

# Dangerous file operations
rm[[:space:]]+-rf[[:space:]]+/
rm[[:space:]]+-rf[[:space:]]+/.*

# Filesystem operations
mkfs\.
mkfs\.ext[0-9]+
mkfs\.xfs
mkfs\.btrfs

# Disk operations
dd[[:space:]]+if=.*of=/dev
.*[[:space:]]>[[:space:]]+/dev/sd[a-z].*
.*[[:space:]]>[[:space:]]+/dev/null.*

# Network operations
curl.*[>|].*/etc/
wget.*[>|].*/etc/

# Privilege escalation
sudo[[:space:]]+rm
sudo[[:space:]]+dd
su[[:space:]]+-

# System modifications
echo[[:space:]]+.*[[:space:]]+>[[:space:]]+/etc/
chmod[[:space:]]+.*[[:space:]]+/etc/
chown[[:space:]]+.*[[:space:]]+/etc/
```

#### Pattern Format

- Bash extended regular expressions
- One pattern per line
- Empty lines and lines starting with `#` are ignored
- Patterns match anywhere in the command

#### Examples

```bash
# Match "rm -rf /" and variations
rm.*-rf.*/

# Match "dd if=... of=/dev/..."
dd[[:space:]]+if=.*of=/dev

# Match output redirection to /dev
.*[[:space:]]>[[:space:]]+/dev
```

### 2. Input Validation

All LLM parameters are validated before use:

| Parameter | Validation |
|-----------|-----------|
| temperature | 0.0 to 2.0 |
| top_p | 0.0 to 1.0 |
| max_tokens | Positive integer, max 100000 |
| frequency_penalty | -2.0 to 2.0 |
| presence_penalty | -2.0 to 2.0 |
| seed | Non-negative integer |
| provider | Must match available plugin |

Invalid parameters cause immediate exit with error code 7 (E_VALIDATION_ERROR).

### 3. YAML Safety

Agent creation uses safe YAML generation:

```bash
# SAFE: Uses yq --arg (parameter passing)
yq --arg name "$name" ".name = \$name" "$template"

# UNSAFE: String interpolation (NEVER DO THIS)
yq ".name = \"$name\"" "$template"  # Vulnerable to injection
```

All agent YAML files are generated using `yq --arg` to prevent YAML injection.

### 4. Credential Handling

API keys are handled securely:

#### Storage Options

1. **Environment Variables** (preferred for CI/automation)
   ```bash
   export AI_OPENAI_API_KEY="sk-..."
   ```

2. **Credential Files** (preferred for interactive use)
   ```bash
   mkdir -p ~/.config/ai-gents/credentials
   echo "sk-..." > ~/.config/ai-gents/credentials/openai
   chmod 600 ~/.config/ai-gents/credentials/openai
   ```

#### Security Notes

- Credentials are never logged
- Not shown in process lists (passed via files or env)
- File permissions should be 600 (owner read/write only)
- No encryption (by design - users manage their own security)

### 5. Command Injection Prevention

Multiple layers protect against command injection:

1. **Blacklist filtering** - Blocks dangerous patterns
2. **Double-check** - Commands checked before execution
3. **No eval()** - Commands executed directly, not through eval
4. **Safe parsing** - Command parsing preserves quoting

## Security Best Practices

### For Users

1. **Configure your blacklist** based on your risk tolerance:
   ```bash
   # Start with basics
cat > ~/.config/ai-gents/command-blacklist << 'EOF'
rm[[:space:]]+-rf[[:space:]]+/
mkfs\.
dd[[:space:]]+if=.*of=/dev
EOF
   ```

2. **Review commands before execution** - AI may suggest commands
3. **Use credential files** with proper permissions
4. **Keep your system updated** - Bash, curl, jq, yq
5. **Monitor your config** - Regularly review `~/.config/ai-gents/`

### For Developers

1. **Never use eval()** with user input
2. **Always validate** all inputs
3. **Use yq --arg** for YAML generation
4. **Never log credentials**
5. **Follow the coding standards** (see CODING_STANDARDS)
6. **Add tests** for security features

## Threat Model

### Trusted Components

- User (power++ class terminal user)
- Local filesystem
- LLM providers (APIs)

### Untrusted Components

- LLM responses (may contain malicious suggestions)
- Prompt content from external sources
- Agent configurations from untrusted sources

### Attack Scenarios

#### 1. Prompt Injection via Command Execution

**Attack**: User pastes malicious prompt: `#!/rm -rf /;`

**Defense**: Blacklist blocks the command, shows `[BLOCKED]`

#### 2. YAML Injection in Agent Creation

**Attack**: Agent name contains YAML injection: `name: "value\nmalicious: true"`

**Defense**: `yq --arg` prevents interpretation of special characters

#### 3. Credential Exposure

**Attack**: Process listing shows API keys in command line

**Defense**: Keys passed via files or environment, not command line arguments

#### 4. Parameter Injection

**Attack**: Invalid temperature value attempts buffer overflow

**Defense**: Input validation rejects non-numeric values

## Security Checklist

### For New Installations

- [ ] Review default configuration
- [ ] Create appropriate blacklist for your use case
- [ ] Set up credential files with proper permissions
- [ ] Review agent configurations
- [ ] Test blacklist with sample commands

### For Production Use

- [ ] Document your security model
- [ ] Train users on command execution risks
- [ ] Regular security reviews
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

## Reporting Security Issues

If you discover a security vulnerability:

1. Do not open a public issue
2. Contact the maintainer directly
3. Provide detailed reproduction steps
4. Allow time for remediation before disclosure

## Security vs Usability

AI-Gents prioritizes **user control over hand-holding**:

- Empty blacklist by default
- No automatic restrictions
- User configures their own security
- Full responsibility on the user

This model assumes:
- Users understand their system
- Users can assess risks
- Users want control, not protection

If you prefer more restrictive defaults, configure them in your `command-blacklist`.

## References

- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [OWASP YAML Injection](https://owasp.org/www-community/vulnerabilities/Unsafe_Deserialization)
- [Bash Regular Expressions](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)

## Changelog

### Version 2.0
- Added command blacklist system
- Removed unsafe eval() usage
- Added input validation framework
- Implemented YAML safety with yq --arg
- Standardized error handling with security codes