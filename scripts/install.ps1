[CmdletBinding()]
Param(
  [Parameter(Mandatory=$False,Position=1)]
  [string]$Module = "Online"
);

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force;
$PnPModuleName = "SharePointPnPPowerShell$Module";

$modules = Get-Module -Name $PnPModuleName -ListAvailable;
If ($null -eq $modules) {
  $rmod = Get-Module -Name SharePointPnPPowerShell* -ListAvailable;
  If ($null -ne $rmod) {
    Remove-Module -ModuleInfo $rmod -Force;
    Uninstall-Module -Name $rmod.Name;
  }
  Install-Module -Name $PnPModuleName -Scope CurrentUser -Force;
  Import-Module -Name $PnPModuleName -DisableNameChecking;
}
