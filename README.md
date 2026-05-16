# Proyecto-prograweb

### 2. Configurar base de datos
**Opción A — PostgreSQL local existente:**
Ejecuta todo en orden (una línea a la vez):
```bash
createdb tiktok_ulima
psql -d tiktok_ulima -f server/db/schema.sql
```
Si tienes problemas de autenticación (`peer` o `ident`), configura una contraseña para tu usuario:
```bash
sudo -u postgres psql -c "ALTER USER tu_usuario WITH PASSWORD 'postgres';"
```
Luego edita `server/src/db.js` y ajusta `host`, `port`, `user`, `password` según tu configuración.
**Opción B — Cluster local propio (sin permisos de superusuario):**
```bash
# --- Opción recomendada: cluster local propio (sin sudo) ---
initdb -D /tmp/pgdata
echo "unix_socket_directories = '/tmp'" >> /tmp/pgdata/postgresql.conf
pg_ctl -D /tmp/pgdata -l /tmp/pg.log start -o "-p 5433 --unix-socket-directories=/tmp"
PGHOST=/tmp psql -p 5433 -d postgres -c "CREATE DATABASE tiktok_ulima;"
PGHOST=/tmp psql -p 5433 -d tiktok_ulima -f server/db/schema.sql
```
En este caso, `server/src/db.js` ya viene configurado para conectar a puerto `5433` con socket `/tmp`.
Si ya tienes PostgreSQL funcionando y prefieres usarlo:
```bash
createdb tiktok_ulima
psql -d tiktok_ulima -f server/db/schema.sql
```
En ese caso edita `server/src/db.js` y ajusta `host`, `port`, `user`, `password` según tu configuración local.
### 3. Insertar usuario demo
```bash
psql -d tiktok_ulima -c "INSERT INTO usuarios (id, username, email, password_hash, nivel, balance_monedas) VALUES (1, 'demo_user', 'demo@test.com', 'demo', 5, 500);"
PGHOST=/tmp psql -p 5433 -d tiktok_ulima -c "INSERT INTO usuarios (id, username, email, password_hash, nivel, balance_monedas) VALUES (1, 'demo_user', 'demo@test.com', 'demo', 5, 500);"
```
### 4. Iniciar servidores
