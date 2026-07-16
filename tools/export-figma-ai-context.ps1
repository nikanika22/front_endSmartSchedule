param(
  [string]$OutputPath = "figma-ai-project-context.md"
)

$ErrorActionPreference = 'Stop'

# Source and configuration that help an AI reproduce the product UI. Generated,
# dependency and VCS files are intentionally excluded.
$excludedDirectories = @('.git', 'node_modules', 'dist', 'build', 'coverage', '.grapuco')
$includedExtensions = @('.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.sass', '.less', '.html', '.md', '.json', '.yml', '.yaml', '.svg')
$rootFiles = @(
  'package.json', 'README.md', 'index.html', 'vite.config.ts', 'eslint.config.js',
  'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', '.gitignore'
)

function Get-RelativePath([string]$Path) {
  return [IO.Path]::GetRelativePath((Get-Location).Path, $Path).Replace('\', '/')
}

function Get-Language([string]$Extension) {
  switch ($Extension.ToLowerInvariant()) {
    '.tsx' { 'tsx' }
    '.ts' { 'typescript' }
    '.jsx' { 'jsx' }
    '.js' { 'javascript' }
    '.scss' { 'scss' }
    '.sass' { 'sass' }
    '.less' { 'less' }
    '.yml' { 'yaml' }
    '.yaml' { 'yaml' }
    default { $Extension.TrimStart('.') }
  }
}

$output = [IO.Path]::GetFullPath($OutputPath)
$outputRelative = Get-RelativePath $output
$files = New-Object System.Collections.Generic.List[System.IO.FileInfo]
foreach ($name in $rootFiles) {
  if (Test-Path -LiteralPath $name -PathType Leaf) {
    $files.Add((Get-Item -LiteralPath $name))
  }
}

Get-ChildItem -Path . -File -Recurse | Where-Object {
  $relative = Get-RelativePath $_.FullName
  $segments = $relative -split '/'
  $notExcluded = -not ($segments | Where-Object { $_ -in $excludedDirectories })
  $notExcluded -and $_.Extension.ToLowerInvariant() -in $includedExtensions -and
    $relative -notin $rootFiles -and $relative -ne $outputRelative
} | Sort-Object FullName | ForEach-Object { $files.Add($_) }

$assetFiles = Get-ChildItem -Path public,src -File -Recurse -ErrorAction SilentlyContinue | Where-Object {
  $_.Extension.ToLowerInvariant() -in @('.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.otf')
} | Sort-Object FullName

$builder = [Text.StringBuilder]::new()
[void]$builder.AppendLine('# SmartSchedule — Full UI Code Context')
[void]$builder.AppendLine()
[void]$builder.AppendLine('This is an automatically generated, read-only context file for an AI design tool.')
[void]$builder.AppendLine('Use it to infer screens, navigation, permission-based roles, components, states, and styling.')
[void]$builder.AppendLine('Excluded: dependency folders, Git data, generated builds, and environment-secret values.')
[void]$builder.AppendLine()
[void]$builder.AppendLine('## Instructions for the design AI')
[void]$builder.AppendLine()
[void]$builder.AppendLine('- Reconstruct every web screen and its responsive layout from the code below.')
[void]$builder.AppendLine('- Preserve role-based navigation and permissions represented in routes, guards, and feature code.')
[void]$builder.AppendLine('- Treat source code as the functional specification; do not invent missing pages or roles.')
[void]$builder.AppendLine('- Reuse referenced assets when provided; binary assets are listed in the manifest only.')
[void]$builder.AppendLine()
[void]$builder.AppendLine('## Included file index')
[void]$builder.AppendLine()
foreach ($file in $files) { [void]$builder.AppendLine("- ``$(Get-RelativePath $file.FullName)``") }
[void]$builder.AppendLine()
[void]$builder.AppendLine('## Source files')

foreach ($file in $files) {
  $relative = Get-RelativePath $file.FullName
  $language = Get-Language $file.Extension
  $content = Get-Content -LiteralPath $file.FullName -Raw
  [void]$builder.AppendLine()
  [void]$builder.AppendLine("## ``$relative``")
  [void]$builder.AppendLine()
  [void]$builder.AppendLine("~~~$language")
  [void]$builder.AppendLine($content.TrimEnd())
  [void]$builder.AppendLine('~~~')
}

[void]$builder.AppendLine()
[void]$builder.AppendLine('## Binary asset manifest')
[void]$builder.AppendLine()
if ($assetFiles.Count -eq 0) {
  [void]$builder.AppendLine('No binary UI assets found.')
} else {
  foreach ($asset in $assetFiles) {
    [void]$builder.AppendLine("- ``$(Get-RelativePath $asset.FullName)`` ($($asset.Length) bytes)")
  }
}

[IO.File]::WriteAllText($output, $builder.ToString(), [Text.UTF8Encoding]::new($false))
Write-Host "Created $output with $($files.Count) text files and $($assetFiles.Count) binary asset references."
