#!/usr/bin/env node

process.title = 'node'
process.removeAllListeners('warning')

const I = ' - '
const C = '../'

const curpath = new Array(1).fill(C).join('')
const parpath = new Array(3).fill(C).join('')

const mdlname = ['src', 'dst'][1]

Promise
.all([
  import(curpath + 'package.json', { assert: { type: 'json' } }),
  import(parpath + 'package.json', { assert: { type: 'json' } }),
])
.then(([
  {default: {name: curname}},
  {default: {name: parname}},
]) => (
  process.title += I + parname + I + curname,
  Promise
  .all([
    import(curpath + mdlname + '/index.js'),
    import(parpath + curname + '.config.js'),
  ])
))
.then(([
  {default: mdl},
  {default: cfg},
]) => 
  process.argv.slice(2).reduce((acc, cur) => acc && acc[cur], mdl)(cfg)
)
