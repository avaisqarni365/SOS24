Add-Type -AssemblyName System.Drawing

$srcPath = "D:\SOS24\public\google-profile\sos-logo-original.png"
if (!(Test-Path $srcPath)) {
    Copy-Item "C:\Users\Avais\.gemini\antigravity\brain\3cf677a1-e577-44c2-be55-5d0464ad7524\.user_uploaded\media_1792353568227.png" $srcPath -Force
}

# 1. Clean the logo: Replace grey background pixels with pure white
$rawBmp = New-Object System.Drawing.Bitmap $srcPath
$cleanLogo = New-Object System.Drawing.Bitmap $rawBmp.Width, $rawBmp.Height
for ($x = 0; $x -lt $rawBmp.Width; $x++) {
    for ($y = 0; $y -lt $rawBmp.Height; $y++) {
        $c = $rawBmp.GetPixel($x, $y)
        if ($c.R -gt 190 -and $c.G -gt 190 -and $c.B -gt 190) {
            $cleanLogo.SetPixel($x, $y, [System.Drawing.Color]::White)
        } else {
            $cleanLogo.SetPixel($x, $y, $c)
        }
    }
}
$rawBmp.Dispose()
$cleanLogo.Save("D:\SOS24\public\google-profile\sos-logo-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Square Logo for Google Business Profile (800x800)
$size = 800
$squareBmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($squareBmp)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Center logo with comfortable circular safe padding
$targetW = 680
$targetH = [int]($cleanLogo.Height * ($targetW / $cleanLogo.Width))
$xPos = [int](($size - $targetW) / 2)
$yPos = [int](($size - $targetH) / 2)

$g.DrawImage($cleanLogo, $xPos, $yPos, $targetW, $targetH)
$g.Dispose()

$outPath1 = "D:\SOS24\public\google-profile\01-google-business-logo-800x800.png"
$squareBmp.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$squareBmp.Dispose()
Write-Host "Clean Logo 800x800 saved: $outPath1"

# 3. Google Business Profile Cover Photo (1200x675)
$coverW = 1200
$coverH = 675
$coverBmp = New-Object System.Drawing.Bitmap $coverW, $coverH
$gCover = [System.Drawing.Graphics]::FromImage($coverBmp)
$gCover.Clear([System.Drawing.Color]::FromArgb(15, 23, 42)) # Slate 900
$gCover.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gCover.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Draw crisp white card for logo
$cardW = 580
$cardH = 170
$cardX = [int](($coverW - $cardW) / 2)
$cardY = 90
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$gCover.FillRectangle($cardBrush, $cardX, $cardY, $cardW, $cardH)
$cardBrush.Dispose()

$logoInCardW = 510
$logoInCardH = [int]($cleanLogo.Height * ($logoInCardW / $cleanLogo.Width))
$logoInCardX = [int]($cardX + ($cardW - $logoInCardW) / 2)
$logoInCardY = [int]($cardY + ($cardH - $logoInCardH) / 2)
$gCover.DrawImage($cleanLogo, $logoInCardX, $logoInCardY, $logoInCardW, $logoInCardH)

# Text fonts & brushes
$fontTitle = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$fontDesc = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Regular)
$fontPill = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)

$textBrushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$textBrushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248)) # Sky 400
$textBrushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184)) # Slate 400

$formatCenter = New-Object System.Drawing.StringFormat
$formatCenter.Alignment = [System.Drawing.StringAlignment]::Center

$gCover.DrawString("Kellersanierung & Schimmelbeseitigung", $fontTitle, $textBrushWhite, [float]($coverW / 2), 305, $formatCenter)
$gCover.DrawString("Fachbetrieb aus Essen * Ruhrgebiet * Bergisches Land * NRW", $fontSub, $textBrushCyan, [float]($coverW / 2), 365, $formatCenter)
$gCover.DrawString("Horizontalsperren - Kellerinnenabdichtung - Rissinjektion - 10 Jahre Garantie", $fontDesc, $textBrushMuted, [float]($coverW / 2), 405, $formatCenter)

# Emerald CTA Bar
$barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(5, 150, 105)) # Emerald 600
$barW = 480
$barH = 65
$barX = [int](($coverW - $barW) / 2)
$barY = 505
$gCover.FillRectangle($barBrush, $barX, $barY, $barW, $barH)
$barBrush.Dispose()

$gCover.DrawString("Notdienst & Beratung: 0172 2064177", $fontPill, $textBrushWhite, [float]($coverW / 2), 525, $formatCenter)

$fontTitle.Dispose()
$fontSub.Dispose()
$fontDesc.Dispose()
$fontPill.Dispose()
$textBrushWhite.Dispose()
$textBrushCyan.Dispose()
$textBrushMuted.Dispose()
$formatCenter.Dispose()
$gCover.Dispose()

$outPath2 = "D:\SOS24\public\google-profile\02-google-business-cover-1200x675.png"
$coverBmp.Save($outPath2, [System.Drawing.Imaging.ImageFormat]::Png)
$coverBmp.Dispose()
Write-Host "Cover 1200x675 saved: $outPath2"

$cleanLogo.Dispose()

# 4. Copy open-graph cover as alternative JPEG
Copy-Item "D:\SOS24\public\og-image.jpg" "D:\SOS24\public\google-profile\02-alternative-cover-1200x630.jpg" -Force

Write-Host "All Google profile images created successfully."
