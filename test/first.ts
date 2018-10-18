#!/usr/bin/env node

import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as assert from 'assert';
import * as EE from 'events';
import * as strm from "stream";

import {Combiner} from "../dist";

const combiner = new Combiner(process.stdout);

const k = cp.spawn('bash');

k.stdin.end(`echo "foo"`);
combiner.combine([k.stdout], {prefix: 'south: '});
