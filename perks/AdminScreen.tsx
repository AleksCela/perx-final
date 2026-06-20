import React from "react";

const __html = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css');
.ad .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ad{--orange:#FF6A1F;--orange-d:#B23C0A;--blue:#1F5BE0;--blue-d:#15347E;--ink:#1A1610;--muted:#6E6657;font-family:'Hanken Grotesk',sans-serif;color:var(--ink);border-radius:24px;padding:20px;overflow:hidden;background:linear-gradient(100deg,#F7F2E8 0%,#F0E6D4 100%)}
.ad .d{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.ad .card{background:#FFFDF8;border:1px solid rgba(26,22,16,.1);border-radius:18px}
.ad .g{background:rgba(255,253,248,.6);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.7);border-radius:18px}
.ad .pill{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;font-size:11.5px;font-weight:600}
.ad .kick{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
</style>
<div class="ad">
  <h2 class="sr-only">Admin and HR dashboard with a running tax-savings counter, engagement, adoption and spend breakdown.</h2>
  <div class="g" style="display:flex;align-items:center;gap:12px;padding:10px 16px;margin-bottom:16px">
    <span class="d" style="font-size:21px;font-weight:800">perks<span style="color:var(--orange)">.</span></span>
    <span class="pill" style="background:var(--ink);color:#fff"><i class="ti ti-shield-half" aria-hidden="true"></i> Admin &middot; People analytics</span>
    <span style="margin-left:auto;font-size:12.5px;color:var(--muted)">FY2026 &middot; 312 employees</span>
  </div>

  <div style="background:var(--ink);border-radius:20px;padding:22px;color:#FBF6EC;margin-bottom:16px;display:flex;align-items:center;gap:24px">
    <div style="flex:1">
      <span class="pill" style="background:var(--orange);color:#fff;margin-bottom:12px"><i class="ti ti-trending-up" aria-hidden="true"></i> Untaxed value delivered</span>
      <div class="d" style="font-size:52px;font-weight:800;line-height:1">&euro;184,920<span style="color:var(--orange);font-size:26px;font-weight:700"> saved</span></div>
      <div style="font-size:13.5px;color:rgba(251,246,236,.7);margin-top:9px">vs. the same value paid as <b style="color:#fff">taxed salary</b> &middot; ~&euro;2.41 of benefit per &euro;1 of cost</div>
    </div>
    <div style="text-align:right;border-left:1px solid rgba(255,255,255,.16);padding-left:24px">
      <div style="font-size:11px;color:rgba(251,246,236,.6)">Avg saved / employee</div>
      <div class="d" style="font-size:30px;font-weight:700;color:var(--orange)">&euro;592</div>
      <div style="font-size:11px;color:rgba(251,246,236,.6);margin-top:10px">Counter ticks live as<br>perks are booked</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:16px">
    <div class="card" style="padding:15px"><div class="kick">Active this week</div><div class="d" style="font-size:28px;font-weight:700;margin-top:4px">87%</div><div style="font-size:11.5px;color:var(--orange-d);font-weight:500">&#9650; 6 pts</div></div>
    <div class="card" style="padding:15px"><div class="kick">Perks booked</div><div class="d" style="font-size:28px;font-weight:700;margin-top:4px">1,204</div><div style="font-size:11.5px;color:var(--muted)">this quarter</div></div>
    <div class="card" style="padding:15px"><div class="kick">Budget used</div><div class="d" style="font-size:28px;font-weight:700;margin-top:4px">71%</div><div style="font-size:11.5px;color:var(--blue-d);font-weight:500">&euro;137k of &euro;193k</div></div>
    <div class="card" style="padding:15px"><div class="kick">Provider rating</div><div class="d" style="font-size:28px;font-weight:700;margin-top:4px">4.6<span style="font-size:13px;color:var(--muted)">/5</span></div><div style="font-size:11.5px;color:var(--muted)">2,810 reviews</div></div>
  </div>

  <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:14px;margin-bottom:16px">
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span class="kick">Where the savings come from</span><span class="pill" style="background:rgba(26,22,16,.06)">by category</span></div>
      <div style="display:flex;flex-direction:column;gap:13px;font-size:13px">
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Wellness &amp; fitness</span><b>&euro;61,400</b></div><div style="height:9px;background:#EDE4D2;border-radius:9px"><div style="width:92%;height:100%;background:var(--orange);border-radius:9px"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Learning &amp; language</span><b>&euro;42,180</b></div><div style="height:9px;background:#EDE4D2;border-radius:9px"><div style="width:64%;height:100%;background:var(--blue);border-radius:9px"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Travel &amp; experiences</span><b>&euro;43,290</b></div><div style="height:9px;background:#EDE4D2;border-radius:9px"><div style="width:66%;height:100%;background:var(--orange);border-radius:9px"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Food &amp; coffee</span><b>&euro;38,050</b></div><div style="height:9px;background:#EDE4D2;border-radius:9px"><div style="width:57%;height:100%;background:var(--blue);border-radius:9px"></div></div></div>
      </div>
    </div>

    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span class="kick">Department adoption</span><span class="pill" style="background:rgba(31,91,224,.12);color:var(--blue-d)">&#9650; engagement</span></div>
      <div style="display:flex;flex-direction:column;gap:11px;font-size:13px">
        <div style="display:flex;align-items:center;gap:10px"><span style="width:16px;font-weight:700;color:var(--orange)">1</span><span style="flex:1">Design</span><span style="width:70px;height:7px;background:#EDE4D2;border-radius:9px;display:inline-block"><span style="display:block;width:96%;height:100%;background:var(--orange);border-radius:9px"></span></span><b style="width:36px;text-align:right">96%</b></div>
        <div style="display:flex;align-items:center;gap:10px"><span style="width:16px;font-weight:700;color:var(--muted)">2</span><span style="flex:1">Sales</span><span style="width:70px;height:7px;background:#EDE4D2;border-radius:9px;display:inline-block"><span style="display:block;width:88%;height:100%;background:var(--blue);border-radius:9px"></span></span><b style="width:36px;text-align:right">88%</b></div>
        <div style="display:flex;align-items:center;gap:10px"><span style="width:16px;font-weight:700;color:var(--muted)">3</span><span style="flex:1">Engineering</span><span style="width:70px;height:7px;background:#EDE4D2;border-radius:9px;display:inline-block"><span style="display:block;width:74%;height:100%;background:var(--orange);border-radius:9px"></span></span><b style="width:36px;text-align:right">74%</b></div>
        <div style="display:flex;align-items:center;gap:10px"><span style="width:16px;font-weight:700;color:var(--muted)">4</span><span style="flex:1">Ops</span><span style="width:70px;height:7px;background:#EDE4D2;border-radius:9px;display:inline-block"><span style="display:block;width:61%;height:100%;background:var(--blue);border-radius:9px"></span></span><b style="width:36px;text-align:right">61%</b></div>
      </div>
      <div style="font-size:11.5px;color:var(--muted);margin-top:13px;border-top:1px solid rgba(26,22,16,.1);padding-top:10px"><i class="ti ti-bulb" style="color:var(--orange)" aria-hidden="true"></i> Nudge Ops with a team-pool drop to lift adoption</div>
    </div>
  </div>

  <div class="g" style="padding:8px 10px;display:flex;gap:6px;justify-content:space-around">
    <span class="pill" style="background:var(--orange);color:#fff"><i class="ti ti-chart-bar" aria-hidden="true"></i> Overview</span>
    <span class="pill" style="color:var(--muted)"><i class="ti ti-users" aria-hidden="true"></i> People</span>
    <span class="pill" style="color:var(--muted)"><i class="ti ti-building-store" aria-hidden="true"></i> Providers</span>
    <span class="pill" style="color:var(--muted)"><i class="ti ti-receipt-tax" aria-hidden="true"></i> Tax report</span>
    <span class="pill" style="color:var(--muted)"><i class="ti ti-settings" aria-hidden="true"></i> Settings</span>
  </div>
</div>`;

export default function AdminScreen() {
  return <div className="perks-screen" dangerouslySetInnerHTML={{ __html }} />;
}
