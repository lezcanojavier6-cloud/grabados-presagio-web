function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function clean(value, max = 160) {
  return String(value ?? "").trim().slice(0, max);
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const q = clean(url.searchParams.get("q"), 120);
    const promosRaw = url.searchParams.get("promos");
    const promos = promosRaw === "1" ? 1 : promosRaw === "0" ? 0 : null;
    const limitRaw = Number(url.searchParams.get("limit") || 200);
    const limit = Math.max(1, Math.min(Number.isFinite(limitRaw) ? limitRaw : 200, 500));

    const where = [];
    const binds = [];

    if (q) {
      const like = `%${q.replace(/[%_]/g, "\\$&")}%`;
      where.push(`(
        nombre LIKE ? ESCAPE '\\'
        OR empresa LIKE ? ESCAPE '\\'
        OR whatsapp LIKE ? ESCAPE '\\'
        OR email LIKE ? ESCAPE '\\'
      )`);
      binds.push(like, like, like, like);
    }

    if (promos !== null) {
      where.push("promos = ?");
      binds.push(promos);
    }

    const clause = where.length ? "WHERE " + where.join(" AND ") : "";

    const listSql = `
      SELECT id, nombre, empresa, whatsapp, email, promos, creado_en, actualizado_en, origen
      FROM clientes
      ${clause}
      ORDER BY id DESC
      LIMIT ?
    `;

    const countSql = `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN promos = 1 THEN 1 ELSE 0 END) AS promos,
        SUM(CASE WHEN promos = 0 THEN 1 ELSE 0 END) AS sin_promos
      FROM clientes
      ${clause}
    `;

    const listStmt = context.env.CLIENTES_DB.prepare(listSql).bind(...binds, limit);
    const countStmt = context.env.CLIENTES_DB.prepare(countSql).bind(...binds);

    const [list, count] = await Promise.all([listStmt.all(), countStmt.first()]);

    return json({
      ok: true,
      clientes: list.results || [],
      resumen: {
        total: Number(count?.total || 0),
        promos: Number(count?.promos || 0),
        sin_promos: Number(count?.sin_promos || 0)
      }
    });
  } catch (e) {
    console.error(e);
    return json({ error: "No se pudo consultar la base de clientes." }, 500);
  }
}
