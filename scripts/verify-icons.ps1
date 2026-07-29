Add-Type -AssemblyName System.Drawing
$files = @('public\icon-192.png','public\icon-512.png','public\screenshot-wide.png','public\screenshot-narrow.png')
foreach ($f in $files) {
    $img  = [System.Drawing.Image]::FromFile((Resolve-Path $f))
    $name = (Get-Item $f).Name
    $kb   = [math]::Round((Get-Item $f).Length/1KB, 1)
    $w    = $img.Width
    $h    = $img.Height
    $img.Dispose()
    Write-Host "$name : ${w}x${h} | $kb KB"
}
