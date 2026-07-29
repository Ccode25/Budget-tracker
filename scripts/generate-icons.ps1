Add-Type -AssemblyName System.Drawing

function Create-AppIcon {
    param([int]$size, [string]$path)

    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $br = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new($size, $size),
        [System.Drawing.Color]::FromArgb(255, 124, 58, 237),
        [System.Drawing.Color]::FromArgb(255, 26, 21, 53)
    )

    $r  = [int]($size * 0.22)
    $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddArc(0, 0, $r*2, $r*2, 180, 90)
    $gp.AddArc($size - $r*2, 0, $r*2, $r*2, 270, 90)
    $gp.AddArc($size - $r*2, $size - $r*2, $r*2, $r*2, 0, 90)
    $gp.AddArc(0, $size - $r*2, $r*2, $r*2, 90, 90)
    $gp.CloseFigure()
    $g.FillPath($br, $gp)

    $fontSize = [int]($size * 0.45)
    $font  = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sf    = New-Object System.Drawing.StringFormat
    $sf.Alignment     = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect  = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $g.DrawString([char]0x20B1, $font, $brush, $rect, $sf)

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $br.Dispose()
    $font.Dispose()
    $brush.Dispose()
    Write-Host "Created: $path"
}

function Create-Screenshot {
    param([int]$w, [int]$h, [string]$path, [string]$label)

    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $br = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new($w, $h),
        [System.Drawing.Color]::FromArgb(255, 26, 21, 53),
        [System.Drawing.Color]::FromArgb(255, 14, 11, 30)
    )
    $g.FillRectangle($br, 0, 0, $w, $h)

    $fontSize = [int]([Math]::Min($w, $h) * 0.06)
    $font  = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 124, 58, 237))
    $sf    = New-Object System.Drawing.StringFormat
    $sf.Alignment     = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect  = New-Object System.Drawing.RectangleF(0, 0, $w, $h)
    $g.DrawString("BudgetTracker - $label", $font, $brush, $rect, $sf)

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $br.Dispose()
    $font.Dispose()
    $brush.Dispose()
    Write-Host "Created: $path"
}

$publicDir = "c:\Users\ajdae\.gemini\antigravity-ide\scratch\Budget-Tracker\public"

Create-AppIcon    -size 192 -path "$publicDir\icon-192.png"
Create-AppIcon    -size 512 -path "$publicDir\icon-512.png"
Create-Screenshot -w 1280 -h 720 -path "$publicDir\screenshot-wide.png"   -label "Dashboard"
Create-Screenshot -w 390  -h 844 -path "$publicDir\screenshot-narrow.png" -label "Mobile"

Write-Host "All PNG assets generated successfully"
