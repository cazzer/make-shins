#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import program from 'commander'
import shins from 'shins'

program
  .version('0.1.0')
  .option('-m, --markdown <markdown>', 'Markdown file')
  .option('-o, --output <output>', 'Output HTML file name')
  .parse(process.argv)

const markdownString = fs.readFileSync(path.resolve(program.markdown), "utf8")

const what = shins.render(
  markdownString,
  {
    inline: true
  },
  (error, html) => {
    if (program.output) {
      fs.writeFileSync(program.output, html)
    }
  }
)
