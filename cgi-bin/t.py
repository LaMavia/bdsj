#!/bin/python3

import fileinput
import os
import subprocess as sp
import sys

p = sp.Popen(
    ["./server"],
    stdin=sp.PIPE,
    stdout=sp.PIPE,
    stderr=sp.PIPE,
    env=os.environ.copy()
)
msg = ""

for line in fileinput.input():
    msg += line

pout, _ = p.communicate(input=msg.encode())

sys.stdout.write(pout.decode('utf8'))
