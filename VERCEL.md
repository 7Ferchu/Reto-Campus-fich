# Despliegue de CampusFICH en Vercel

La documentación oficial de Vercel recomienda crear dos proyectos para este monorepo, uno por aplicación. No se utiliza un `vercel.json` en la raíz para combinar Astro y Hono con la configuración legacy `builds`.

## Proyecto frontend

- Root Directory: `frontend`
- Framework Preset: `Astro`
- Build Command: `npm run build`
- Output Directory: `dist`
- Variable de producción:

```env
PUBLIC_API_URL=https://api.campusfich2.infosist.org/api
```

## Proyecto backend

- Root Directory: `backend`
- Framework Preset: `Other` o detección automática de Hono
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

## Dominio y CORS

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

El backend puede publicarse como `https://api.campusfich2.infosist.org`. Si se usa ese subdominio, el frontend debe definir `PUBLIC_API_URL=https://api.campusfich2.infosist.org/api` en las variables de Vercel.
