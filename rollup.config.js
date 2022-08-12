import { nodeResolve } from "@rollup/plugin-node-resolve"
import nodePolyfills from 'rollup-plugin-polyfill-node';
import commonjs from "@rollup/plugin-commonjs"
import typescript from '@rollup/plugin-typescript';

export default {
  input: "./ui/src/index.ts",
  output: {
    file: "./dist/editor.bundle.js",
    format: "iife",
    sourceMap: 'inline'
  },
  plugins: [
    commonjs(),
    nodePolyfills(),
    nodeResolve({
      browser: true,
      moduleDirectories: ['ui/node_modules']
    }),
    typescript({ exclude: 'src-tauri/**' })
  ]
}