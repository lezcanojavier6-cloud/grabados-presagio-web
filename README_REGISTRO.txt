REGISTRO DE CLIENTES - GRABADOS PRESAGIO

El formulario ya está incorporado y pide solo:
- Nombre y apellido
- Comercio o empresa (opcional)
- WhatsApp / celular
- Email
- Consentimiento opcional para promociones

IMPORTANTE:
El formulario NO guarda datos dentro del navegador. Está preparado para usar
Cloudflare Pages Functions + D1, de modo que los registros queden en una base
de datos del proyecto.

Para activarlo:
1. Publicar el proyecto en Cloudflare Pages mediante Git o Wrangler.
   (Pages Functions no funciona con "Direct Upload" del panel.)
2. Crear una base D1 llamada "presagio-clientes".
3. Ejecutar schema.sql sobre esa base.
4. Vincular la base al proyecto Pages con el nombre de variable CLIENTES_DB.
5. Reemplazar REEMPLAZAR_CON_DATABASE_ID en wrangler.jsonc si se despliega con Wrangler.
6. Volver a desplegar.
7. Hacer una prueba real desde el dominio y verificar que el registro quede en D1.

El campo de promociones es opcional y queda guardado por separado.
No hay contraseñas ni cuentas de usuario.
