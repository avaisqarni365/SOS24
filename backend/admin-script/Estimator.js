/**
 * SOS Abdichtung – Estimator & Diagnostic Calculation Engine.
 * Runs in both Google Apps Script (backend/apps-script & backend/admin-script)
 * and the browser (Admin Planer).
 *
 * Calculates waterproofing materials, drilling holes, Silane-Siloxane cream (kg/l),
 * mineral sealing slurry (MDS kg), WTA restoration plaster (kg), PU injection resin,
 * labor hours, crew size, on-site days, and cost ranges for:
 *   - Horizontalsperre (linear meters & wall thickness)
 *   - Kellerinnenabdichtung (m² wall area)
 *   - Kellersanierung Komplett (m² cellar area)
 *   - Schimmelbeseitigung (m² affected area + Calcium Silicate boards)
 *   - Rissverpressung (linear meters crack length, high-pressure packers)
 *   - Sockelabdichtung / Dach / Balkon
 */
(function (root) {
  function round(x, d) {
    var f = Math.pow(10, d == null ? 1 : d);
    return Math.round((Number(x) || 0) * f) / f;
  }

  /* Wall thickness factor (24cm standard = 1.0, 36.5cm = 1.45, 48cm+ = 1.9) */
  function thicknessFactor(cm) {
    var w = Number(cm) || 36;
    if (w <= 24) return 0.85;
    if (w <= 38) return 1.0;
    if (w <= 50) return 1.35;
    return 1.65;
  }

  /* Severity factor: leicht = 0.85, deutlich = 1.0, stark (pressing water) = 1.3 */
  function severityFactor(sev) {
    var s = String(sev || 'deutlich').toLowerCase();
    if (s === 'leicht' || s === 'low') return 0.85;
    if (s === 'stark' || s === 'high') return 1.3;
    return 1.0;
  }

  /* Core estimation for a waterproofing / remediation plan */
  function estimate(s, data) {
    s = s || {};
    data = data || {items: [], rules: {buffer: 0.1, range: {high: 0.08, medium: 0.15, low: 0.25}, defaultKm: 15}};
    var R = data.rules || {buffer: 0.1, range: {high: 0.08, medium: 0.15, low: 0.25}, defaultKm: 15};
    var byId = {};
    (data.items || []).forEach(function (it) { byId[it.id] = it; });

    var totalSqm = 0, totalLfm = 0, totalHours = 0, matKg = 0, crew = 1, n = 0, wsum = 0;
    var inv = s.inv || {};

    Object.keys(inv).forEach(function (id) {
      var e = inv[id], it = byId[id];
      if (!it || !e) return;
      var cnt = 0;
      Object.keys(e.by || {}).forEach(function (src) {
        var c = Number(e.by[src]) || 0;
        if (c > 0) {
          cnt += c;
          wsum += c * ((R.weight && R.weight[src]) || 0.8);
        }
      });
      if (!cnt) return;
      var vi = e.vi || 0;
      var unitHours = it.vars && it.vars[vi] ? Number(it.vars[vi].v) || 0.5 : Number(it.v) || 0.5;
      var kgMin = it.vars && it.vars[vi] && it.vars[vi].kg ? Number(it.vars[vi].kg[0]) || 1 : (it.kg ? Number(it.kg[0]) || 1 : 1);
      totalHours += cnt * unitHours;
      matKg += cnt * kgMin;
      if (it.room === 'horizontal' || it.room === 'crack') totalLfm += cnt;
      else totalSqm += cnt;
      crew = Math.max(crew, Number(it.crew) || 1);
      n += cnt;
    });

    (s.customs || []).forEach(function (c) {
      var cn = Number(c.n) || 1;
      var cv = Number(c.v) || 1;
      totalHours += cn * cv * 0.6;
      matKg += cn * cv * 2.5;
      totalSqm += cn * cv;
      n += cn;
      wsum += cn;
    });

    // Direct quick-calculator parameters if no detailed inventory is used
    var dmg = s.damage || {};
    var areaInput = Number(dmg.area || (s.f1 && s.f1.area) || 0);
    var sev = severityFactor(dmg.severity || (s.f1 && s.f1.severity));
    var thick = thicknessFactor(dmg.wallThickness || 36);

    if (n === 0 && areaInput > 0) {
      var svcType = String(dmg.service || 'horizontalsperre').toLowerCase();
      if (svcType.indexOf('horizontal') >= 0 || svcType.indexOf('wand') >= 0) {
        totalLfm = areaInput;
        totalHours = areaInput * 0.65 * thick * sev;
        matKg = areaInput * 1.8 * thick;
      } else if (svcType.indexOf('riss') >= 0) {
        totalLfm = areaInput;
        totalHours = areaInput * 0.8 * sev;
        matKg = areaInput * 1.2;
      } else if (svcType.indexOf('schimmel') >= 0) {
        totalSqm = areaInput;
        totalHours = areaInput * 0.55 * sev;
        matKg = areaInput * 3.5;
      } else {
        totalSqm = areaInput;
        totalHours = areaInput * 0.75 * sev;
        matKg = areaInput * 8.0;
      }
      n = areaInput;
      wsum = areaInput * 0.8;
    }

    var hours = Math.max(2, round(totalHours * (1 + (R.buffer || 0.1)), 1));
    if (hours > 12) crew = Math.max(crew, 2);
    var days = Math.max(1, Math.ceil(hours / (crew * 7.5)));
    var score = n ? wsum / n : 0.6;
    var conf = n === 0 ? 'low' : score >= 0.8 ? 'high' : score >= 0.5 ? 'medium' : 'low';
    var rangeMap = R.range || {high: 0.08, medium: 0.15, low: 0.25};
    var w = rangeMap[conf] || 0.15;

    var kmIn = parseFloat(String((s.f1 && s.f1.km) || '').replace(',', '.'));
    var kmGuess = !(kmIn > 0);
    var km = kmGuess ? (R.defaultKm || 15) : kmIn;

    // Maintain backwards-compatible field names alongside waterproofing metrics
    var volMetric = round(totalSqm + totalLfm, 1);
    return {
      raw: volMetric,
      vol: volMetric,
      volLow: round(volMetric * (1 - w), 1),
      volHigh: round(volMetric * (1 + w), 1),
      sqm: round(totalSqm, 1),
      lfm: round(totalLfm, 1),
      kgMin: Math.round(matKg * 0.9),
      kgMax: Math.round(matKg * 1.15),
      n: n,
      score: score,
      conf: conf,
      vehicle: days > 2 ? 'lkw75' : 'sprinter',
      trips: days,
      days: days,
      crew: crew,
      hours: hours,
      asmMin: Math.round(totalLfm * 12 + totalSqm * 8), // drilling & preparation minutes
      km: km,
      kmGuess: kmGuess,
      mdVersion: data.version || '2026.10'
    };
  }

  function itemVol(it, vi) { return it.vars && it.vars[vi || 0] ? it.vars[vi || 0].v : it.v; }
  function itemKg(it, vi) { return it.vars && it.vars[vi || 0] ? it.vars[vi || 0].kg : it.kg; }
  function accessFactor(b) {
    if (!b) return 0;
    return (Number(b.floor) || 0) * 0.25 + (Number(b.park) === 2 ? 0.4 : 0);
  }

  var api = {
    estimate: estimate,
    itemVol: itemVol,
    itemKg: itemKg,
    accessFactor: accessFactor,
    thicknessFactor: thicknessFactor,
    severityFactor: severityFactor
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Estimator = api;
})(this);
