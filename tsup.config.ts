import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  if (options.env?.TEST === 'yes') {
    return {
      outDir: 'tmp/tests',
      entry: ['src'],
      external: ['node:test', 'node:assert/strict'],
      format: ['esm'],
      removeNodeProtocol: false
    }
  } else {
    return {
      minify: options.watch !== true,
      clean: true,
      dts: true,
      format: ['esm', 'cjs'],
      sourcemap: options.watch === true,
      entry: ['src/main.ts']
    }
  }
})
