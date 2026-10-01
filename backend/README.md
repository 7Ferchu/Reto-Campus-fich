# CampusFICH Backend

API REST para autenticación y reservas de las canchas de CampusFICH, preparada para ejecutarse localmente o como Vercel Function.

## Puesta en marcha

1. Crear la base de datos ejecutando los scripts de `../db` en PostgreSQL.
2. Copiar `.env.example` como `.env` y completar `DATABASE_URL` y `JWT_SECRET`.
3. Instalar dependencias:

```bash
npm install
```

4. Aplicar los ajustes de autenticación y reservas:

```bash
npm run db:migrate
npm run db:seed
```

5. Ejecutar el servidor local cuando se quiera probar la API:

```bash
npm run dev
```

La entrada local es `src/local.ts`. La entrada de Vercel es `src/app.ts`, que exporta Hono como `default`.

## Despliegue en Vercel

Vercel detecta `src/app.ts` automáticamente y convierte las rutas Hono en una función serverless Node.js. No se utiliza `serveStatic()` ni se inicia un servidor HTTP dentro de `src/app.ts`.

La aplicación usa `bcrypt`, por lo que debe ejecutarse en Node Runtime y no en Edge Runtime. Las migraciones deben ejecutarse antes del despliegue, nunca al iniciar una función:

```bash
npm run build
npm run db:migrate
```

Configura en Vercel las variables `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` y `CORS_ORIGIN`. No se incluyen orígenes CORS directamente en el código. Para producción utiliza `CORS_ORIGIN=https://campusfich2.infosist.org`; durante desarrollo puedes usar una lista separada por comas, por ejemplo `https://campusfich2.infosist.org,http://localhost:4321`. PostgreSQL debe proceder de un proveedor compatible, como una integración de Neon en Vercel Marketplace.

### Configuración Vercel

Este directorio debe desplegarse como un proyecto Vercel independiente con `backend` como **Root Directory**. Hono detecta `src/app.ts` y utiliza su exportación `default` como Vercel Function. No se debe ejecutar `src/local.ts` durante el despliegue.

Si la contraseña PostgreSQL contiene caracteres reservados (`+`, `/`, `@`, `#`, `?` o `%`), debe estar codificada en la URL. Por ejemplo, `+` se escribe como `%2B` y `/` como `%2F`. El cliente incluye una normalización de compatibilidad para URLs antiguas, pero se recomienda cambiar la contraseña y guardar siempre una URL codificada.

## Credenciales de prueba

Después de ejecutar `db:seed`:

```text
Usuario administrador: IngFer
Contraseña: Campus123
```

El seed convierte la contraseña a bcrypt utilizando 8 saltos.

## Endpoints

```text
GET    /health
POST   /api/auth/login
POST   /api/auth/logout

POST   /api/solicitantes
GET    /api/solicitantes/me

GET    /api/canchas
POST   /api/canchas              (administrador)
PATCH  /api/canchas/:id          (administrador)
DELETE /api/canchas/:id          (administrador)

GET    /api/horarios
POST   /api/horarios              (administrador)
PATCH  /api/horarios/:id          (administrador)
DELETE /api/horarios/:id          (administrador)

POST   /api/reservas
GET    /api/reservas/mis-reservas
PATCH  /api/reservas/:id/cancelar
GET    /api/reservas/admin         (administrador)
PATCH  /api/reservas/admin/:id/estado (administrador)
```

Todas las respuestas siguen esta forma:

```json
{
  "success": true,
  "data": {},
  "message": "Operación realizada correctamente"
}
```
