$base = "backend\namenspruefungsservice"

$directories = @(
    "$base",
    "$base\src",
    "$base\src\handler",
    "$base\src\application",
    "$base\src\domain",
    "$base\src\domain\model",
    "$base\src\domain\rules",
    "$base\src\domain\adapters",
    "$base\src\utils",
    "$base\tests"
)

$files = @(
    "$base\README.md",
    "$base\openapi.yaml",
    "$base\package.json",
    "$base\tsconfig.json",

    "$base\src\handler\checkName.ts",
    "$base\src\application\checkNameUseCase.ts",

    "$base\src\domain\model\domainTypes.ts",
    "$base\src\domain\rules\legalFormRoutingRules.ts",

    "$base\src\domain\adapters\handelsregisterAdapter.ts",
    "$base\src\domain\adapters\chamberAdapter.ts",

    "$base\src\utils\normalization.ts",

    "$base\tests\checkName.test.ts"
)

Write-Host "Ergänze Namensprüfungsservice-Struktur..."

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "  [DIR]  $dir"
    }
}

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "  [FILE] $file"
    }
}

Write-Host "✅ Namensprüfungsservice vorbereitet."
