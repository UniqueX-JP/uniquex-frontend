// pages/api/store.js
export default async function handler(req, res) {
  try {
    const { storeId } = req.query;
    if (!storeId) return res.status(400).json({ error: "Missing storeId" });

    const base = process.env.STRAPI_URL?.replace(/\/$/, "");
    const r = await fetch(`${base}/api/stores/${storeId}?populate=*`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      cache: "no-store",
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    return res.status(200).json({
      ok: true,
      id: data?.data?.id,
      name: data?.data?.attributes?.name,
      brand: data?.data?.attributes?.brand?.data?.attributes?.name,
      raw: data,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
