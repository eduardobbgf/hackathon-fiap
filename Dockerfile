# Dockerfile (na raiz do projeto)

# --- Estágio 1: Builder ---
# Usamos uma imagem Node.js completa para ter as ferramentas de build (como python, g++)
FROM node:18 AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências do monorepo
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Instala todas as dependências do monorepo
# Usamos --frozen-lockfile para garantir builds consistentes
RUN npm install --frozen-lockfile

# Copia todo o resto do código-fonte (apps e libs)
COPY . .

# Argumento que será passado pelo docker-compose para nos dizer qual app buildar
ARG APP_NAME
RUN npx nest build ${APP_NAME}


# --- Estágio 2: Runner (Produção) ---
# Começamos de novo com uma imagem Node.js limpa e leve (alpine) para o ambiente final
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# 1. INSTALA DEPENDÊNCIAS DE SISTEMA
#    - `ffmpeg` para o video-service
#    - `bash` é útil para debugging (opcional, mas recomendado)
RUN apk update && apk add --no-cache ffmpeg bash

# Copia o package.json para instalar apenas as dependências de PRODUÇÃO
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install --omit=dev --frozen-lockfile

# Copia os artefatos buildados do estágio 'builder'
# A pasta de destino será, por exemplo, /usr/src/app/dist/apps/user-service
COPY --from=builder /usr/src/app/dist ./dist

# O comando para iniciar a aplicação será definido no docker-compose
# Este ENTRYPOINT prepara o contêiner para rodar comandos node
ENTRYPOINT ["node"]
