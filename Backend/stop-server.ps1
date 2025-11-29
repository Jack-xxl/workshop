# PowerShell script to stop the backend server on port 3100

Write-Host "Looking for processes using port 3100..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 3100 -ErrorAction SilentlyContinue

if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    Write-Host "Found processes: $($pids -join ', ')" -ForegroundColor Cyan
    
    foreach ($pid in $pids) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping process $pid ($($process.ProcessName))..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "✓ Process $pid stopped" -ForegroundColor Green
        }
    }
    Write-Host "`nAll processes on port 3100 have been stopped." -ForegroundColor Green
} else {
    Write-Host "No processes found using port 3100." -ForegroundColor Green
}


