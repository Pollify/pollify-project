#!/usr/bin/env bash

set -e # If anything fails - exit immediately.
set -u # Treat reference to undefined variables as errorsui

PROTOBUF_VERSION="3.13.0"
COMMON_PROTO_VERSION="1_3_1"

if [[ "$OSTYPE" == *"darwin"* ]]; then
  PROTOC_ZIP="protoc-$PROTOBUF_VERSION-osx-x86_64.zip"
else
  PROTOC_ZIP="protoc-$PROTOBUF_VERSION-linux-x86_64.zip"
fi

curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOBUF_VERSION/$PROTOC_ZIP
sudo unzip -o $PROTOC_ZIP -d /usr/local bin/protoc
sudo unzip -o $PROTOC_ZIP -d /usr/local 'include/*'
rm -f $PROTOC_ZIP

COMMON_PROTO_ZIP="common-protos-$COMMON_PROTO_VERSION.zip"
COMMON_PROTO_ZIP_PATH="googleapis-common-protos-$COMMON_PROTO_VERSION"
curl -OL https://github.com/googleapis/googleapis/archive/$COMMON_PROTO_ZIP
sudo unzip -o $COMMON_PROTO_ZIP -d /usr/local/include "$COMMON_PROTO_ZIP_PATH/google/api/*"
sudo rm -rf /usr/local/include/google/api
sudo mv /usr/local/include/$COMMON_PROTO_ZIP_PATH/google/api /usr/local/include/google/api
sudo rm -rf /usr/local/include/$COMMON_PROTO_ZIP_PATH
rm -f $COMMON_PROTO_ZIP