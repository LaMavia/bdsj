#!/bin/python3

import fileinput
import os
from re import I
import subprocess as sp
import sys
import os
# print("content-type: text/html\n\n<h1>Hello!</h1>\n")
# print(" ".join(sys.argv))
# print(" ".join(os.listdir("./")))

p = sp.Popen(
    [r"./bdsj"],
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
