#!/usr/bin/python

# help info: https://yuque.antfin-inc.com/xiaochu.yh/doc/vzwuxs

import sys
import os
import subprocess
import time
import ob_inner_table_schema_constants

if 1 == len(sys.argv):
    sys.exit(0)

arg = sys.argv[1]

# auto upgrade resource such as error code
if ("--upgrade" == arg):
    files = ["ob_errno.def", "ob_pcode.def", "automation.py", "ob_inner_table_schema_constants.py"]
    for name in files:
        url="http://100.88.108.16:8000/lookup.workflow/%s" % (name)
        cmd='wget -O %s %s' % (name,url)
        print cmd
        p = os.popen(cmd)
        print p.read()

    print "upgrade done"
    sys.exit(0)


#if (arg[0:30].find('{') >= 0 or len(arg) > 300):
if (len(arg) > 50):
    f = open("input.txt", "w")
    f.write(arg)
    f.close()
    # https://github.com/zaach/jsonlint
    #subprocess.call(["rm", "-f", "output.txt"])
    subprocess.call(["/usr/local/bin/node", "format.js"])
    #subprocess.call(["open", "output.txt"])
    print "open file ok"
    sys.exit(0)

if ((arg[0:6] == 'pcode=' and arg[6:].isdigit()) or (arg.isdigit() and len(arg) <= 4)):
    kw = arg

    if (kw[0:6] == 'pcode='):
        kw = kw[6:]

    p = os.popen('grep -w "%s" ./ob_pcode.def' % (kw));
    lines = p.read().split(",")
    for item in lines:
        print "%s" % (item.strip())
    sys.exit(0)


# Y406645869E0
if ((arg[0] == 'Y' and len(arg) >= 12)):
    sep = arg.find('-');
    uval = int(arg[1:sep], 16)
    ip = uval & 0xffffffff;
    port = (uval >> 32) & 0xffff
    print "IP:%d.%d.%d.%d:%d" % ((ip >> 24 & 0xff), (ip >> 16 & 0xff), (ip >> 8 & 0xff), (ip >> 0 & 0xff), port)
    sys.exit(0)

if ((arg[0] == '-' and arg[1:].isdigit()) or (arg.isdigit() and len(arg) <= 5)):
    kw = arg
    if (kw[0] == '-'):
        kw = kw[1:]
    p = os.popen('grep -w "\-%s" ./ob_errno.def' % (kw));
    lines = p.read().split(",")
    for item in lines:
        print "%s" % (item.strip())
    sys.exit(0)

if (arg.isdigit()):
    num = int(arg)
    num_len = len(arg)

    tenant_id = num >> 40
    table_id = num & 0xFFFFFFFFFF
    print "(%d << 40) | %d" % (tenant_id, table_id)
    if (tenant_id == 1):
        if ob_inner_table_schema_constants.table_id_map.has_key(table_id):
            print "%s" % (ob_inner_table_schema_constants.table_id_map[table_id])

    if (16 == num_len):
        time_local = time.localtime(int(num / 1000000))
        if (time_local.tm_year > 2018):
            print "%s.%06d" % (time.strftime("%Y-%m-%d %H:%M:%S", time_local), num % 1000000)
    elif (13 == num_len):
        time_local = time.localtime(int(num / 1000))
        if (time_local.tm_year > 2018):
            print "%s.%06d" % (time.strftime("%Y-%m-%d %H:%M:%S", time_local), num % 1000)
    elif (10 == num_len):
        time_local = time.localtime(int(num))
        if (time_local.tm_year > 2018):
            print "%s" % (time.strftime("%Y-%m-%d %H:%M:%S", time_local))

    #if num > 0xffffffffffff:
    print "0x%X" % (num)

else:
    print "%s" % (arg)

