// Automated Comprehensive Test Suite for REVERIE: The House That Remembers
const path = require('path');
const esbuild = require('C:/Users/Admin/AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/esbuild');

async function buildAndRun() {
  console.log('Building headless test bundle...');
  const testBundlePath = path.join(__dirname, 'dist', 'test-bundle.js');
  
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'test_runner.ts')],
    bundle: true,
    outfile: testBundlePath,
    platform: 'node',
    target: ['es2020'],
    nodePaths: [
      'C:/Users/Admin/AppData/Local/Programs/Antigravity IDE/resources/app/node_modules'
    ],
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx'
    }
  });

  console.log('Running REVERIE Test Suite...\n');
  require(testBundlePath);
}

buildAndRun().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
