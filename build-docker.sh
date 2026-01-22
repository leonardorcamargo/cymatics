#!/bin/bash

# Script para build da aplicação Electron usando Docker
# Útil para gerar builds de Windows a partir do Linux

IMAGE="electronuserland/builder:wine"
PROJECT_DIR="$(pwd)"

# Garante que o diretório node_modules não seja montado do host
docker run --rm -it \
  -v "$PROJECT_DIR":/project \
  -w /project \
  "$IMAGE" \
  /bin/bash -c "npm install && npm run build:win"
