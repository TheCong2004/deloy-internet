import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Patch OpenNext copyTracedFiles.js for Windows NTFS junctions & EPERM fallback
const openNextCopyFile = path.join(
  rootDir,
  'node_modules/@opennextjs/aws/dist/build/copyTracedFiles.js'
);

if (fs.existsSync(openNextCopyFile)) {
  let content = fs.readFileSync(openNextCopyFile, 'utf8');
  if (!content.includes('junction')) {
    content = content.replace(
      /import\s*\{([^}]+)\}\s*from\s*["']node:fs["'];/,
      (match, imports) => {
        const set = new Set(imports.split(',').map((s) => s.trim()));
        set.add('realpathSync');
        return `import { ${Array.from(set).join(', ')} } from "node:fs";`;
      }
    );

    const oldBlock = `        if (symlink) {
            try {
                symlinkSync(symlink, to);
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }`;

    const newBlock = `        if (symlink) {
            let linked = false;
            if (process.platform === "win32") {
                try {
                    const resolvedTarget = path.resolve(path.dirname(from), symlink);
                    const targetStat = statSync(resolvedTarget);
                    if (targetStat.isDirectory()) {
                        symlinkSync(resolvedTarget, to, "junction");
                        linked = true;
                    }
                } catch (e) {}
            }
            if (!linked) {
                try {
                    symlinkSync(symlink, to);
                } catch (e) {
                    if (e.code !== "EEXIST") {
                        try {
                            const real = realpathSync(from);
                            const targetStat = statSync(real);
                            if (targetStat.isDirectory()) {
                                if (process.platform === "win32") {
                                    symlinkSync(real, to, "junction");
                                } else {
                                    cpSync(real, to, { recursive: true });
                                }
                            } else {
                                copyFileAndMakeOwnerWritable(real, to);
                            }
                        } catch (fallbackErr) {
                            logger.debug("Error fallback linking/copying traced file:", fallbackErr);
                        }
                    }
                }
            }
        }`;

    if (content.includes(oldBlock)) {
      content = content.replace(oldBlock, newBlock);
      fs.writeFileSync(openNextCopyFile, content, 'utf8');
      console.log('✓ Patched @opennextjs/aws copyTracedFiles for Windows NTFS junction');
    }
  }
}

// 2. Patch canvas bindings.js so esbuild does not fail looking for canvas.node
const canvasBindingsFile = path.join(
  rootDir,
  'node_modules/canvas/lib/bindings.js'
);

if (fs.existsSync(canvasBindingsFile)) {
  let content = fs.readFileSync(canvasBindingsFile, 'utf8');
  if (content.includes("require('../build/Release/canvas.node')")) {
    const patchedCanvas = `'use strict'

let bindings = {
  ImageData: function () {},
  CanvasGradient: function () {},
  CanvasPattern: function () {},
  CanvasRenderingContext2D: function () {},
};

try {
  const binaryPath = '../build/Release/' + 'canvas.node';
  bindings = require(binaryPath);
} catch (e) {
  // Stub for serverless / edge / cloudflare workers
}

module.exports = bindings;

if (bindings && bindings.ImageData && bindings.ImageData.prototype) {
  bindings.ImageData.prototype.toString = function () {
    return '[object ImageData]';
  };
}

if (bindings && bindings.CanvasGradient && bindings.CanvasGradient.prototype) {
  bindings.CanvasGradient.prototype.toString = function () {
    return '[object CanvasGradient]';
  };
}
`;
    fs.writeFileSync(canvasBindingsFile, patchedCanvas, 'utf8');
    console.log('✓ Patched canvas bindings for Cloudflare Workers / esbuild');
  }
}
