#!/usr/bin/env bash

ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/../..

ENV_FILE=$ROOT_PATH/.env

# Export the vars in .env into your shell:
export $(egrep -v '^#' $ENV_FILE | xargs)

# SECRETS

# keycloak
kubectl create secret generic -n core keycloak-auth --from-literal=user=$KEYCLOAK_USER --from-literal=password=$KEYCLOAK_PASSWORD
kubectl create secret generic -n core keycloak-db-auth --from-literal=POSTGRES_USER=$KEYCLOAK_DB_USER --from-literal=POSTGRES_PASSWORD=$KEYCLOAK_DB_PASSWORD

# minio secret
kubectl create secret generic -n core minio-secret --from-literal=accesskey=$MINIO_ACCESS_KEY --from-literal=secretkey=$MINIO_SECRET_KEY

# discord
kubectl create secret generic -n core discord-db-auth --from-literal=username=$DISCORD_DB_USER --from-literal=password=$DISCORD_DB_PASSWORD
kubectl create secret generic -n core discord-client --from-literal=id=$DISCORD_CLIENT_ID --from-literal=secret=$DISCORD_CLIENT_SECRET

# poll
kubectl create secret generic -n core poll-db-auth --from-literal=username=$POLL_DB_USER --from-literal=password=$POLL_DB_PASSWORD

# vote
kubectl create secret generic -n core vote-db-auth --from-literal=username=$VOTE_DB_USER --from-literal=password=$VOTE_DB_PASSWORD
 