import { build, type BunPlugin, file, pathToFileURL, write } from 'bun';
import { isolatedDeclaration } from 'oxc-transform';

function generateTypesPlugin(): BunPlugin {
    const visited = new Set<string>();

    return {
        name: 'oxc-transform-dts',

        setup(builder) {
            if (!builder.config.root || !builder.config.outdir) {
                console.warn('osx-transform-dts requires both a root and outdir.');
                return;
            }

            const rootPath = pathToFileURL(builder.config.root).pathname;
            const outPath = pathToFileURL(builder.config.outdir).pathname;

            builder.onStart(() => {
                visited.clear();
            });

            builder.onLoad({filter: /\.ts$/}, async args => {
                if (args.path.startsWith(rootPath) && !visited.has(args.path)) {
                    visited.add(args.path);

                    const {code} = isolatedDeclaration(
                        args.path,
                        await file(args.path).text()
                    );

                    await write(
                        args.path
                            .replace(new RegExp(`^${rootPath}`), outPath)
                            .replace(/\.ts$/, '.d.ts'),
                        code
                    );
                }

                return undefined;
            });
        }
    };
}

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
        external: [
            'luxon',
            'pinia'
        ],
        plugins: [
            generateTypesPlugin()
        ]
    });
} catch (err) {
    console.error('Build failed!');
    console.error(err);
    process.exit(1);
}

console.log('Build complete!');
