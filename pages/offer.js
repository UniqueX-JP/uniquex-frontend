import {useEffect,useState} from "react";
import {useRouter} from "next/router";
export default function Offer(){const {query,isReady}=useRouter();const [d,setD]=useState(),[e,setE]=useState();
useEffect(()=>{if(!isReady)return;const q=new URLSearchParams({brandId:query.brandId||"",storeId:query.storeId||"",segment:query.seg||""});
fetch(`/api/experience?${q}`).then(r=>r.json()).then(setD).catch(x=>setE(x.message));},[isReady,query]);
if(e) return <p>Error: {e}</p>; if(!d) return <p>Loading…</p>; if(d.type==="empty") return <p>No matching offer.</p>;
const o=d.offer; return (<main style={{fontFamily:'system-ui',padding:24}}><h1>{o.title}</h1><p>{o.description}</p>{o.media&&<img src={o.media} style={{maxWidth:"100%"}}/>}</main>);}
