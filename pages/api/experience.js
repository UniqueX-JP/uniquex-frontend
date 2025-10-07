export default async function handler(req, res) {
  try {
    const { STRAPI_URL, STRAPI_TOKEN } = process.env;
    if (!STRAPI_URL || !STRAPI_TOKEN) return res.status(500).json({ error: "Missing STRAPI_URL/STRAPI_TOKEN" });

    const { brandId, storeId, segment } = req.query;

    // Build a SIMPLE Strapi request (no $and/$or)
    const p = new URLSearchParams({
      "populate[offer]": "*",
      "populate[store]": "*",
      publicationState: "live",
      sort: "priority:asc",
      "filters[active][$eq]": "true",
    });
    if (brandId) p.set("filters[brand][id]", brandId);

    const resp = await fetch(`${STRAPI_URL}/api/rules?${p}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });
    const json = await resp.json();
    if (!resp.ok) return res.status(resp.status).json(json);

    const rules = json?.data || [];
    const now = new Date();

    // Filter client-side: first rule where store/segment/time match
    const match = rules.find((r) => {
      const a = r.attributes || {};
      const storeOK =
        !a.store?.data || (storeId && String(a.store.data.id) === String(storeId));
      const segOK = !a.segment || (segment && a.segment === segment);
      const fromOK = !a.valid_from || now >= new Date(a.valid_from);
      const toOK = !a.valid_to || now <= new Date(a.valid_to);
      return storeOK && segOK && fromOK && toOK;
    });

    if (!match) return res.status(200).json({ type: "empty" });

    const o = match.attributes?.offer?.data?.attributes || {};
    const rel = o?.media?.data?.[0]?.attributes?.url;
    const media = rel && (rel.startsWith("http") ? rel : `${STRAPI_URL}${rel}`);

    return res.status(200).json({
      type: "offer",
      offer: { title: o.title || o.name || "Offer", description: o.description || "", media },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
