#!/usr/bin/env bash

ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/../..

set -e # If anything fails - exit immediately.
set -u # Treat reference to undefined variables as errors

Package=
DEBUG=0

while [[ "$@" != "" ]]; do
    case $1 in
        -l | --Package )            shift
                                Package=$1
                                ;;
        -d | --debug )          DEBUG=1
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

if [[ "$Package" == "" ]]
then
  usage
  exit 1
fi

echo "Package: " $Package
echo "    Building..."

# Run pre-build script if it exists
PRE_BUILD_SCRIPT="$ROOT_PATH/packages/$Package/scripts/pre-build.sh"
if [ -f $PRE_BUILD_SCRIPT ]; then
    source $PRE_BUILD_SCRIPT
fi

# Run build script if it exists
BUILD_SCRIPT="$ROOT_PATH/packages/$Package/scripts/build.sh"
if [ -f $BUILD_SCRIPT ]; then
    source $BUILD_SCRIPT
fi

# Run post-build script if it exists
POST_BUILD_SCRIPT="$ROOT_PATH/packages/$Package/scripts/post-build.sh"
if [ -f $POST_BUILD_SCRIPT ]; then
    source $POST_BUILD_SCRIPT
fi