import { generateDts } from '@basmilius/vite-vue-preset/oxc';
import { build } from 'bun';

try {
    await build({
        entrypoints: ['src/index.ts'],
        root: 'src',
        outdir: 'dist',
        minify: false,
        naming: 'http-client.js',
        sourcemap: 'linked',
        splitting: false,
        format: 'esm',
        target: 'browser',
        packages: 'external',
        plugins: [
            generateDts()
        ]
    });
} catch (err) {
    console.error('Build failed!');
    console.error(err);
    process.exit(1);
}

console.log('Build complete!');
