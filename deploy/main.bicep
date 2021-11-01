targetScope = 'subscription'

param solutionName string

@allowed([
  'dev'
  'test'
])
param environmentName string

param cosmosDatabaseName string
param cosmosContainerName string

var location = deployment().location
var baseName = '${solutionName}-${environmentName}-${location}'
var rgName = '${baseName}-rg'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: rgName
  location: location
}

module cosmosDeploy 'cosmosdb.bicep' = {
  name: 'cosmosDeploy'
  scope: rg
  params: {
     cosmosAccountName: '${baseName}-cdb'
  }
}

module functionAppDeploy 'functionapp.bicep' = {
  name: 'functionAppDeploy'
  scope: rg
  params: {
     functionAppName: '${baseName}-fapp'
     appSettings: {
       cosmos: {
         endpoint: cosmosDeploy.outputs.deploymentOutputs.documentEndpoint
         key: cosmosDeploy.outputs.deploymentOutputs.primaryMasterKey
         databaseName: cosmosDatabaseName
         containerName: cosmosContainerName
       }
     }
  }
}

output deploymentOutputs object = {
  resourceGroupName: rgName
  cosmosDeployment: {
    endpoint: cosmosDeploy.outputs.deploymentOutputs.documentEndpoint
  }
  functionAppDeployment: {
    hostName: functionAppDeploy.outputs.deploymentOutputs.functionAppHostName
  }
}
