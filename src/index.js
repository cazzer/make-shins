import Debug from 'debug'
import fs from 'fs-extra'
import path from 'path'
import shins from 'shins'
import npmRoot from 'npm-root'
import { promisify } from 'es6-promisify'

const d = new Debug('make-shins')

const npmRootAsync = promisify(npmRoot)
const shinsRenderAsync = promisify(shins.render).bind(shins)

export default async function makeShins(options) {
  console.time('make-shins')
  d('Reading markdown')
  const markdownString = fs.readFileSync(path.resolve(options.input), 'utf8')

  d('Rendering shins')
  const html = await shinsRenderAsync(
    markdownString,
    {
      customCss: options.customCss,
      inline: options.inline,
      minify: options.minify
    }
  )

  if (options.output) {
    d('Preparing output directory')
    // prepare by removing, since shins uses symlinks which break copySync
    fs.removeSync(options.output)
    d('Writing output')
    const rootPath = await npmRootAsync({
      global: !options.local
    })
    await fs.copy(
      path.join(
        rootPath,
        '/make-shins/node_modules/shins'
      ),
      options.output,
      {
        dereference: true
      }
    )
    await fs.writeFile(path.join(options.output, 'index.html'), html)

    if (options.customCss) {
      d('Copying custom CSS')

      const overrides = [
        'print_overrides.css',
        'screen_overrides.css',
        'theme_overrides.css'
      ]
      for (var i = 0, l = overrides.length; i < l; i++) {
        if (fs.pathExists(path.resolve(options.customCss, overrides[i]))) {
          d(`Copying ${overrides[i]}`)
          await fs.copy(
            path.resolve(options.customCss, overrides[i]),
            path.join(options.output, 'pub/css', overrides[i])
          )
        }
      }
    }

    if (options.logo) {
      d('Copying logo.png')
      await fs.copy(
        options.logo,
        path.join(options.output, 'source/images/logo.png')
      )
    }
  }
  d('Finished')
  console.timeEnd('make-shins')
}
