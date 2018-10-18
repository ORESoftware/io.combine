'use strict';

import * as readline from 'readline';
import {Readable, Transform, Writable} from "stream";
import * as util from "util";

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

const flattenDeep = (arr: Array<any>): Array<any> => {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};

export interface CombinerOpts {
  prefix?: string,
  cork?: boolean
}

export interface CombineOpts {
  prefix: string,
}

export class Combiner {
  
  private trans: Transform;
  private readonly writable: Writable;
  uncorked = false;
  
  constructor(w: Writable, o?: CombinerOpts) {
    
    this.writable = w;
    
    this.trans = new Transform({
      transform(chunk, enc, cb) {
        cb(null, String(chunk));
      }
    });
    
    if (o && o.cork) {
      this.trans.cork();
    }
    else {
      this.uncorked = true;
      this.trans.pipe(this.writable, {end: false});
    }
    
  }
  
  start(): this {
    if (!this.uncorked) {
      this.uncorked = true;
      this.trans.pipe(this.writable, {end: false});
    }
    return this;
  }
  
  combine(readable: Readable | Array<Readable>, o?: CombineOpts): this {
    
    if (o && !('prefix' in o)) {
      throw new Error('prefix property was no available on options object => ' + util.inspect(o));
    }
    
    const prefix = o ? o.prefix : '';
    
    for (let v of flattenDeep([readable])) {
      readline.createInterface({input: v}).on('line', l => {
        this.trans.write(prefix + l + '\n');
      });
    }
    
    return this;
  }
  
}


