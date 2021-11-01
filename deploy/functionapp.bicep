param functionAppName string
param appSettings object

var location = resourceGroup().location
var kind = 'functionapp'
var storageAccountName = '${appStorageAccount.name};EndpointSuffix=${environment().suffixes.storage}'
var storageAccountKey = '${listKeys(appStorageAccount.id, appStorageAccount.apiVersion).keys[0].value}'
var appInsightsKey = appInsights.properties.InstrumentationKey

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${functionAppName}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${functionAppName}-asp'
  location: location
  kind: kind
  sku: {
    name: 'Y1'
  }
}

resource appStorageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: '${replace(functionAppName, '-', '')}sto'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: functionAppName
  location: location
  kind: kind
  identity: {
     type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccountKey}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccountKey}'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsightsKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: 'InstrumentationKey=${appInsightsKey}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'COSMOS_DB_ENDPOINT'
          value: appSettings.cosmos.endpoint
        }
        {
          name: 'COSMOS_DB_KEY'
          value: appSettings.cosmos.key
        }
        {
          name: 'COSMOS_DB'
          value: appSettings.cosmos.databaseName
        }
        {
          name: 'COSMOS_DB_CONTAINER'
          value: appSettings.cosmos.containerName
        }
      ]
    }
  }
}

output deploymentOutputs object = {
  functionAppHostName: functionApp.properties.defaultHostName
  functionAppManagedIdentity : {
    appId: functionApp.identity.principalId
    tenantId: functionApp.identity.tenantId
  }
} 
