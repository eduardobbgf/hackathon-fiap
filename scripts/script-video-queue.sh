#!/bin/bash

# --- Configuração ---
ENDPOINT="http://localhost:3001/api/v1/videos/upload"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmOWUzOTViYi0yYjRjLTQwNjUtYjA4MC1iMGU2NTQxMDFmN2MiLCJlbWFpbCI6ImpvdGFAeW9wbWFpbC5jb20iLCJuYW1lIjoiSm_Do28gZGEgU2lsdmEiLCJpYXQiOjE3NTkyODQ0OTgsImV4cCI6MTc1OTI5MzQ5OH0.wVk0Uq_n_Y_BnYA7giEJwuCcSyBkOhZAlL1dwwL6csk"
VIDEO_FILE="./video.mp4"
USER_ID="f9e395bb-2b4c-4065-b080-b0e654101f7c"
USER_EMAIL="jota@yopmail.com"
TOTAL_REQUESTS=50

# --- Loop de Execução ---
for (( i=1; i<=TOTAL_REQUESTS; i++ )); do
  echo "----------------------------------------"
  echo "Enviando requisição $i de $TOTAL_REQUESTS..."
  echo "----------------------------------------"

  curl --location --request POST "$ENDPOINT" \
  --header "Authorization: Bearer $TOKEN" \
  --form "file=@\"$VIDEO_FILE\"" \
  --form "userId=\"$USER_ID\"" \
  --form "userEmail=\"$USER_EMAIL\""

  echo "\n" # Adiciona uma linha em branco para melhor visualização
done

echo "Script concluído. $TOTAL_REQUESTS requisições enviadas."