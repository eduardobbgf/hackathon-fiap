#!/bin/bash

# --- CONFIGURAÇÃO ---
# O número de vídeos que você quer enviar para a fila.
NUM_UPLOADS=10

# O caminho para o arquivo de vídeo que será enviado.
# Crie um pequeno arquivo de vídeo de teste e coloque o caminho aqui.
VIDEO_FILE="./video.mp4"
USERID="93c4b8b5-1625-4947-9750-267454ed9ce0"
# O token de autenticação do usuário.
# ATENÇÃO: Este token tem um tempo de expiração! Se o script falhar com erro 401,
# você precisará gerar um novo token no seu endpoint de login e colá-lo aqui.
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5M2M0YjhiNS0xNjI1LTQ5NDctOTc1MC0yNjc0NTRlZDljZTAiLCJlbWFpbCI6ImpvdGFAZW1haWwuY29tIiwibmFtZSI6Ikpvw6NvIGRhIFNpbHZhIiwiaWF0IjoxNzU5MTA4NTkzLCJleHAiOjE3NTkxMDk0OTN9.TruR4Nnykcz7fY0C3t5ZCIt56Y3WUUyPcxnAiCdyyuQ"

# A URL do seu endpoint de upload.
UPLOAD_URL="http://localhost:3001/api/v1/videos/upload"
# --------------------

# Verifica se o arquivo de vídeo de teste existe.
if [ ! -f "$VIDEO_FILE" ]; then
    echo "Erro: Arquivo de vídeo de teste não encontrado em '$VIDEO_FILE'"
    echo "Por favor, crie um arquivo de vídeo de exemplo e atualize a variável VIDEO_FILE no script."
    exit 1
fi

echo "🚀 Iniciando teste de carga: Enviando $NUM_UPLOADS vídeos para a fila..."
echo "--------------------------------------------------------------------"

# Loop para fazer as chamadas curl.
for i in $(seq 1 $NUM_UPLOADS )
do
   echo "Enviando upload #$i de $NUM_UPLOADS..."
   
   # Executa o comando curl.
   # A flag -s silencia a barra de progresso e a -o /dev/null descarta a saída do corpo da resposta.
   # A flag -w mostra apenas o código de status HTTP no final.
   STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
     --location \
     --request POST "$UPLOAD_URL" \
     --header "Authorization: Bearer $AUTH_TOKEN" \
     --form "file=@\"$VIDEO_FILE\""\
     --form 'userId="2552a1d0-af8c-4859-8b43-b42cf4d1cfa3"')
     
   echo "Upload #$i concluído com status HTTP: $STATUS_CODE"
   echo "---"
done

echo "✅ Teste concluído! $NUM_UPLOADS mensagens foram enviadas para a fila."
echo "Observe os logs do seu 'video-service' para ver o processamento."
echo "Você também pode checar a interface do RabbitMQ em http://localhost:15672"
