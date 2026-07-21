# ============================================================
# TOKIYO STORE — Database Backup Automation Script (Windows PowerShell)
# ============================================================

# Configuration variables
$DB_HOST = "db.your-supabase-reference.supabase.co"
$DB_PORT = "5432"
$DB_NAME = "postgres"
$DB_USER = "postgres"
$BACKUP_DIR = "./backups"

# Ensure backup directory exists
if (!(Test-Path -Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Force -Path $BACKUP_DIR | Out-Null
}

$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$OUTPUT_FILE = "$BACKUP_DIR/tokiyo_store_backup_$TIMESTAMP.sql"

Write-Host "--------------------------------------------------------" -ForegroundColor Green
Write-Host "Starting Tokiyo Store Supabase Database Backup..." -ForegroundColor Green
Write-Host "Target: $OUTPUT_FILE" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Green

# Check if pg_dump is installed
if (!(Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: 'pg_dump' utility not found in PATH." -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools or run directly via Supabase CLI:" -ForegroundColor Cyan
    Write-Host "supabase db dump --project-ref <project-id> -f $OUTPUT_FILE" -ForegroundColor Cyan
    Exit
}

# Run pg_dump (Password will be prompted or read from PG_PASSWORD env variable)
try {
    & pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f $OUTPUT_FILE
    Write-Host "Backup completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error occurred during backup: $_" -ForegroundColor Red
}
