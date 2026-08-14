function unauthorized() {
  return new Response("Acceso restringido", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Clientes Presagio", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function onRequest(context) {
  const expectedUser = context.env.ADMIN_USER;
  const expectedPass = context.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new Response("Panel no configurado", { status: 503 });
  }

  const auth = context.request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(":");
    if (sep < 0) return unauthorized();

    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);

    if (!safeEqual(user, expectedUser) || !safeEqual(pass, expectedPass)) {
      return unauthorized();
    }

    return context.next();
  } catch {
    return unauthorized();
  }
}
