import React from "react";

const __html = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css');
.dp .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.dp{--orange:#FF6A1F;--orange-d:#B23C0A;--blue:#1F5BE0;--blue-d:#15347E;--ink:#1A1610;--muted:#6E6657;font-family:'Hanken Grotesk',sans-serif;color:var(--ink)}
.dp .d{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.dp .scene{border-radius:24px;padding:20px;overflow:hidden;background:linear-gradient(100deg,#F7F2E8 0%,#F0E6D4 100%)}
.dp .card{background:#FFFDF8;border:1px solid rgba(26,22,16,.1);border-radius:18px}
.dp .g{background:rgba(255,253,248,.6);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.7);border-radius:18px}
.dp .pill{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;font-size:11.5px;font-weight:600}
.dp .kick{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.dp .tnum{font-variant-numeric:tabular-nums}
</style>
<div class="dp" style="display:flex;flex-direction:column;gap:18px">
  <h2 class="sr-only">Perk Drops page with live countdowns and the Mystery Box reveal.</h2>

  <div class="scene">
    <div class="g" style="display:flex;align-items:center;gap:12px;padding:10px 16px;margin-bottom:16px">
      <span class="d" style="font-size:21px;font-weight:800">perks<span style="color:var(--orange)">.</span></span>
      <span class="d" style="font-size:18px;font-weight:700">Friday Drops</span>
      <span class="pill" style="background:var(--orange);color:#fff;margin-left:4px"><i class="ti ti-bolt" aria-hidden="true"></i> Live now</span>
      <span style="margin-left:auto" class="pill" style="background:var(--ink);color:#fff"><i class="ti ti-ticket" aria-hidden="true"></i> &euro;480</span>
    </div>

    <div style="background:var(--orange);border-radius:20px;padding:20px;color:#fff;margin-bottom:16px;display:flex;align-items:center;position:relative;overflow:hidden">
      <div style="position:absolute;right:-30px;bottom:-50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.12)"></div>
      <div style="flex:1;position:relative">
        <div style="font-size:12px;color:rgba(255,255,255,.8)">This week's headline drop</div>
        <div class="d" style="font-size:32px;font-weight:700;margin:4px 0">Spa day for two &mdash; half budget</div>
        <div style="font-size:12.5px;color:rgba(255,255,255,.85)">18 of 40 claimed &middot; everyone in the office can see this</div>
      </div>
      <div style="text-align:center;position:relative;padding:0 18px">
        <div class="kick" style="color:rgba(255,255,255,.8)">Expires in</div>
        <div class="d tnum" style="font-size:36px;font-weight:800">04:11:09</div>
      </div>
      <span class="pill" style="background:var(--ink);color:#fff;font-size:14px;padding:13px 22px;position:relative">Claim &middot; &euro;35</span>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      <div class="card" style="padding:0;overflow:hidden">
        <div style="height:64px;background:var(--blue);display:flex;align-items:flex-start;justify-content:space-between;padding:10px"><span class="pill" style="background:#fff;color:var(--blue-d)">&minus;40%</span><span class="pill tnum" style="background:rgba(0,0,0,.25);color:#fff">02:40:00</span></div>
        <div style="padding:13px"><div class="d" style="font-size:16px;font-weight:600">Natural wine tasting</div><div style="font-size:11.5px;color:var(--muted);margin:3px 0 9px">9 seats left</div><div style="display:flex;align-items:center"><span class="d" style="font-size:18px;font-weight:700">&euro;18</span><span style="margin-left:auto" class="pill" style="background:var(--orange);color:#fff">Claim</span></div></div>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        <div style="height:64px;background:var(--orange);display:flex;align-items:flex-start;justify-content:space-between;padding:10px"><span class="pill" style="background:#fff;color:var(--orange-d)">&minus;50%</span><span class="pill tnum" style="background:rgba(0,0,0,.25);color:#fff">05:55:21</span></div>
        <div style="padding:13px"><div class="d" style="font-size:16px;font-weight:600">Surf lesson &middot; 90&prime;</div><div style="font-size:11.5px;color:var(--muted);margin:3px 0 9px">4 seats left</div><div style="display:flex;align-items:center"><span class="d" style="font-size:18px;font-weight:700">&euro;29</span><span style="margin-left:auto" class="pill" style="background:var(--orange);color:#fff">Claim</span></div></div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;opacity:.6">
        <div style="height:64px;background:var(--ink);display:flex;align-items:flex-start;justify-content:space-between;padding:10px"><span class="pill" style="background:rgba(255,255,255,.85);color:var(--ink)">&minus;30%</span><span class="pill" style="background:rgba(255,255,255,.2);color:#fff">Gone</span></div>
        <div style="padding:13px"><div class="d" style="font-size:16px;font-weight:600">Pottery class</div><div style="font-size:11.5px;color:var(--muted);margin:3px 0 9px">Sold out &middot; 6pm next drop</div><div style="display:flex;align-items:center"><span class="d" style="font-size:18px;font-weight:700;text-decoration:line-through;color:var(--muted)">&euro;20</span><span style="margin-left:auto" class="pill" style="background:rgba(26,22,16,.1);color:var(--muted)">Notify me</span></div></div>
      </div>
    </div>
  </div>

  <div class="scene" style="min-height:310px;display:flex;align-items:center;justify-content:center;position:relative">
    <div style="position:absolute;inset:0;background:rgba(26,22,16,.5);z-index:1"></div>
    <div class="card" style="width:340px;padding:24px;text-align:center;position:relative;z-index:2;border-radius:24px">
      <span class="pill" style="background:var(--orange);color:#fff"><i class="ti ti-gift" aria-hidden="true"></i> Mystery box &middot; opened</span>
      <div style="font-size:64px;margin:14px 0 6px;line-height:1">&#127873;</div>
      <div class="kick">Within your &euro;480 budget, you got</div>
      <div class="d" style="font-size:30px;font-weight:800;margin:6px 0;color:var(--orange)">Sunset kayak<br>for two</div>
      <div style="font-size:13px;color:var(--muted);margin-bottom:16px">Worth &euro;58 &middot; costs you <b style="color:var(--ink)">&euro;0</b> this time &middot; +75 pts</div>
      <div style="display:flex;gap:10px;justify-content:center">
        <span class="pill" style="background:transparent;border:1px solid rgba(26,22,16,.25);color:var(--ink);padding:11px 16px">Reshuffle (1 left)</span>
        <span class="pill" style="background:var(--ink);color:#fff;font-size:13px;padding:11px 18px">Keep it &amp; book</span>
      </div>
    </div>
  </div>
</div>`;

export default function DropsMysteryScreen() {
  return <div className="perks-screen" dangerouslySetInnerHTML={{ __html }} />;
}
