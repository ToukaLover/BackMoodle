#!/bin/bash
set -e

DB_NAME="tu-db"
MONGO_HOST="host.docker.internal"

sleep 3

for f in /export/$DB_NAME/*.json; do
  coll=$(basename "$f" .json)
  echo "Importando colección '$coll' desde '$f' con orden automático…"

  # Añadir campo __orden con jq (posición del documento)
  TMP_FILE="/tmp/${coll}_with_order.json"
  jq 'to_entries | map(.value + {__orden: .key})' "$f" > "$TMP_FILE"

  # Importar el JSON modificado sin autenticación
  mongoimport \
    --host "$MONGO_HOST" \
    --port 27017 \
    --db "$DB_NAME" \
    --collection "$coll" \
    --file "$TMP_FILE" \
    --jsonArray \
    --drop
done

echo "Importación completada."
