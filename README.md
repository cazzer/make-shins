# Simple CLI for Shins
> Which generates static files for you to do with as you wish

## Usage:
```
  Usage: make-shins [options]


  Options:

    -V, --version                  output the version number
    -i, --input <input>            Input markdown file
    -o, --output <output>          Output directory
    -l, --logo <logo>              logo.png file to use
    -c, --custom-css <custom-css>  Directory to custom CSS
    -i, --inline                   Inlines CSS and JS, minifies output
    -m, --minify                   Minifies the output
    -l, --local                    Specify that this module is installed locally and not globally
    -h, --help                     output usage information
```
*Note: This package will copy files from the install directory so be sure
to set the `local` flag if you're not installing it globally.*

## More Information
Checkout [Mermade/shins](https://github.com/mermade/shins) for details. Shins is not [slate](https://github.com/lord/slate).
