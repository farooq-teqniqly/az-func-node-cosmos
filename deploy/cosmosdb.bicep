param cosmosAccountName string

var location = resourceGroup().location

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosAccountName
  kind: 'GlobalDocumentDB'
  location: location
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Eventual'
    }
    locations: [
      {
        locationName: location
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
  }
}

output cosmosAccountMetadata object = {
  documentEndpoint: cosmosAccount.properties.documentEndpoint
  primaryMasterKey: cosmosAccount.listKeys().primaryMasterKey
}
