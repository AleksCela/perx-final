import React from "react";

const __html = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css');
.ga .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ga{--orange:#FF6A1F;--orange-d:#B23C0A;--blue:#1F5BE0;--blue-d:#15347E;--ink:#1A1610;--muted:#6E6657;font-family:'Hanken Grotesk',sans-serif;color:var(--ink);border-radius:24px;padding:20px;overflow:hidden;background:linear-gradient(100deg,#F7F2E8 0%,#F0E6D4 100%)}
.ga .d{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.ga .card{background:#FFFDF8;border:1px solid rgba(26,22,16,.1);border-radius:18px}
.ga .pill{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;font-size:11.5px;font-weight:600}
.ga .kick{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.ga .bd{aspect-ratio:1;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:9.5px;text-align:center;padding:5px}
.ga .bd i{font-size:20px}
</style>
<div class="ga">
  <h2 class="sr-only">Gamification: spin the wheel, team-versus-team leaderboard and the 24-badge achievement wall.</h2>
  <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:16px;margin-bottom:16px;align-items:stretch">

    <div class="card" style="padding:18px;text-align:center">
      <span class="pill" style="background:var(--orange);color:#fff"><i class="ti ti-confetti" aria-hidden="true"></i> Weekly check-in</span>
      <div style="position:relative;width:178px;height:178px;margin:16px auto 8px">
        <div style="position:absolute;inset:0;border-radius:50%;border:7px solid #FFFDF8;background:conic-gradient(#FF6A1F 0 60deg,#1F5BE0 60deg 120deg,#1A1610 120deg 180deg,#FF8A4F 180deg 240deg,#15347E 240deg 300deg,#FF6A1F 300deg 360deg);box-shadow:0 0 0 1px rgba(26,22,16,.1)"></div>
        <div style="position:absolute;inset:56px;border-radius:50%;background:#FFFDF8;display:flex;align-items:center;justify-content:center;flex-direction:column;border:1px solid rgba(26,22,16,.1)">
          <span class="d" style="font-size:22px;font-weight:800;color:var(--orange);line-height:1">+120</span><span style="font-size:9px;color:var(--muted)">points</span>
        </div>
        <div style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:15px solid var(--ink)"></div>
      </div>
      <div class="d" style="font-size:18px;font-weight:700">Double-points Friday!</div>
      <div style="font-size:11.5px;color:var(--muted);margin:4px 0 12px">&#128293; 5-week streak &middot; next spin Monday</div>
      <span class="pill" style="background:var(--ink);color:#fff;width:100%;justify-content:center;padding:11px">Collect reward</span>
    </div>

    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span class="kick">Team vs team &middot; week 24</span><span class="pill" style="background:rgba(255,106,31,.14);color:var(--orange-d)"><i class="ti ti-trophy" aria-hidden="true"></i> &euro;500 pool</span></div>
      <div style="display:flex;flex-direction:column;gap:13px;font-size:13px">
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>&#129351; Design</span><b>12,940 pts</b></div><div style="height:10px;background:#EDE4D2;border-radius:9px"><div style="width:100%;height:100%;background:var(--orange);border-radius:9px"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>&#129352; Sales</span><b>11,120 pts</b></div><div style="height:10px;background:#EDE4D2;border-radius:9px"><div style="width:86%;height:100%;background:var(--blue);border-radius:9px"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>&#129353; Engineering</span><b>9,540 pts</b></div><div style="height:10px;background:#EDE4D2;border-radius:9px"><div style="width:74%;height:100%;background:var(--orange);border-radius:9px"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="color:var(--muted)">4 &middot; Ops</span><span style="color:var(--muted)">7,800 pts</span></div><div style="height:10px;background:#EDE4D2;border-radius:9px"><div style="width:60%;height:100%;background:var(--blue);border-radius:9px"></div></div></div>
      </div>
      <div style="font-size:11.5px;color:var(--muted);margin-top:13px;border-top:1px solid rgba(26,22,16,.1);padding-top:10px"><i class="ti ti-flag" style="color:var(--orange)" aria-hidden="true"></i> 3 days left &middot; winning team splits a &euro;500 shared perk pool</div>
    </div>
  </div>

  <div class="card" style="padding:18px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:13px"><span class="kick">Achievement wall &middot; 9 of 24 earned</span><span class="pill" style="background:rgba(255,106,31,.14);color:var(--orange-d)">2,140 pts</span></div>
    <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:9px">
      <div class="bd" style="background:var(--orange);color:#fff"><i class="ti ti-flame" aria-hidden="true"></i>First spin</div>
      <div class="bd" style="background:var(--blue);color:#fff"><i class="ti ti-shoe" aria-hidden="true"></i>10k steps</div>
      <div class="bd" style="background:var(--orange);color:#fff"><i class="ti ti-gift" aria-hidden="true"></i>Generous</div>
      <div class="bd" style="background:var(--blue);color:#fff"><i class="ti ti-star" aria-hidden="true"></i>Reviewer</div>
      <div class="bd" style="background:var(--orange);color:#fff"><i class="ti ti-bolt" aria-hidden="true"></i>Drop hunter</div>
      <div class="bd" style="background:var(--blue);color:#fff"><i class="ti ti-users" aria-hidden="true"></i>Pool starter</div>
      <div class="bd" style="background:var(--orange);color:#fff"><i class="ti ti-coffee" aria-hidden="true"></i>Barista pal</div>
      <div class="bd" style="background:var(--blue);color:#fff"><i class="ti ti-confetti" aria-hidden="true"></i>5-wk streak</div>
      <div class="bd" style="background:var(--orange);color:#fff"><i class="ti ti-wand" aria-hidden="true"></i>Curator</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Globetrot</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Marathon</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Big spender</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Early bird</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Night owl</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Foodie</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Zen master</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Team captain</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Hype beast</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Scout</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Lucky 7</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Streak 12</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Mystery fan</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Linguist</div>
      <div class="bd" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-crown" aria-hidden="true"></i>Legend</div>
    </div>
  </div>
</div>`;

export default function GamificationScreen() {
  return <div className="perks-screen" dangerouslySetInnerHTML={{ __html }} />;
}
