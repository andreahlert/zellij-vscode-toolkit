# Changelog

## [0.1.8] - 2026-03-22

### Fixed

- Brace counting inside strings no longer corrupts diagnostic and color provider state
- Block comment tracking now handles multi-line and mid-line `/* */` correctly
- Action validation no longer produces false positives on PascalCase words inside strings
- Diagnostic ranges now point to the correct column positions
- Stack underflow guard on malformed KDL with extra closing braces
- Regex injection risk in dynamic patterns from node names
- Unhandled promise rejection in auto-detection language switch
- `openExternal` result now provides user feedback on failure
- Removed quotes from bracket matching config (not structural pairs)

### Added

- Error boundaries with stack trace logging on all providers
- Output channel ("Zellij Config") for debugging extension issues
- `provideColorPresentations` error handling

### Improved

- Config auto-detection restricted to known Zellij paths (no longer matches any directory named "zellij")
- Content-based detection limited to first 200 lines for performance
- Layout file detection limited to first 100 lines
- Removed unused variables across providers

## [0.1.0] - 2024-01-01

### Added

- KDL syntax highlighting for Zellij configuration and layout files
- Autocompletion for all config options, actions, modes, layout elements, and plugins
- Hover documentation with descriptions, valid values, examples, and doc links
- Real-time validation and diagnostics for config errors
- Inline color decorators for hex colors in theme definitions
- Snippets for common config patterns (config, keybinds, themes, layouts, plugins)
- Auto-detection of Zellij KDL files based on path, content, and marker comments
- "Zellij: Set as Zellij Config" command for manual language association
- "Zellij: Open Documentation" command
