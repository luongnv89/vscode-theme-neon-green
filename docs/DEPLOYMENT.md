# Deployment

## Publishing to VS Code Marketplace

### Prerequisites

1. A [Visual Studio Marketplace](https://marketplace.visualstudio.com/) publisher account
2. A Personal Access Token (PAT) from [Azure DevOps](https://dev.azure.com/)
3. `@vscode/vsce` installed globally: `npm install -g @vscode/vsce`

### Steps

```bash
# Login with your publisher account
vsce login luongnv89

# Package the extension
vsce package

# Publish to the marketplace
vsce publish
```

### Version Bumping

```bash
# Patch release (1.0.0 -> 1.0.1)
vsce publish patch

# Minor release (1.0.0 -> 1.1.0)
vsce publish minor

# Major release (1.0.0 -> 2.0.0)
vsce publish major
```

## Publishing to Open VSX Registry

For VS Code-compatible editors (VSCodium, etc.):

```bash
npm install -g ovsx
ovsx publish -p <token>
```

## Manual Distribution

Package the extension and distribute the `.vsix` file:

```bash
vsce package
# Share neon-green-theme-x.x.x.vsix
```

Users install via:

```bash
code --install-extension neon-green-theme-x.x.x.vsix
```
