import sharp from 'sharp';
import { readdir, stat, readFile, writeFile, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

/**
 * Astro integration to optimize images after build
 */
export function imageOptimizer() {
  return {
    name: 'image-optimizer',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // dir can be a URL object or a string path
        let distDir = typeof dir === 'string' ? dir : dir.pathname || dir.href?.replace('file://', '') || './dist';
        
        // Handle URL objects properly
        if (dir && typeof dir === 'object' && 'pathname' in dir) {
          distDir = dir.pathname;
        } else if (dir && typeof dir === 'object' && 'href' in dir) {
          distDir = dir.href.replace('file://', '');
        }
        
        // Fallback to dist if path is invalid
        if (!distDir || !existsSync(distDir)) {
          distDir = join(process.cwd(), 'dist');
        }
        
        console.log(`Image optimizer: Processing directory: ${distDir}`);
        const imageExtensions = ['.jpg', '.jpeg', '.png'];
        
        async function processDirectory(dirPath) {
          if (!existsSync(dirPath)) {
            console.warn(`Directory does not exist: ${dirPath}`);
            return;
          }
          
          const files = await readdir(dirPath);
          
          for (const file of files) {
            const filePath = join(dirPath, file);
            const stats = await stat(filePath);
            
            if (stats.isDirectory()) {
              await processDirectory(filePath);
            } else {
              const ext = extname(file).toLowerCase();
              if (imageExtensions.includes(ext)) {
                try {
                  const webpPath = filePath.replace(ext, '.webp');
                  
                  console.log(`Optimizing ${file} to WebP...`);
                  
                  // Read original image
                  const imageBuffer = await readFile(filePath);
                  
                  // Convert to WebP with optimization
                  const webpBuffer = await sharp(imageBuffer)
                    .webp({ 
                      quality: 85,
                      effort: 6 
                    })
                    .toBuffer();
                  
                  // Write WebP version
                  await writeFile(webpPath, webpBuffer);
                  
                  const originalSize = (stats.size / 1024 / 1024).toFixed(2);
                  const newSize = (webpBuffer.length / 1024 / 1024).toFixed(2);
                  const savings = (((stats.size - webpBuffer.length) / stats.size) * 100).toFixed(1);
                  
                  console.log(`  ✓ ${basename(webpPath)}: ${originalSize}MB → ${newSize}MB (${savings}% smaller)`);
                  
                  // Remove original since we're using WebP everywhere
                  await unlink(filePath);
                  console.log(`  ✓ Removed original ${file}`);
                } catch (error) {
                  console.warn(`Failed to optimize ${file}:`, error.message);
                }
              }
            }
          }
        }
        
        console.log('Starting image optimization...');
        await processDirectory(distDir);
        console.log('Image optimization complete!');
      }
    }
  };
}
