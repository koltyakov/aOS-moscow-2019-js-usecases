$ConfigPath = "$PSScriptRoot\..\config\private.json";
$SchemaPath = "$PSScriptRoot\template.xml";

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force;
Set-PnPTraceLog -on -level Debug;

$Context = Get-Content $ConfigPath -Encoding UTF8 | ConvertFrom-Json;

$Connection = Connect-PnPOnline -Url $Context.siteUrl -ReturnConnection;

Apply-PnPProvisioningTemplate `
  -Path $SchemaPath `
  -Connection $Connection;
