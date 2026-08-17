function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}
function clean(v,m){return String(v??"").trim().slice(0,m)}
function phone(v){return clean(v,30).replace(/[^\d+]/g,"")}
function emailOk(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
export async function onRequestPost(c){try{
  if(!(c.request.headers.get("content-type")||"").includes("application/json"))return json({error:"Solicitud inválida."},415);
  const b=await c.request.json(); if(clean(b.website,100))return json({ok:true});
  const nombre=clean(b.nombre,120),whatsapp=phone(b.whatsapp),email=clean(b.email,160).toLowerCase(),empresa=clean(b.empresa,140),servicio=clean(b.servicio,100),archivo=clean(b.archivo,120),origen=clean(b.origen,80),campana=clean(b.campana,160),medio=clean(b.medio,80),termino=clean(b.termino,180);
  let detalle=clean(b.detalle,2600); if(medio||termino)detalle=clean(`${detalle}${medio?` | medio:${medio}`:''}${termino?` | termino:${termino}`:''}`,3000);
  if(nombre.length<2)return json({error:"Ingresá tu nombre y apellido."},400);
  if(whatsapp.length<8)return json({error:"Revisá tu WhatsApp/celular."},400);
  if(!emailOk(email))return json({error:"Revisá tu email."},400);
  if(!c.env.CLIENTES_DB)return json({error:"Base de clientes no configurada."},500);
  await c.env.CLIENTES_DB.prepare(`INSERT INTO clientes(nombre,empresa,whatsapp,email,promos,creado_en,origen) VALUES(?,?,?,?,0,datetime('now'),?) ON CONFLICT(email) DO UPDATE SET nombre=excluded.nombre,empresa=CASE WHEN excluded.empresa<>'' THEN excluded.empresa ELSE clientes.empresa END,whatsapp=excluded.whatsapp,actualizado_en=datetime('now'),origen=excluded.origen`).bind(nombre,empresa,whatsapp,email,origen||"web").run();
  const r=await c.env.CLIENTES_DB.prepare(`INSERT INTO consultas(email,whatsapp,servicio,archivo,detalle,origen,campana,creado_en) VALUES(?,?,?,?,?,?,?,datetime('now'))`).bind(email,whatsapp,servicio,archivo,detalle,origen,campana).run();
  return json({ok:true,id:r.meta?.last_row_id||null});
}catch(e){console.error(e);return json({error:"No se pudo guardar la consulta."},500)}}
