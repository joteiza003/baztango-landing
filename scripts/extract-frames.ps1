# Re-extrae la secuencia de frames desde assets/web.mp4
# Uso: .\scripts\extract-frames.ps1 [-Width 1920] [-Quality 3]
param(
  [int]$Width = 1920,
  [int]$Quality = 3,
  [int]$FrameStep = 5
)

$root = Split-Path $PSScriptRoot -Parent
$video = Join-Path $root "assets\web.mp4"
$out = Join-Path $root "assets\frames"
$tmp = Join-Path $root "assets\frames_tmp"

if (-not (Test-Path $video)) { throw "No se encuentra $video" }

New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Write-Host "Extrayendo frames ${Width}px (1 de cada $FrameStep)..." -ForegroundColor Cyan

$vf = "select='not(mod(n\,$FrameStep))',scale=${Width}:-2:flags=lanczos"
ffmpeg -y -i $video -vf $vf -vsync vfr -q:v $Quality -start_number 0 "$tmp\f%04d.jpg"
if ($LASTEXITCODE -ne 0) { throw "ffmpeg falló" }

$backup = Join-Path $root "assets\frames_backup_$(Get-Date -Format 'yyyyMMdd_HHmm')"
if (Test-Path $out) { Rename-Item $out $backup; Write-Host "Backup: $backup" }
Rename-Item $tmp $out

$stats = Get-ChildItem $out -Filter *.jpg | Measure-Object -Property Length -Sum
Write-Host "Listo: $($stats.Count) frames · $([math]::Round($stats.Sum/1MB,1)) MB" -ForegroundColor Green