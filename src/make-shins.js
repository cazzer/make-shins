#!/usr/bin/env node
import program from 'commander'

import makeShins from './index'

program
  .version('0.3.3')
  .option('-i, --input <input>', 'Input markdown file', 'index.html.md')
  .option('-o, --output <output>', 'Output directory', 'public')
  .option('-l, --logo <logo>', 'logo.png file to use')
  .option('-c, --custom-css <custom-css>', 'Directory to CSS overrides')
  .option('-i, --inline', 'Inlines CSS and JS, minifies output')
  .option('-m, --minify', 'Minifies the output')
  .option('-l, --local', 'Specify that this module is installed locally and not globally')
  .parse(process.argv)

makeShins(program)
