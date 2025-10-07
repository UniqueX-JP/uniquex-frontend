export default async function handler(req,res){
  const {STRAPI_URL,STRAPI_TOKEN}=process.env;
  if(!STRAPI_URL||!STRAPI_TOKEN) return res.status(500).json({error:"Missing STRAPI_URL/STRAPI_TOKEN"});
  const {brandId,storeId,segment}=req.query;
  const p=new URLSearchParams({ "populate[offer]":"*", publicationState:"live", "sort":"priority:asc", "filters[active][$eq]":"true" });
  if(brandId) p.set("filters[brand][id]",brandId);
  if(storeId){ p.set("filters[$and][0][$or][0][store][id][$eq]",storeId); p.set("filters[$and][0][$or][1][store][$null]","true"); }
  if(segment){ p.set("filters[$and][1][$or][0][segment][$eq]",segment); p.set("filters[$and][1][$or][1][segment][$null]","true"); }
  const r=await fetch(`${STRAPI_URL}/api/rules?${p}`,{headers:{Authorization:`Bearer ${STRAPI_TOKEN}`}});
  const j=await r.json(); if(!r.ok) return res.status(r.status).json(j);
  const rule=j?.data?.[0]; if(!rule) return res.status(200).json({type:"empty"});
  const o=rule.attributes?.offer?.data?.attributes||{};
  const m=o?.media?.data?.[0]?.attributes?.url;
  const url=m&&(m.startsWith("http")?m:`${STRAPI_URL}${m}`);
  res.status(200).json({type:"offer",offer:{title:o.title||o.name||"Offer",description:o.description||"",media:url}});
}
