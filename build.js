import { error } from './lib/node.js';
import { build } from 'esbuild';
import { readFile, writeFile } from 'fs/promises'

(async function() {
    // Get the name and version of the lib
    const { name, version } = JSON.parse(await readFile('./package.json', 'utf8'));

    // Build the main version
    const main = await build({
        entryPoints: ['lib/frontend.js'],
        bundle: true,
        outfile: 'build/xcon.js'
    });

    // Build the minified version
    const min = await build({
        entryPoints: ['lib/frontend.js'],
        bundle: true,
        outfile: 'build/xcon.min.js',
        minify: true
    });

    // Append the lib name and version at the start of the file
    {
        const mainFile = await readFile('build/xcon.js', 'utf8');
        await writeFile('build/xcon.js', `/* ${name}@${version} */\n${mainFile}`);
    
        const minFile = await readFile('build/xcon.min.js', 'utf8');
        await writeFile('build/xcon.min.js', `/* ${name}@${version} */\n${minFile}`);
    }
}).call(this);