import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { setPersona } from "./actions";

export const dynamic = "force-dynamic";

const ROLE_META: Record<string, { label: string; icon: string; blurb: string }> = {
  EMPLOYEE: { label: "Employee", icon: "ti-user", blurb: "Browse, build combos & spend your welfare budget" },
  ADMIN: { label: "Employer · HR", icon: "ti-shield-half", blurb: "Approve selections, route payments, see savings" },
  PROVIDER: { label: "Provider", icon: "ti-building-store", blurb: "See bookings and payments land" },
};

export default async function PersonaPicker() {
  const current = await getCurrentUser();
  if (current) {
    if (current.role === "ADMIN") redirect("/admin");
    if (current.role === "PROVIDER") redirect("/provider");
    redirect("/marketplace");
  }

  const users = await prisma.user.findMany({
    include: { department: true, company: true, provider: true },
    orderBy: { createdAt: "asc" },
  });

  const employees = users.filter((u) => u.role === "EMPLOYEE");
  const others = users.filter((u) => u.role !== "EMPLOYEE");

  function Card({ u }: { u: (typeof users)[number] }) {
    const meta = ROLE_META[u.role];
    const sub =
      u.role === "PROVIDER"
        ? u.provider?.name
        : u.role === "ADMIN"
        ? `${u.company?.name} · People & Culture`
        : `${u.company?.name} · ${u.department?.name}`;
    return (
      <form action={setPersona}>
        <input type="hidden" name="userId" value={u.id} />
        <button
          type="submit"
          className="card hover-lift"
          style={{
            width: "100%",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 16,
            cursor: "pointer",
          }}
        >
          <span className="av" style={{ width: 46, height: 46, background: u.color, fontSize: 15 }}>
            {u.initials}
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontWeight: 600, fontSize: 16 }}>{u.name}</span>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{sub}</span>
          </span>
          <span className="pill" style={{ background: "rgba(26,22,16,.06)", color: "var(--muted)" }}>
            <i className={`ti ${meta.icon}`} /> {meta.label}
          </span>
          <i className="ti ti-arrow-right" style={{ color: "var(--orange)", fontSize: 18 }} />
        </button>
      </form>
    );
  }

  return (
    <div className="shell" style={{ maxWidth: 920 }}>
      <div className="logo" style={{ fontSize: 30, marginTop: 20 }}>
        perx<span>.</span>
      </div>
      <div className="kick" style={{ color: "var(--orange-d)", margin: "26px 0 10px" }}>
        Built for Tirana · ready for the world
      </div>
      <h1 className="d" style={{ fontSize: 52, lineHeight: 0.98, fontWeight: 700, maxWidth: 720, margin: 0 }}>
        The perks employees actually want,<br />
        <span style={{ color: "var(--orange)" }}>the talent edge companies need.</span>
      </h1>
      <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 600, marginTop: 16 }}>
        A two-sided benefits marketplace. Pick a demo persona to step into the
        product — the same data, three different points of view.
      </p>

      <div className="section-label" style={{ marginTop: 40 }}>
        Employees · {employees[0]?.company?.name ?? "TeamSystem"}
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {employees.map((u) => (
          <Card key={u.id} u={u} />
        ))}
      </div>

      <div className="section-label" style={{ marginTop: 32 }}>
        The other side of the marketplace
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {others.map((u) => (
          <Card key={u.id} u={u} />
        ))}
      </div>

      <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 30 }}>
        Tip: enter as <b>Kedi Kacorri</b> to browse & build a combo, then as{" "}
        <b>Elira Hysa</b> (HR) to approve it and watch the simulated payment route to providers.
      </p>
    </div>
  );
}
