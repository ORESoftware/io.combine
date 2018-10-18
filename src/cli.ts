#!/usr/bin/env node
'use strict';

import * as Cluster from 'cluster';

Cluster.setupMaster({silent:true});

if(Cluster.isMaster){
  
  const w = Cluster.fork();
  console.log('this is the master process:', process.pid);
  w.process.stdout.pipe(process.stdout);
  
  setInterval(() => {}, 1000);
  
}
else{
  console.log('this is the worker process:', process.pid);
}




