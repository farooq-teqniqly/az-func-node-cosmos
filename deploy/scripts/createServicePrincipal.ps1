param(
    [Parameter(Mandatory = $true)]
    [string] $ServicePrincipalName = $(throw "Missing service principal name argument")
)

az ad sp create-for-rbac `
    -n $ServicePrincipalName `
    --role Contributor
