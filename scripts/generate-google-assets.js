const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svg = fs.readFileSync(path.join(__dirname, '../public/logo.svg'), 'utf8');

// 1. Square Logo for Google Business Profile (1000x1000)
const logoHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1000px;
    height: 1000px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .circle-guide {
    width: 860px;
    height: 860px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 40px;
  }
  .logo-box {
    width: 760px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-box svg {
    width: 100%;
    height: auto;
  }
  .tagline {
    font-size: 32px;
    font-weight: 800;
    color: #173455;
    margin-top: 45px;
    letter-spacing: -0.5px;
    text-align: center;
  }
  .sub {
    font-size: 20px;
    font-weight: 700;
    color: #0B8AD0;
    margin-top: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="circle-guide">
    <div class="logo-box">
      ${svg}
    </div>
    <div class="tagline">Kellersanierung & Bautenschutz</div>
    <div class="sub">Fachbetrieb aus Essen</div>
  </div>
</body>
</html>`;

// 2. Cover Banner for Google Business Profile (1200x675 - 16:9)
const coverHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 675px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px 70px;
    position: relative;
    overflow: hidden;
  }
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(14, 165, 233, 0.12) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.8;
  }
  .header {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo-card {
    background: #ffffff;
    padding: 20px 35px;
    border-radius: 18px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-card svg {
    width: 100%;
    height: auto;
  }
  .badge-row {
    display: flex;
    gap: 15px;
  }
  .badge {
    background: rgba(14, 165, 233, 0.15);
    border: 1px solid rgba(14, 165, 233, 0.4);
    color: #38bdf8;
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .content {
    position: relative;
    z-index: 10;
    margin-top: 20px;
  }
  .title {
    font-size: 46px;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -1px;
    color: #ffffff;
  }
  .title span {
    color: #38bdf8;
  }
  .desc {
    font-size: 20px;
    color: #94a3b8;
    margin-top: 15px;
    max-width: 800px;
    line-height: 1.4;
  }
  .footer {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.12);
    padding-top: 25px;
  }
  .locations {
    font-size: 16px;
    font-weight: 700;
    color: #cbd5e1;
    display: flex;
    gap: 20px;
  }
  .locations span {
    color: #38bdf8;
  }
  .phone-pill {
    background: #059669;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="header">
    <div class="logo-card">
      ${svg}
    </div>
    <div class="badge-row">
      <div class="badge">✓ SchimmelPeter® Partnerbetrieb</div>
      <div class="badge">✓ WTA-zertifiziert</div>
      <div class="badge">✓ 10 Jahre Garantie</div>
    </div>
  </div>

  <div class="content">
    <div class="title">Trockene Keller. <span>Gesundes Wohnen.</span></div>
    <div class="desc">Spezialist für Horizontalsperren, Kellerinnen- & Außenabdichtung, Rissinjektion und dauerhafte Schimmelbeseitigung.</div>
  </div>

  <div class="footer">
    <div class="locations">
      <div>📍 Wuppertal (Zentrale)</div>
      <div><span>•</span> 📍 Solingen</div>
      <div><span>•</span> 📍 Remscheid</div>
      <div><span>•</span> 📍 NRW-weit</div>
    </div>
    <div class="phone-pill">
      📞 0172 2064177
    </div>
  </div>
</body>
</html>`;

const tempDir = path.join(__dirname, '../public/google-profile');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

fs.writeFileSync(path.join(tempDir, 'logo.html'), logoHtml);
fs.writeFileSync(path.join(tempDir, 'cover.html'), coverHtml);

console.log('HTML templates written successfully.');
