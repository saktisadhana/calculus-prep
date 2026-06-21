$response = Invoke-WebRequest -Uri 'https://openrouter.ai/api/v1/models' -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
$json.data | Where-Object { $_.id -match ':free' } | ForEach-Object { $_.id } | Sort-Object
