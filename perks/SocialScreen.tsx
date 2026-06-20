import React from "react";

const __html = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css');
.sc .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.sc{--orange:#FF6A1F;--orange-d:#B23C0A;--blue:#1F5BE0;--blue-d:#15347E;--ink:#1A1610;--muted:#6E6657;font-family:'Hanken Grotesk',sans-serif;color:var(--ink);border-radius:24px;padding:20px;overflow:hidden;background:linear-gradient(100deg,#F7F2E8 0%,#F0E6D4 100%)}
.sc .d{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.sc .card{background:#FFFDF8;border:1px solid rgba(26,22,16,.1);border-radius:18px}
.sc .pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600}
.sc .kick{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.sc .av{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:600;color:#fff}
</style>
<div class="sc">
  <h2 class="sr-only">Social features: a perk detail page with reviews, reactions and trending, plus gifting, team pool and provider referral.</h2>
  <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;align-items:start">

    <div class="card" style="padding:0;overflow:hidden">
      <div style="height:120px;background:var(--blue);position:relative;display:flex;align-items:flex-end;padding:13px">
        <span class="pill" style="background:#fff;color:var(--blue-d)"><i class="ti ti-flame" aria-hidden="true"></i> Trending in your office &middot; 7 booked today</span>
        <span class="pill" style="position:absolute;top:13px;right:13px;background:rgba(0,0,0,.3);color:#fff"><i class="ti ti-map-pin" aria-hidden="true"></i> 0.8km</span>
      </div>
      <div style="padding:16px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <div><div class="d" style="font-size:24px;font-weight:700">Bouldering &middot; 10-pass</div><div style="font-size:12.5px;color:var(--muted)">Studio Vertigo &middot; climbing</div></div>
          <div style="text-align:right"><div style="color:var(--orange);font-size:16px">&starf;&starf;&starf;&starf;<span style="color:rgba(26,22,16,.2)">&starf;</span></div><div style="font-size:11.5px;color:var(--muted)">4.6 &middot; 38 reviews</div></div>
        </div>

        <div style="display:flex;gap:8px;margin:14px 0">
          <span class="pill" style="background:rgba(255,106,31,.14);color:var(--orange-d)">&#128293; 24</span>
          <span class="pill" style="background:rgba(31,91,224,.12);color:var(--blue-d)">&#128525; 17</span>
          <span class="pill" style="background:rgba(255,106,31,.14);color:var(--orange-d)">&#128170; 9</span>
          <span style="margin-left:auto" class="pill" style="background:transparent;border:1px solid rgba(26,22,16,.2);color:var(--ink)">+ React</span>
        </div>

        <div style="border-top:1px solid rgba(26,22,16,.1);padding-top:14px;display:flex;flex-direction:column;gap:13px">
          <div style="display:flex;gap:11px">
            <span class="av" style="background:var(--orange)">PA</span>
            <div><div style="font-size:12.5px"><b>Priya A.</b> <span style="color:var(--muted)">&middot; Design</span> <span style="color:var(--orange)">&starf;&starf;&starf;&starf;&starf;</span></div><div style="font-size:12.5px;margin-top:2px">Went with two teammates on a Friday &mdash; our thing now. Super welcoming to beginners.</div><div style="font-size:11px;color:var(--muted);margin-top:4px"><i class="ti ti-thumb-up" aria-hidden="true"></i> 12 found helpful</div></div>
          </div>
          <div style="display:flex;gap:11px">
            <span class="av" style="background:var(--blue)">TM</span>
            <div><div style="font-size:12.5px"><b>Tom M.</b> <span style="color:var(--muted)">&middot; Sales</span> <span style="color:var(--orange)">&starf;&starf;&starf;&starf;</span><span style="color:rgba(26,22,16,.2)">&starf;</span></div><div style="font-size:12.5px;margin-top:2px">Great value with the perk budget. Gets busy after 6pm &mdash; go earlier.</div></div>
          </div>
        </div>
      </div>
      <div style="margin:0 14px 14px;display:flex;align-items:center;gap:11px;padding:11px 14px;background:rgba(255,106,31,.1);border-radius:14px">
        <span class="d" style="font-size:20px;font-weight:700">&euro;40</span><span style="font-size:11.5px;color:var(--blue-d);font-weight:500">&minus;&euro;18 budget</span>
        <span style="margin-left:auto" class="pill" style="background:transparent;border:1px solid rgba(26,22,16,.2);color:var(--ink);padding:9px 13px"><i class="ti ti-gift" aria-hidden="true"></i> Gift</span>
        <span class="pill" style="background:var(--ink);color:#fff;font-size:13px;padding:9px 16px">Book now</span>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:13px">
      <div class="card" style="padding:15px">
        <div class="kick" style="margin-bottom:9px">Gift a teammate</div>
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px"><span class="av" style="background:var(--blue);width:32px;height:32px">SK</span><div style="font-size:12.5px"><b>Sara K.</b><div style="color:var(--muted);font-size:11px">Engineering</div></div></div>
        <div style="display:flex;gap:7px;margin-bottom:10px"><span class="pill" style="background:rgba(255,106,31,.14);color:var(--orange-d)">&#9749; Coffee &euro;4</span><span class="pill" style="background:rgba(31,91,224,.12);color:var(--blue-d)">&#129360; Lunch &euro;12</span></div>
        <div style="background:#F5EFE3;border:1px solid rgba(26,22,16,.08);border-radius:12px;padding:9px;font-size:12px;color:var(--muted);font-style:italic">"Thanks for covering my deploy &#128591;"</div>
        <span class="pill" style="background:var(--orange);color:#fff;width:100%;justify-content:center;margin-top:10px;padding:10px">Send from my budget</span>
      </div>

      <div class="card" style="padding:15px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px"><span class="kick">Team pool &middot; offsite dinner</span><span class="pill" style="background:rgba(31,91,224,.12);color:var(--blue-d)">6 in</span></div>
        <div class="d" style="font-size:20px;font-weight:700">&euro;640 <span style="font-size:12px;color:var(--muted)">of &euro;800</span></div>
        <div style="height:8px;background:#EDE4D2;border-radius:9px;margin:8px 0"><div style="width:80%;height:100%;background:var(--orange);border-radius:9px"></div></div>
        <div style="display:flex;margin-bottom:10px"><span class="av" style="background:#FF6A1F;margin-right:-7px">A</span><span class="av" style="background:#1F5BE0;margin-right:-7px">M</span><span class="av" style="background:#B23C0A;margin-right:-7px">T</span><span class="av" style="background:#6E6657">+3</span></div>
        <span class="pill" style="background:var(--ink);color:#fff;width:100%;justify-content:center;padding:10px">Chip in &euro;40</span>
      </div>

      <div class="card" style="padding:15px">
        <div class="kick" style="margin-bottom:7px">Refer a local spot</div>
        <div style="font-size:12.5px">Know a great caf&eacute; or studio? Suggest it &mdash; earn <b style="color:var(--orange-d)">+&euro;15 + 200 pts</b> if they join.</div>
        <div style="display:flex;align-items:center;gap:8px;background:#F5EFE3;border:1px solid rgba(26,22,16,.08);border-radius:12px;padding:8px 11px;margin-top:10px;font-size:12px;color:var(--muted)"><i class="ti ti-building-store" aria-hidden="true"></i> Caf&eacute; name or link&hellip;</div>
        <span class="pill" style="background:var(--blue);color:#fff;width:100%;justify-content:center;margin-top:10px;padding:10px">Send suggestion</span>
      </div>
    </div>
  </div>
</div>`;

export default function SocialScreen() {
  return <div className="perks-screen" dangerouslySetInnerHTML={{ __html }} />;
}
