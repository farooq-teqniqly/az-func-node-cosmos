$rgName = "fm-usw-demo-rg"
$region = "westus"
$cosmosDbAccountName = "fm-usw-demo-cdb"
$dbName = "winedb"
$containerName = "winecontainer"

az group create `
    --name $rgName `
    --location $region

az cosmosdb create `
    --name $cosmosDbAccountName `
    --resource-group $rgName

az cosmosdb sql database create --account-name $cosmosDbAccountName `
    --name $dbName `
    --resource-group $rgName

az cosmosdb sql container create `
    -g $rgName `
    -a $cosmosDbAccountName `
    -d $dbName `
    -n $containerName `
    --partition-key-path "/region" `
    --ttl 1000 `
    --throughput "700"

az cosmosdb list-keys `
    --name $cosmosDbAccountName `
    --resource-group $rgName

