#! /bin/bash

ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/../..
LIB_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/..

# Path to this plugin
PROTOC_GEN_TS_PATH="$LIB_PATH/node_modules/.bin/protoc-gen-ts_proto"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./generated"

# PROTO SERVICE DEPENDENCY MAP
function get_proto_services {
    local array=()
    for entry in "./dependencies/services"/*
    do
        filename=$(basename -- "$entry")
        list=($(cat $entry))
        # shellcheck disable=SC2068
        for proto in ${list[@]}
        do
            if [ $proto = $1 ];then
                array+=(${filename%.*})
            fi
        done
    done
    echo "${array[@]}"
}

function get_proto_packages {
    local array=()
    for entry in "./dependencies/packages"/*
    do
        filename=$(basename -- "$entry")
        list=($(cat $entry))
        # shellcheck disable=SC2068
        for proto in ${list[@]}
        do
            if [ $proto = $1 ];then
                array+=(${filename%.*})
            fi
        done
    done
    echo "${array[@]}"
}

function get_file_hash {
    if test -f "$1"; then
        shasum $1 | awk '{ print $1 }' | tr -d '[:space:]'
    fi
}

function build_service_proto {
    rm -rf $OUT_DIR/services/$1
    mkdir -p $OUT_DIR/services/$1

    protoc \
        --plugin=$PROTOC_GEN_TS_PATH \
        --ts_proto_out=$OUT_DIR/services/$1 \
        --proto_path $LIB_PATH/src/services/ \
        --ts_proto_opt=nestJs=true \
        --ts_proto_opt=addGrpcMetadata=false \
        --ts_proto_opt=addNestjsRestParameter=true \
        --ts_proto_opt=returnObservable=false \
        --experimental_allow_proto3_optional \
        --descriptor_set_out=$OUT_DIR/services/$1/$1.pb \
        --include_imports \
        $LIB_PATH/src/services/$1.proto
    echo ""

    # copy .proto file
    cp $LIB_PATH/src/services/$1.proto $OUT_DIR/services/$1/

    services=($(get_proto_services $1))
    if (( ${#services[@]} )); then
        copy_proto_to_service $1 ${services[@]}
    fi

    packages=($(get_proto_packages $1))
    if (( ${#packages[@]} )); then
        copy_proto_to_package $1 ${packages[@]}
    fi
}

function copy_proto_to_service {
    NEW_HASH=$(get_file_hash $OUT_DIR/services/$1/$1.pb)
    PROTO_SERVICE=$1
    shift
    for service in "$@"
    do
        OUTPUT_DIR="$ROOT_PATH/services/$service/src/generated/protos/$PROTO_SERVICE"
        CURRENT_HASH=$(get_file_hash $OUTPUT_DIR/$PROTO_SERVICE.pb)

        # if [ "$NEW_HASH" != "$CURRENT_HASH" ]; then
            rm -rf $OUTPUT_DIR
            mkdir -p $OUTPUT_DIR
            echo "copy \"$PROTO_SERVICE\" protos to \"$service\" service"
            cp -r $OUT_DIR/services/$PROTO_SERVICE/* $OUTPUT_DIR
        # fi
    done
}

function copy_proto_to_package {
    NEW_HASH=$(get_file_hash $OUT_DIR/services/$1/$1.pb)
    PROTO_SERVICE=$1
    shift
    for package in "$@"
    do
        OUTPUT_DIR="$ROOT_PATH/packages/$package/src/generated/protos/$PROTO_SERVICE"
        CURRENT_HASH=$(get_file_hash $OUTPUT_DIR/$PROTO_SERVICE.pb)

        # if [ "$NEW_HASH" != "$CURRENT_HASH" ]; then
            rm -rf $OUTPUT_DIR
            mkdir -p $OUTPUT_DIR
            echo "copy \"$PROTO_SERVICE\" protos to \"$package\" package"
            cp -r $OUT_DIR/services/$PROTO_SERVICE/* $OUTPUT_DIR
        # fi
    done
}

for entry in "./src/services"/*
do
    filename=$(basename -- "$entry")
    build_service_proto "${filename%.*}"
done