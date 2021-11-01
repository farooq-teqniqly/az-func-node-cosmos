param(
    [Parameter(Mandatory = $true)]
    [string] $ServicePrincipalName = $(throw "Missing service principal name argument"),

    [Parameter(Mandatory = $true)]
    [string] $SubscriptionName = $(throw "Missing subscription name argument")
)

$subscriptionId = az account show `
    --subscription $SubscriptionName `
    --query '{subscriptionId:id}' `
| ConvertFrom-Json -AsHashtable

if (!$?) {
    throw "Subscription '$SubscriptionName' not found."
}

$sp = az ad sp create-for-rbac `
    --name $ServicePrincipalName `
    --role Contributor `
    --query '{clientId:appId, clientSecret:password, tenantId:tenant}' `
| ConvertFrom-Json -AsHashtable

if (!$?) {
    throw "There was an error creating the service principal."
}

$sp.Add("subscriptionId", $subscriptionId["subscriptionId"])

ConvertTo-Json $sp

