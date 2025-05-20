#!/bin/bash
set -e

DB_NAME="tu-db"

# Espera a que Mongo esté listo (opcional pero recomendable)
sleep 5

# Importa cada JSON como colección
for f in /docker-entrypoint-initdb.d/export/$DB_NAME/*.json; do
  coll=$(basename "$f" .json)
  echo "Importando colección '$coll' desde '$f'…"
  mongoimport \
    --host localhost \
    --db "$DB_NAME" \
    --collection "$coll" \
    --file "$f" \
    --jsonArray \
    --drop
done

echo "Restauración completada."
