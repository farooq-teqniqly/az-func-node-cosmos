targetScope = 'subscription'

param solutionName string

@allowed([
  'dev'
  'test'
  'prod'
])
param environmentName string

var location = deployment().location
var rgName = '${solutionName}-${environmentName}-${location}-rg'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: rgName
  location: location
}
