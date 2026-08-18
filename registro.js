function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizePhone(value) {
  return clean(value, 30).replace(/[^\d+]/g, "");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequestPost(context) {
  try {
    const ct = context.request.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return json({ error: "Solicitud inválida." }, 415);

    const body = await context.request.json();
    if (clean(body.website, 200)) return json({ ok: true }); // honeypot

    const nombre = clean(body.nombre, 120);
    const empresa = clean(body.empresa, 140);
    const whatsapp = normalizePhone(body.whatsapp);
    const email = clean(body.email, 160).toLowerCase();
    const promos = body.promos === true ? 1 : 0;

    if (nombre.length < 2) return json({ error: "Ingresá tu nombre y apellido." }, 400);
    if (whatsapp.length < 8) return json({ error: "Revisá el número de WhatsApp." }, 400);
    if (!isEmail(email)) return json({ error: "Revisá el email ingresado." }, 400);

    const ip = context.request.headers.get("CF-Connecting-IP") || "";
    const userAgent = clean(context.request.headers.get("user-agent"), 300);
    const origin = new URL(context.request.url).hostname;

    await context.env.CLIENTES_DB.prepare(`
      INSERT INTO clientes
      (nombre, empresa, whatsapp, email, promos, creado_en, origen, ip_hash, user_agent)
      VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        nombre=excluded.nombre,
        empresa=CASE WHEN excluded.empresa <> '' THEN excluded.empresa ELSE clientes.empresa END,
        whatsapp=excluded.whatsapp,
        promos=excluded.promos,
        actualizado_en=datetime('now')
    `).bind(
      nombre, empresa, whatsapp, email, promos, origin,
      await sha256(ip), userAgent
    ).run();

    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: "No se pudo guardar el registro. Intentá nuevamente." }, 500);
  }
}

async function sha256(text) {
  if (!text) return "";
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}
