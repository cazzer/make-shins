import Debug from 'debug'
import fs from 'fs-extra'
import path from 'path'
import shins from 'shins'
import npmRoot from 'npm-root'

const d = new Debug('make-shins')


export default async function makeShins(options) {
  console.time('make-shins')
  d('Reading markdown')
  const markdownString = fs.readFileSync(path.resolve(options.input), 'utf8')

  d('Rendering shins')
  shins.render(
    markdownString,
    {
      customCss: options.customCss,
      inline: options.inline,
      minify: options.minify
    },
    (error, html) => {
      if (error) {
        console.error('Could not render shins', error)
      }

      if (options.output) {
        d('Preparing output directory')
        // prepare by removing, since shins uses symlinks which break copySync
        fs.removeSync(options.output)
        d('Writing output')
        npmRoot({
          global: !options.local
        }, (error, rootPath) => {
          fs.copySync(
            path.join(
              rootPath,
              '/make-shins/node_modules/shins'
            ),
            options.output,
            {
              dereference: true
            }
          )
          fs.writeFileSync(path.join(options.output, 'index.html'), html)

          if (options.customCss) {
            d('Copying custom CSS')
            fs.copySync(
              options.customCss,
              path.join(options.output, '/pub/css')
            )
          }

          if (options.logo) {
            d('Copying logo.png')
            fs.copySync(
              options.logo,
              path.join(options.output, 'source/images/logo.png')
            )
          }
        })
      }
      d('Finished')
      console.timeEnd('make-shins')
    }
  )
}
