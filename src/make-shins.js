#!/usr/bin/env node

import Debug from 'debug'
import fs from 'fs-extra'
import path from 'path'
import program from 'commander'
import shins from 'shins'
import npmRoot from 'npm-root'

const d = new Debug('make-shins')

program
  .version('0.1.0')
  .option('-i, --input <input>', 'Input markdown file', 'index.html.md')
  .option('-o, --output <output>', 'Output directory', 'public')
  .option('-l, --logo <logo>', 'logo.png file to use')
  .option('-c, --custom-css <custom-css>', 'Directory to custom CSS')
  .option('-i, --inline', 'Inlines CSS and JS, minifies output')
  .option('-m, --minify', 'Minifies the output')
  .option('-l, --local', 'Specify that this module is installed locally and not globally')
  .parse(process.argv)

console.time('make-shins')
d('Reading markdown')
const markdownString = fs.readFileSync(path.resolve(program.input), 'utf8')

d('Rendering shins')
shins.render(
  markdownString,
  {
    customCss: program.customCss,
    inline: program.inline,
    minify: program.minify
  },
  (error, html) => {
    if (error) {
      console.error('Could not render shins', error)
    }

    if (program.output) {
      d('Preparing output directory')
      // prepare by removing, since shins uses symlinks which break copySync
      fs.removeSync(program.output)
      d('Writing output')
      npmRoot({
        global: !program.local
      }, (error, rootPath) => {
        fs.copySync(
          path.join(
            rootPath,
            '/make-shins/node_modules/shins'
          ),
          program.output,
          {
            dereference: true
          }
        )
        fs.writeFileSync(path.join(program.output, 'index.html'), html)

        if (program.customCss) {
          d('Copying custom CSS')
          fs.copySync(
            program.customCss,
            path.join(program.output, '/pub/css')
          )
        }

        if (program.logo) {
          d('Copying logo.png')
          fs.copySync(
            program.logo,
            path.join(program.output, 'source/images/logo.png')
          )
        }
      })
    }
    d('Finished')
    console.timeEnd('make-shins')
  }
)
