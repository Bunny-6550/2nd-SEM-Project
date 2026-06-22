<#
Creates a virtual environment and installs required Python packages.
Usage:
  PowerShell: .\setup_backend.ps1
#>

$venvDir = "venv"
if (-Not (Test-Path $venvDir)) {
  Write-Host "Creating virtual environment in $venvDir..."
  python -m venv $venvDir
}

Write-Host "Installing requirements from requirements.txt..."
& $venvDir\Scripts\pip.exe install --upgrade pip
& $venvDir\Scripts\pip.exe install -r requirements.txt

Write-Host "Setup complete. Activate the venv with: .\venv\Scripts\Activate.ps1"
