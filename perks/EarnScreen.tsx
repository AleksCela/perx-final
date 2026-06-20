import React from "react";

const __html = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css');
.eb .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.eb{--orange:#FF6A1F;--orange-d:#B23C0A;--blue:#1F5BE0;--blue-d:#15347E;--ink:#1A1610;--muted:#6E6657;font-family:'Hanken Grotesk',sans-serif;color:var(--ink);border-radius:24px;padding:20px;overflow:hidden;background:linear-gradient(100deg,#F7F2E8 0%,#F0E6D4 100%)}
.eb .d{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.eb .card{background:#FFFDF8;border:1px solid rgba(26,22,16,.1);border-radius:18px}
.eb .pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600}
.eb .kick{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.eb .stamp{aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600}
.eb .badge{aspect-ratio:1;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:9.5px;text-align:center;padding:5px}
.eb .badge i{font-size:20px}
</style>
<div class="eb">
  <h2 class="sr-only">Earn and Wallet screen: stamp card, ways to earn, weekly spin, badges and steps championship.</h2>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px">
    <div>
      <div class="kick" style="color:var(--blue-d)">Wallet &middot; earn</div>
      <div class="d" style="font-size:40px;font-weight:600;line-height:1;margin-top:4px">Stack your points</div>
    </div>
    <div style="text-align:right">
      <div class="d" style="font-size:38px;font-weight:700;color:var(--orange);line-height:1">2,140</div>
      <div style="font-size:12px;color:var(--blue-d);font-weight:500">Gold &middot; 360 to Platinum</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:16px;margin-bottom:16px">
    <div style="background:var(--ink);border-radius:18px;padding:20px;color:#FBF6EC">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="pill" style="background:var(--orange);color:#fff"><i class="ti ti-stamp" aria-hidden="true"></i> Stamp card &middot; September</span>
        <span style="font-size:12px;color:rgba(251,246,236,.65)">8 / 10 &rarr; free perk</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:11px">
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:var(--orange);color:#fff">&check;</div>
        <div class="stamp" style="background:rgba(255,255,255,.1);border:1.5px dashed rgba(255,255,255,.4);color:rgba(255,255,255,.6)">9</div>
        <div class="stamp" style="background:rgba(31,91,224,.3);border:1.5px dashed #6f9bff;color:#fff">&#127873;</div>
      </div>
      <div style="font-size:12.5px;color:rgba(251,246,236,.7);margin-top:14px">2 more bookings unlocks a free perk on the house</div>
    </div>

    <div style="background:var(--orange);border-radius:18px;padding:20px;text-align:center;color:#fff">
      <span class="pill" style="background:#fff;color:var(--orange-d)"><i class="ti ti-confetti" aria-hidden="true"></i> Check-in landed</span>
      <div class="d" style="font-size:42px;font-weight:800;margin:14px 0 2px">+120</div>
      <div style="font-size:13px;color:rgba(255,255,255,.9)">You spun <b>Double-points Friday</b></div>
      <div style="font-size:34px;margin:10px 0"><i class="ti ti-ferris-wheel" aria-hidden="true"></i></div>
      <div style="font-size:12px;color:rgba(255,255,255,.85)">&#128293; 5-week streak</div>
    </div>
  </div>

  <div class="card" style="padding:18px;margin-bottom:16px">
    <div class="kick" style="color:var(--blue-d);margin-bottom:13px">Ways to earn</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:11px;font-size:13.5px">
      <div style="display:flex;align-items:center;gap:9px"><span class="pill" style="background:var(--orange);color:#fff">+50</span> Book a perk</div>
      <div style="display:flex;align-items:center;gap:9px"><span class="pill" style="background:var(--blue);color:#fff">+25</span> Review w/ photo</div>
      <div style="display:flex;align-items:center;gap:9px"><span class="pill" style="background:var(--orange);color:#fff">+120</span> Weekly spin</div>
      <div style="display:flex;align-items:center;gap:9px"><span class="pill" style="background:var(--blue);color:#fff">+15</span> Gift a teammate</div>
      <div style="display:flex;align-items:center;gap:9px"><span class="pill" style="background:var(--orange);color:#fff">+200</span> Refer a provider</div>
      <div style="display:flex;align-items:center;gap:9px"><span class="pill" style="background:var(--blue);color:#fff">+80</span> Win a step race</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px">
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:13px">
        <span class="kick" style="color:var(--blue-d)">Badge wall &middot; 9 of 24</span>
        <span class="pill" style="background:rgba(255,106,31,.14);color:var(--orange-d)">View all</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:9px">
        <div class="badge" style="background:var(--orange);color:#fff"><i class="ti ti-flame" aria-hidden="true"></i>First spin</div>
        <div class="badge" style="background:var(--blue);color:#fff"><i class="ti ti-shoe" aria-hidden="true"></i>10k steps</div>
        <div class="badge" style="background:var(--orange);color:#fff"><i class="ti ti-gift" aria-hidden="true"></i>Generous</div>
        <div class="badge" style="background:var(--blue);color:#fff"><i class="ti ti-star" aria-hidden="true"></i>Reviewer</div>
        <div class="badge" style="background:var(--orange);color:#fff"><i class="ti ti-bolt" aria-hidden="true"></i>Drop hunter</div>
        <div class="badge" style="background:var(--blue);color:#fff"><i class="ti ti-users" aria-hidden="true"></i>Pool starter</div>
        <div class="badge" style="background:var(--orange);color:#fff"><i class="ti ti-coffee" aria-hidden="true"></i>Barista pal</div>
        <div class="badge" style="background:var(--blue);color:#fff"><i class="ti ti-confetti" aria-hidden="true"></i>5-wk streak</div>
        <div class="badge" style="background:var(--orange);color:#fff"><i class="ti ti-wand" aria-hidden="true"></i>Curator</div>
        <div class="badge" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Locked</div>
        <div class="badge" style="background:#EDE4D2;color:var(--muted)"><i class="ti ti-lock" aria-hidden="true"></i>Locked</div>
        <div class="badge" style="background:#EDE4D2;color:var(--muted)">+13</div>
      </div>
    </div>

    <div class="card" style="padding:18px">
      <span class="pill" style="background:var(--blue);color:#fff"><i class="ti ti-trophy" aria-hidden="true"></i> Step championship</span>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:9px;font-size:13.5px">
        <div style="display:flex;justify-content:space-between"><span>&#129351; You</span><b>84,210</b></div>
        <div style="height:8px;background:#EDE4D2;border-radius:9px"><div style="width:100%;height:100%;background:var(--orange);border-radius:9px"></div></div>
        <div style="display:flex;justify-content:space-between;color:var(--muted)"><span>&#129352; Priya</span><span>81,540</span></div>
        <div style="height:8px;background:#EDE4D2;border-radius:9px"><div style="width:96%;height:100%;background:var(--blue);border-radius:9px"></div></div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:12px">Leader wins the Marathon badge + 300 pts</div>
    </div>
  </div>
</div>`;

export default function EarnScreen() {
  return <div className="perks-screen" dangerouslySetInnerHTML={{ __html }} />;
}
