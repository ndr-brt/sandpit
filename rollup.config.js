import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from '@rollup/plugin-typescript';

export default {
  input: "./ui/index.ts",
  output: {
    file: "./dist/editor.bundle.js",
    format: "iife"
  },
  plugins: [nodeResolve(), typescript({
    exclude: 'src-tauri/**'
  })]
}