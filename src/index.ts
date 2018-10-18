'use strict';

import * as readline from 'readline';
import {Readable, Transform, Writable} from "stream";


export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

const flattenDeep = (arr: Array<any>): Array<any> => {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};

export class Combiner {
  
  private trans: Transform;
  private readonly writable: Writable;
  
  constructor(w: Writable) {
    
    this.writable = w;
    
    this.trans = new Transform({
      transform(chunk, enc, cb) {
        cb(null, String(chunk));
      }
    });
    
    this.trans.cork();
  }
  
  start(): this {
    this.trans.pipe(this.writable, {end: false});
    return this;
  }
  
  combine(readable: Readable | Array<Readable>): this {
    
    for (let v of flattenDeep([readable])) {
      readline.createInterface({input: v}).on('line', l => {
        this.trans.write(l + '\n');
      });
    }
    
    return this;
  }
  
}


