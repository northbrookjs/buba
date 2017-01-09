import { join, relative, dirname } from 'path'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { EOL } from 'os'
import { command, alias, description, each } from 'northbrook'
import { transformFile } from 'buba'
import expand from 'glob-expand'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'

const buba = command(alias('buba'), description('Build your packages with Buba'))

exports.plugin = buba

each(buba, function ({ config, directory, options, pkg }, io) {
  io.stdout.write(`Compiling ${pkg.name}...` + EOL + EOL)

  const bubaConfig = config.buba || {}
  const bubleOptions = bubaConfig.bubleOptions
  const babelOptions = bubaConfig.babelOptions

  const srcDir = join(pkg.path, 'src')
  const outDir = join(pkg.path, (options.directory || bubaConfig.directory || 'lib'))

  return new Promise((resolve, reject) => {
    rimraf(outDir, (error) => {
      if (error) reject(error)

      mkdirp(outDir, (err) => {
        if (err) reject(err)

        const files = filesToCompile(srcDir, config)

        files.forEach(file => {
          const relativePath = relative(srcDir, file)
          const { code, map } = transformFile(file, { bubleOptions, babelOptions })

          const outputFile = join(outDir, relativePath)

          makeParentDirectory(outputFile)

          writeFileSync(outputFile, code, { encoding: 'utf8' })
          writeFileSync(outputFile + '.map', map.toString(), { encoding: 'utf8' })
        })

        io.stdout.write(`Completed compiling ${pkg.name}` + EOL + EOL)

        resolve()
      })
    })
  })
})

function makeParentDirectory (path) {
  const parentDirectory = dirname(path)

  if (!existsSync(parentDirectory)) {
    mkdirSync(parentDirectory)
  }
}

const patterns =
  [
    '**/*.js',
    '!**/__test__/**/*.*',
    '!**/*.spec.js',
    '!**/*.test.js',
    '!**/*Spec.js',
    '!**/*Test.js',
    '!**/*.skip.js'
  ]

export function filesToCompile (directory, config) {
  return expand({ filter: 'isFile', cwd: directory }, patterns)
    .map(file => join(directory, file))
}
