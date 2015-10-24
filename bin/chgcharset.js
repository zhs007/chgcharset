#!/usr/bin/env node
/**
 * Created by zhs007 on 15/10/22.
 */

var fs = require('fs');
var process = require('process');
var iconv = require('iconv-lite');
var Iconv = require('iconv-lite').Iconv;
var glob = require('glob');
var argv = require('yargs')
    .option('i', {
        alias : 'input',
        demand: true,
        default: 'gbk',
        describe: 'input charset',
        type: 'string'
    })
    .option('o', {
        alias : 'output',
        demand: true,
        default: 'utf8',
        describe: 'output charset',
        type: 'string'
    })
    .option('b', {
        alias : 'bom',
        demand: false,
        describe: 'BOM',
        type: 'boolean'
    })
    .usage('Usage: chgcharset files [options]')
    .example('chgcharset **/*.lua -i gbk -o utf8 --bom', 'chg abc.lua charset from gbk to utf8 with BOM')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2015')
    .argv;

var basearr = argv._;

if (basearr == undefined || basearr.length != 1) {
    console.log('Usage: chgcharset files [options]');

    process.exit(1);
}

function isEquBuffer(src, dest) {
    if (src.length == dest.length) {
        for (var i = 0; i < src.length; ++i) {
            console.log('src: ' + src[i]);
            console.log('dest: ' + dest[i]);
            if (src[i] != dest[i]) {
                return false;
            }
        }

        return true;
    }

    return false;
}

function chgCharset(buf, srccharset, destcharset) {
    var outstr = iconv.decode(buf, srccharset);
    return iconv.encode(outstr, destcharset);
}

function checkCharset(buf, charset) {

    return true;
    //var destbuf = chgCharset(buf, charset, charset);
    //if (isEquBuffer(buf, destbuf)) {
    //    return true;
    //}
    //
    //return false;

    var outstr = iconv.decode(buf, charset);
    var str = buf.toString();
    return buf.toString() == outstr;
}

function hasBOM(buf) {
    return buf.length >= 3 && buf[0] == 0xef && buf[1] == 0xbb && buf[2] == 0xbf;
}

function cutBOM(buf) {
    var destbuf = new Buffer(buf.length - 3);

    for (var i = 0; i < destbuf.length; ++i) {
        destbuf[i] = buf[i + 3];
    }

    return destbuf;
}

function addBOM(buf) {
    var destbuf = new Buffer(buf.length + 3);

    destbuf[0] = 0xef;
    destbuf[1] = 0xbb;
    destbuf[2] = 0xbf;

    for (var i = 0; i < buf.length; ++i) {
        destbuf[i + 3] = buf[i];
    }

    return destbuf;
}

var srccharset = argv.input;
var destcharset = argv.output;
var bom = argv.bom;

var lstfile = glob.sync(basearr[0]);
for (var i = 0; i < lstfile.length; ++i) {
    var srcfile = lstfile[i];

    if (fs.existsSync(srcfile)) {
        var srcbuf = fs.readFileSync(srcfile);
        var srcbom = hasBOM(srcbuf);
        if (srcbom) {
            if (srccharset != 'utf8') {
                console.log('Err: ' + srcfile + ' charset is utf8-bom');

                continue;
            }

            srcbuf = cutBOM(srcbuf);
        }

        if (checkCharset(srcbuf, srccharset)) {
            var destbuf = chgCharset(srcbuf, srccharset, destcharset);

            if (bom) {
                fs.writeFileSync(srcfile, addBOM(destbuf));
            }
            else {
                fs.writeFileSync(srcfile, destbuf);
            }
        }
        else {
            console.log('Err: ' + srcfile + ' charset is not ' + srccharset);

            continue;
        }
    }

    console.log(srcfile + ' OK!');
}
