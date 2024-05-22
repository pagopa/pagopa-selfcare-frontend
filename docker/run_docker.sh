#!/bin/bash

# sh ./run_docker.sh


# Controlla se il file .env.development.local esiste
if [ ! -f ../.env.development.local ]; then
  echo ".env.development.local file not found!"
  exit 1
fi

# Leggi il file e setta le variabili d'ambiente
while IFS='=' read -r key value; do
  # Ignora le righe vuote o i commenti
  if [[ -z "$key" || "$key" =~ ^\s*# ]]; then
    continue
  fi

  # Rimuove eventuali spazi bianchi attorno a chiave e valore
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  # Esporta la variabile d'ambiente
  export "$key"="$value"
done < ../.env.development.local

export REACT_APP_ENV=dev
echo "Environment variables set from .env.development.local"

#yarn install
#yarn generate
yarn build

stack_name=$(cd .. && basename "$PWD")
docker compose -p "${stack_name}" up -d --remove-orphans --force-recreate --build


