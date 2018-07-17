#!/bin/bash

# try killing running server
ps | grep "[h]cdev" | awk '{if($1!="") {print "killing process: "$1; system("kill " $1)}}'
echo 'starting server'
hcdev web &
