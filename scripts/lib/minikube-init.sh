#!/usr/bin/env bash
set -o errexit

# Get project root path
ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/../..

# create default namespace
kubectl create namespace $DEFAULT_NAMESPACE || true

kubectl config set-context  --current --namespace $DEFAULT_NAMESPACE

# addons
minikube addons enable ingress -p $CLUSTER_NAME

# helm
helm repo add appscode https://charts.appscode.com/stable/
helm repo add codecentric https://codecentric.github.io/helm-charts
helm repo add strimzi https://strimzi.io/charts/
helm repo add minio https://helm.min.io/
helm repo update

# strimzi
helm install kafka-operator strimzi/strimzi-kafka-operator --namespace kube-system --set watchNamespaces="{$DEFAULT_NAMESPACE}"

# minio
helm install --namespace minio-operator --create-namespace --generate-name minio/minio-operator

# kubedb
helm install kubedb-operator --version v0.13.0-rc.0 --namespace kube-system appscode/kubedb
kubectl rollout status -w deployment/kubedb-operator --namespace=kube-system # Wait for tiller pod to be ready
echo "waiting 2 minutes for crds to be ready"
sleep 2m
helm install kubedb-catalog --version v0.13.0-rc.0 --namespace kube-system appscode/kubedb-catalog

# create secrets
source ${ROOT_PATH}/scripts/lib/add_secrets.sh

kip run build-packages
kip build
