#!/usr/bin/env bash

set -e # If anything fails - exit immediately.
set -u # Treat reference to undefined variables as errors
set -o pipefail # Treat failure of any part of a pipeline as a command failure

ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/..

EVERYTHING=1
ALL_PACKAGES=$(ls -d $ROOT_PATH/packages/*/ 2>/dev/null | sed -e 's/.*\/\([^\/]*\)\//\1/g' || true)

while [[ "$@" != "" ]]; do
    case $1 in
        -l | --library )        shift
                                PACKAGES+=($1)
                                EVERYTHING=0
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

if [[ $EVERYTHING -eq 1 ]]
then
   PACKAGES=$ALL_PACKAGES
fi

# Get project root path
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [[ ${PACKAGES[@]} ]]
then
   echo "Packages"
   for PACKAGE in ${PACKAGES[@]}
   do
    source ${SCRIPT_PATH}/lib/build_package.sh -l $PACKAGE
   done
fi