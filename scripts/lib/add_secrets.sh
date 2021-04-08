#!/usr/bin/env bash

ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/../..

ENV_FILE=$ROOT_PATH/.env

# Export the vars in .env into your shell:
export $(egrep -v '^#' $ENV_FILE | xargs)

# SECRETS FOR DEVELOPMENT ONLY
kubectl create secret generic -n core discord-db-auth --from-literal=username=$DISCORD_DB_USER --from-literal=password=$DISCORD_DB_PASSWORD

kubectl create secret generic -n core keycloak-db-auth --from-literal=username=$KEYCLOAK_DB_USERNAME --from-literal=password=$KEYCLOAK_DB_PASSWORD
