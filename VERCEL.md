# Despliegue de CampusFICH en Vercel

El repositorio utiliza Vercel Services mediante el `vercel.json` de la raíz. Astro y Hono se construyen como servicios independientes dentro de un único proyecto y comparten el dominio.

## Proyecto frontend

- Servicio: `frontend`
- Root: `frontend`
- Framework: `Astro`
- Build Command: `npm run build`
- Output Directory: `dist`
- Variable de producción:

```env
PUBLIC_API_URL=/api
```

## Proyecto backend

- Servicio: `backend`
- Root: `backend`
- Framework: `Hono`
- Build Command: `npm run build`
- Entry point: `src/app.ts`
- Runtime: Node.js

Variables requeridas:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://campusfich2.infosist.org
```

Hono se despliega sin configuración adicional cuando `src/app.ts` exporta la instancia como `default`. `src/local.ts` solo se utiliza para desarrollo local.

## Dominio, rewrites y CORS

El dominio del frontend será:

```text
https://campusfich2.infosist.org
```

El backend debe usar como mínimo:

```env
CORS_ORIGIN=https://campusfich2.infosist.org
```

Para desarrollo local:

```env
CORS_ORIGIN=https://campusfich2.infosist.org,http://localhost:4321
```

El rewrite público es:

```text
/api/* → backend
/*     → frontend
```

Por eso el cliente del frontend utiliza `PUBLIC_API_URL=/api` y no necesita conocer un hostname interno. El backend no llama al frontend, por lo que no se agregó ninguna binding de servicio.

El dominio público del proyecto es `https://campusfich2.infosist.org`.
