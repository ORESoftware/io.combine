#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const dist_1 = require("../dist");
const combiner = new dist_1.Combiner(process.stdout);
const k = cp.spawn('bash');
k.stdin.end(`echo "foo"`);
combiner.combine([k.stdout], { prefix: 'south: ' });
