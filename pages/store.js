// pages/store.js
import { useEffect, useState } from "react";

export default function StorePage() {
  const [out, setOut] = useState(null);
  const [storeId, setStoreId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("storeId");
    if (sid) {
      setStoreId(sid);
      fetch(`/api/store?storeId=${encodeURIComponent(sid)}`)
        .then(r => r.json())
        .then(setOut)
        .catch(err => setOut({ error: String(err) }));
    }
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Store connectivity check</h1>
      <p>Try: <code>/store?storeId=1</code></p>
      <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8 }}>
        {out ? JSON.stringify(out, null, 2) : (storeId ? "Loading..." : "No storeId param.")}
      </pre>
    </main>
  );
}
