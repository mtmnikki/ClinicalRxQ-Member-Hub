/**
 * Lightweight lint runner so we don't need to modify package.json scripts.
 * Usage:
 *   node scripts/lint.mjs
 *   node scripts/lint.mjs --fix
 */
import { ESLint } from 'eslint';

/** Run ESLint against the src directory */
async function main() {
  const fix = process.argv.includes('--fix');
  const eslint = new ESLint({ fix });
  const results = await eslint.lintFiles(['src/**/*.{ts,tsx}']);

  if (fix) {
    await ESLint.outputFixes(results);
  }

  const formatter = await eslint.loadFormatter('stylish');
  const output = formatter.format(results);
  // eslint-disable-next-line no-console
  console.log(output);

  const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);
  process.exitCode = errorCount > 0 ? 1 : 0;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
