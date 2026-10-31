// Build script using local esbuild compiler
const path = require('path');
const esbuild = require('C:/Users/Admin/AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/esbuild');

async function run() {
  console.log('Compiling REVERIE with esbuild...');
  try {
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'src', 'index.tsx')],
      bundle: true,
      outfile: path.join(__dirname, 'dist', 'bundle.js'),
      minify: true,
      target: ['es2020'],
      nodePaths: [
        'C:/Users/Admin/AppData/Local/Programs/Antigravity IDE/resources/app/node_modules'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css'
      }
    });
    console.log('Build successful! Generated dist/bundle.js and dist/bundle.css');
  } catch (e) {
    console.error('Build error:', e);
    process.exit(1);
  }
}

run();
