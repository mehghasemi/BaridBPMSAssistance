$ErrorActionPreference = 'Stop'
$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$appUrl = 'http://127.0.0.1:5173/'

function Test-LocalApp {
  try {
    Invoke-WebRequest -Uri $appUrl -UseBasicParsing -TimeoutSec 1 | Out-Null
    return $true
  } catch {
    return $false
  }
}

try {
  Set-Location $appRoot
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js was not found. Install Node.js LTS, then run this launcher again.'
  }

  if (-not (Test-Path 'node_modules')) {
    Write-Host 'Installing application dependencies...'
    & npm install
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
  }

  Write-Host 'Preparing local data...'
  & npm run db:generate
  if ($LASTEXITCODE -ne 0) { throw 'Database client generation failed.' }
  & npm run db:push
  if ($LASTEXITCODE -ne 0) { throw 'Database setup failed.' }
  & npm run db:seed
  if ($LASTEXITCODE -ne 0) { throw 'Sample data setup failed.' }

  if (-not (Test-LocalApp)) {
    Write-Host 'Starting Formyar...'
    Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npm run dev -- --host 127.0.0.1' -WorkingDirectory $appRoot -WindowStyle Minimized
    $ready = $false
    for ($attempt = 0; $attempt -lt 15; $attempt++) {
      Start-Sleep -Seconds 1
      if (Test-LocalApp) { $ready = $true; break }
    }
    if (-not $ready) { throw 'The local server did not start within 15 seconds.' }
  }

  Start-Process $appUrl
  Write-Host 'Formyar opened in your default browser.'
  exit 0
} catch {
  Write-Host ''
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}
