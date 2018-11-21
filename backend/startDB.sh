#!/bin/bash
# Author: Andy Cheng

#start up db locally
echo "Start up mongo db locally";
# check if DBPATH is set
if [ -z ${DBPATH+x} ];
then
    echo "DBPATH is unset";
    echo "please set DBPATH by 'export DBPATH=<YOUR MongoDB PATH>'";
    exit 1;
else 
    echo "DBPATH is set to $DBPATH"; 
    mongod --dbpath ${DBPATH};
    mongo;
fi