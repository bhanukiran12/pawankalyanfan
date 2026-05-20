# Stop all Node dev servers (run before restarting services on Windows)
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All Node processes stopped."
