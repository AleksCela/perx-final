import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import PerkMap, { type MapSpot } from "../../components/PerkMap";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  await requireUser();

  const offers = await prisma.offer.findMany({
    where: { active: true },
    include: { provider: true, category: true },
    orderBy: { createdAt: "asc" },
  });

  // Group offers by provider so each location is one pin on the map.
  const byProvider = new Map<string, MapSpot>();
  for (const o of offers) {
    let spot = byProvider.get(o.providerId);
    if (!spot) {
      spot = {
        id: o.provider.id,
        name: o.provider.name,
        color: o.provider.color,
        city: o.provider.city,
        distanceKm: o.distanceKm,
        location: o.location,
        offers: [],
      };
      byProvider.set(o.providerId, spot);
    }
    spot.offers.push({ id: o.id, title: o.title, price: o.price, icon: o.icon, category: o.category.name });
    if (o.distanceKm != null && (spot.distanceKm == null || o.distanceKm < spot.distanceKm)) {
      spot.distanceKm = o.distanceKm;
    }
    if (!spot.location && o.location) spot.location = o.location;
  }

  const spots = [...byProvider.values()].sort(
    (a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999),
  );
  const nearby = spots.filter((s) => s.distanceKm != null && s.distanceKm <= 5).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", flexWrap: "wrap" }}>
        <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>Perks near you</span>
        <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}><i className="ti ti-map-2" /> Map view</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
          {nearby} spots within a short walk · tap a pin to see what&apos;s on
        </span>
      </div>

      <PerkMap spots={spots} />
    </div>
  );
}
