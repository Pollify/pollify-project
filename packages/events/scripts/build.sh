#! /bin/bash

LIB_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/..

npm run build --prefix $LIB_PATH
npm run pack --prefix $LIB_PATH