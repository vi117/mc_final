import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { stdout } from "node:process";
import { run } from "node:test";
import { tap } from "node:test/reporters";

/**
 * Collects files recursively from the specified path that end with ".test.ts" extension.
 *
 * @param {string} path - The path to the directory to start collecting files from.
 * @return {Promise<string[]>} - An array of strings representing the resolved paths of the collected files.
 */
async function collectFiles(path: string) {
  const files = await readdir(path, {
    recursive: true,
    withFileTypes: true,
  });
  const result: string[] = [];
  for (const file of files) {
    if (file.isFile() && file.name.endsWith(".test.ts")) {
      const p = file.path;
      console.log(file.name);
      result.push(resolve(p, file.name));
    }
  }
  return result;
}

/**
 * Executes the main function asynchronously.
 *
 * @return {Promise<void>} Promise that resolves when the main function completes.
 */
async function main() {
  process.env.TEST = "test";
  const files = await collectFiles(resolve(__dirname, "..", "src"));
  run({
    files,
  }).compose(tap)
    .pipe(stdout);
}

main();
