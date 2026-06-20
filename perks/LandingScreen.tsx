import React from "react";

const __html = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css');
.pl .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.pl{--orange:#FF6A1F;--orange-d:#B23C0A;--blue:#1F5BE0;--blue-d:#15347E;--paper:#F5EFE3;--ink:#1A1610;--muted:#6E6657;font-family:'Hanken Grotesk',sans-serif;color:var(--ink);border-radius:24px;padding:22px;overflow:hidden;background:linear-gradient(100deg,#F7F2E8 0%,#F0E6D4 100%)}
.pl .d{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.pl .card{background:#FFFDF8;border:1px solid rgba(26,22,16,.1);border-radius:20px}
.pl .g{background:rgba(255,253,248,.6);-webkit-backdrop-filter:blur(16px) saturate(1.2);backdrop-filter:blur(16px) saturate(1.2);border:1px solid rgba(255,255,255,.7);border-radius:20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
.pl .pill{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:999px;font-size:12px;font-weight:600}
.pl .kick{font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600}
</style>
<div class="pl">
  <h2 class="sr-only">Marketplace landing for the Perks app.</h2>
  <div class="g" style="display:flex;align-items:center;gap:15px;padding:11px 18px;margin-bottom:24px">
    <span class="d" style="font-size:24px;font-weight:800">perks<span style="color:var(--orange)">.</span></span>
    <span style="font-size:14px;font-weight:600;margin-left:6px">Discover</span>
    <span style="font-size:14px;color:var(--muted)">Drops</span>
    <span style="font-size:14px;color:var(--muted)">Teams</span>
    <span style="font-size:14px;color:var(--muted)">Wallet</span>
    <span style="margin-left:auto" class="pill" style="background:var(--orange);color:#fff"><i class="ti ti-ticket" aria-hidden="true"></i> &euro;480 left</span>
    <span style="width:34px;height:34px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;color:#fff">KK</span>
  </div>

  <div class="kick" style="color:var(--orange-d);margin-bottom:12px">Good evening, Kedi &mdash; 11 perks unlocked</div>
  <div class="d" style="font-size:66px;line-height:.9;font-weight:700;max-width:600px">Don't browse perks.<br><span style="color:var(--orange)">Describe a feeling.</span></div>

  <div class="card" style="display:flex;align-items:center;gap:12px;padding:9px 9px 9px 22px;margin:26px 0 26px;max-width:640px;border-radius:999px">
    <i class="ti ti-sparkles" aria-hidden="true" style="color:var(--orange);font-size:21px"></i>
    <span style="flex:1;font-size:16px;color:var(--muted)">"cosy Sunday reset, under &euro;40"&hellip;</span>
    <span class="pill" style="background:var(--ink);color:#fff;font-size:14px;padding:12px 22px">Build my combo <i class="ti ti-arrow-right" aria-hidden="true"></i></span>
  </div>

  <div style="display:grid;grid-template-columns:1.45fr 1fr;gap:18px;margin-bottom:18px">
    <div style="background:var(--orange);border-radius:22px;padding:24px;position:relative;overflow:hidden;color:#fff">
      <div style="position:absolute;right:-40px;top:-40px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.13)"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;position:relative">
        <span class="pill" style="background:#fff;color:var(--orange-d)"><i class="ti ti-bolt" aria-hidden="true"></i> Friday drop</span>
        <span class="d" style="font-size:28px;font-weight:600;font-variant-numeric:tabular-nums">04:12:55</span>
      </div>
      <div class="d" style="font-size:38px;font-weight:700;line-height:.96;margin:28px 0 8px;position:relative">Spa day for two,<br>at half budget</div>
      <div style="font-size:13.5px;color:rgba(255,255,255,.88);position:relative">Only 18 left &middot; expires tonight</div>
      <div style="display:flex;align-items:baseline;gap:13px;margin-top:20px;position:relative">
        <span class="d" style="font-size:46px;font-weight:800">&euro;35</span>
        <span style="font-size:16px;text-decoration:line-through;color:rgba(255,255,255,.6)">&euro;70</span>
        <span style="margin-left:auto" class="pill" style="background:var(--ink);color:#fff;font-size:14px;padding:13px 24px">Claim now</span>
      </div>
    </div>

    <div style="background:var(--blue);border-radius:22px;padding:22px;display:flex;flex-direction:column;color:#fff">
      <span class="pill" style="background:rgba(255,255,255,.2);color:#fff;align-self:flex-start"><i class="ti ti-wand" aria-hidden="true"></i> AI bundle</span>
      <div class="d" style="font-size:27px;font-weight:700;line-height:1.02;margin:18px 0 9px">The "Friday<br>wind-down" pack</div>
      <div style="font-size:13.5px;color:rgba(255,255,255,.8)">Massage + wine tasting + Monday coffee &mdash; picked from your rebookings.</div>
      <div style="margin-top:auto;display:flex;align-items:baseline;gap:11px;padding-top:20px">
        <span class="d" style="font-size:34px;font-weight:800">&euro;52</span>
        <span style="font-size:12.5px;color:rgba(255,255,255,.85)">saves &euro;19</span>
        <span style="margin-left:auto" class="pill" style="background:#fff;color:var(--blue-d)">See logic</span>
      </div>
    </div>
  </div>

  <div class="card" style="display:flex;align-items:center;gap:16px;padding:14px 22px;margin-bottom:18px">
    <span class="pill" style="background:var(--orange);color:#fff"><i class="ti ti-activity" aria-hidden="true"></i> Live</span>
    <span style="font-size:14.5px"><b>Design</b> just pooled credit for an offsite</span>
    <span style="color:rgba(26,22,16,.25)">/</span>
    <span style="font-size:14.5px"><b>Sales</b> unlocked the Steps badge</span>
    <span style="margin-left:auto;font-size:12.5px;color:var(--blue-d);font-weight:500">per team &middot; never per person</span>
  </div>

  <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:18px">
    <div class="card" style="padding:20px">
      <div class="kick" style="color:var(--blue-d);margin-bottom:14px">Dept race &middot; wk 24</div>
      <div style="display:flex;justify-content:space-between;font-size:14.5px;font-weight:600"><span>Design</span><span>12,940</span></div>
      <div style="height:9px;background:#EDE4D2;border-radius:9px;margin:7px 0 14px"><div style="width:100%;height:100%;background:var(--orange);border-radius:9px"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:13.5px;color:var(--muted)"><span>Sales</span><span>11,120</span></div>
      <div style="height:9px;background:#EDE4D2;border-radius:9px;margin:7px 0 0"><div style="width:86%;height:100%;background:var(--blue);border-radius:9px"></div></div>
    </div>

    <div style="background:var(--ink);border-radius:20px;padding:20px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">
      <div style="font-size:32px;color:var(--orange)"><i class="ti ti-ferris-wheel" aria-hidden="true"></i></div>
      <div class="d" style="font-size:22px;font-weight:700;margin:9px 0 5px">Weekly spin</div>
      <div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:15px">Your check-in is ready</div>
      <span class="pill" style="background:var(--orange);color:#fff;width:100%;justify-content:center;padding:12px">Spin now</span>
    </div>

    <div class="card" style="padding:20px">
      <div class="kick" style="color:var(--orange-d);margin-bottom:10px">Mystery box</div>
      <div style="font-size:44px;text-align:center">&#127873;</div>
      <div style="font-size:13.5px;color:var(--muted);text-align:center;margin:10px 0 15px">A wrapped perk within budget</div>
      <span class="pill" style="background:var(--blue);color:#fff;width:100%;justify-content:center;padding:12px">Unwrap</span>
    </div>
  </div>
</div>`;

export default function LandingScreen() {
  return <div className="perks-screen" dangerouslySetInnerHTML={{ __html }} />;
}
