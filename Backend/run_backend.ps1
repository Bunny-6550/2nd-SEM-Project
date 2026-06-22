<#
Run the backend using the Python module interface so the `uvicorn` console script is not required.
Usage:
  PowerShell: .\run_backend.ps1
#>

$python = "python"

Write-Host "Starting backend with: $python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
& $python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
