# E-commerce Bruja - Frontend

Este proyecto es el frontend de un e-commerce desarrollado en Angular. Actualmente está configurado para que el desarrollador frontend trabaje exclusivamente en el dashboard de administración.

## 🚀 Descripción
El objetivo es construir un dashboard de administración moderno y funcional para gestionar productos, órdenes y usuarios. El proyecto ya está configurado para que, al levantarlo, se muestre directamente el dashboard.

## 📦 Requerimientos
- Node.js v20.x (usa `nvm use` para la versión correcta)
- Angular CLI v17+
- Acceso a Firebase (solo si se requiere integración, no necesario para desarrollo de UI)

## ⚙️ Instalación
1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPO>
   cd e-commerce-bruja
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Usa la versión de Node recomendada:
   ```bash
   nvm use
   ```

## 🖥️ Uso
Para levantar el proyecto en modo desarrollo:
```bash
ng serve
```
Esto abrirá la app en [http://localhost:4200](http://localhost:4200) y mostrará directamente el dashboard de administración.

## 📁 Estructura de carpetas relevante
- `src/app/features/admin/` → Aquí está el dashboard y sus páginas/componentes
- `src/app/app.routes.ts` → Configuración de rutas (el dashboard es la ruta principal)
- `src/environments/` → Variables de entorno (no se suben al repo)

## 🧑‍💻 Buenas prácticas
- Usa componentes standalone y Angular 17+
- Mantén los estilos y templates en archivos separados
- Sigue la estructura de carpetas por feature
- No subas credenciales ni archivos de entorno
- Haz commits claros y descriptivos

## 📝 Notas
- El backend y la integración con Firebase están fuera del alcance de este repo para el frontend.
- Si necesitas agregar librerías, consulta primero con el equipo.

## 📬 Contacto
Para dudas o soporte, contacta a Juan Espeche.
