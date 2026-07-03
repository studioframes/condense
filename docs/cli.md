# CLI Guide

The Condense CLI is available through the package entry point and can be used to optimize files or directories from the terminal.

## Typical commands

```bash
npx @studioframes/condense optimize ./src -o ./dist -m balanced
```

To see all commands see [COMMANDS.md](../COMMANDS.md)

## Common options

- --method or -m selects the optimization mode
- -o sets the output directory
- input paths can point to a file or a directory

## Notes

The CLI is intended for local automation and batch optimization workflows, while the programmatic API is better suited for application integrations.
