#! /bin/bash

SERVICE_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/..

CUR_DIR=$PWD
cd $SERVICE_PATH
npm install --no-save ../../packages/logger
cd $CUR_DIR