# API de reservas de canchas

API REST de reservas para la Evaluación P1 de Desarrollo Web Avanzado. El proyecto usa Express en capas, PostgreSQL en Docker, Prisma ORM 7 con el adaptador `PrismaPg`, autenticación JWT y contraseñas cifradas con bcrypt.

## Variante y datos locales

La variante del estudiante es **9**: Pádel 3 y Ecuavóley 3, el 23 de noviembre de 2026, con horarios UTC de 08:00 a 10:00 y de 10:00 a 12:00. El puerto local de Express es **3099**. Completa `STUDENT_NAME` y `STUDENT_EMAIL` en `.env` antes de ejecutar el seed.

## Iniciar el proyecto

1. Abre Docker Desktop.
2. En la raíz del proyecto ejecuta `docker compose up -d`.
3. Instala dependencias si aún no están instaladas: `npm install`.
4. Aplica la migración y genera Prisma Client: `npx prisma migrate dev --name init` y `npx prisma generate`.
5. Completa `STUDENT_NAME` y `STUDENT_EMAIL` en `.env` y carga los datos: `npx prisma db seed`.
6. Inicia Express con `npm run dev` y abre `http://localhost:3099`.

PostgreSQL se publica en `localhost:5433` y pgAdmin en `http://localhost:5050`. La aplicación se conecta con `DATABASE_URL` de `.env`. pgAdmin usa `admin@espe.com` / `admin_password`; PostgreSQL usa la conexión definida en `.env`.

El seed recrea los datos de evaluación: administrador `paulo.galarza@example.com` / `admin123`, usuario de la variante / `user123`, dos horarios y dos reservas. Las contraseñas quedan cifradas con bcrypt (costo 10). El seed borra primero reservas, horarios y usuarios para poder ejecutarse de nuevo.

## Endpoints

| Método | Ruta | Acceso | Función |
| --- | --- | --- | --- |
| GET | `/` | Público | Salud básica: `Hello World` |
| POST | `/api/auth/register` | Público | Registrar usuario USER |
| POST | `/api/auth/login` | Público | Obtener JWT de 4 horas |
| GET | `/api/auth/protected-route` | JWT | Verificar autenticación |
| POST | `/api/admin/schedules` | ADMIN | Crear horario de cancha |
| GET | `/api/admin/bookings` | ADMIN | Listar reservas con usuario y horario |
| POST | `/api/bookings` | JWT | Crear reserva; el usuario sale del token |
| GET | `/api/bookings/:id` | Dueño o ADMIN | Consultar reserva |
| PUT | `/api/bookings/:id` | Dueño o ADMIN | Cambiar fecha u horario, sin cambiar dueño |
| DELETE | `/api/bookings/:id` | Dueño o ADMIN | Eliminar reserva |
| GET | `/api/users/:id/bookings` | Dueño o ADMIN | Historial con horario incluido |

Las reservas no permiten duplicar la misma combinación de fecha y horario. `authorizeBooking` devuelve 404 si no existe y 403 si el solicitante no es su dueño ni ADMIN. `authorizeUser` restringe el historial al dueño o ADMIN.

## Postman

Importa `postman/EVAL_P1_Davalos.postman_collection.json` y `postman/EVAL_P1.example.postman_environment.json`. Completa el entorno con tus credenciales locales o las de Render y ejecuta las solicitudes en orden para capturar tokens e IDs. El entorno local con credenciales reales queda excluido de Git.

## Render

El archivo `render.yaml` define un Blueprint con Web Service Node, PostgreSQL y las variables de entorno. Conecta un repositorio GitHub propio a Render y selecciona **New + → Blueprint** para usarlo. Render solicitará `STUDENT_NAME`, `STUDENT_EMAIL`, `STUDENT_PASSWORD` y `ADMIN_PASSWORD`; define contraseñas seguras para ambos usuarios. `JWT_SECRET` se genera automáticamente.

El servicio aplica migraciones pendientes y ejecuta `npm run seed:render` al arrancar. Este seed es repetible y crea los datos de evaluación sin borrar reservas existentes. El endpoint `/` sirve como health check. Render asigna el puerto automáticamente.

El Blueprint usa el plan Free para evitar cargos: el servicio web se suspende tras 15 minutos sin tráfico y vuelve a activarse con la siguiente petición; la base PostgreSQL Free caduca a los 30 días. Revisa las limitaciones vigentes de Render antes de mantener datos allí por más tiempo.
