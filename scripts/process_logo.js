const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processLogo() {
  const sourcePath = 'C:\\Users\\narci\\.gemini\\antigravity\\brain\\c18bd4fe-befc-495f-885a-9e82e860280b\\.user_uploaded\\media_1788081480673.jpg';

  if (!fs.existsSync(sourcePath)) {
    console.error('Source image does not exist:', sourcePath);
    process.exit(1);
  }

  const publicDir = path.join(__dirname, '..', 'public');
  const publicImagesDir = path.join(publicDir, 'images');
  const rootImagesDir = path.join(__dirname, '..', 'images');

  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  if (!fs.existsSync(rootImagesDir)) {
    fs.mkdirSync(rootImagesDir, { recursive: true });
  }

  console.log('Processing master logo from:', sourcePath);

  // 1. Master full-resolution image
  await sharp(sourcePath)
    .resize(1024, 1024, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(publicImagesDir, 'logo.jpg'));
  
  await sharp(sourcePath)
    .resize(1024, 1024, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(rootImagesDir, 'logo.jpg'));

  // 2. High-res PNG
  await sharp(sourcePath)
    .resize(1024, 1024, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile(path.join(publicImagesDir, 'logo.png'));
  
  await sharp(sourcePath)
    .resize(1024, 1024, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile(path.join(rootImagesDir, 'logo.png'));

  // 3. Header Logo Icon (128x128)
  await sharp(sourcePath)
    .resize(128, 128, { fit: 'cover' })
    .png()
    .toFile(path.join(publicImagesDir, 'logo-icon.png'));
  
  await sharp(sourcePath)
    .resize(128, 128, { fit: 'cover' })
    .png()
    .toFile(path.join(rootImagesDir, 'logo-icon.png'));

  // 4. Apple Touch Icon (180x180)
  await sharp(sourcePath)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(sourcePath)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(rootImagesDir, 'apple-touch-icon.png'));

  // 5. Favicon 32x32 & 16x16
  await sharp(sourcePath)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  
  await sharp(sourcePath)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(rootImagesDir, 'favicon-32x32.png'));

  await sharp(sourcePath)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  await sharp(sourcePath)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toFile(path.join(rootImagesDir, 'favicon-16x16.png'));

  // 6. Favicon.ico (32x32 png saved as .ico for browser standard compatibility)
  await sharp(sourcePath)
    .resize(32, 32, { fit: 'cover' })
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  // 7. PWA / App Manifest icons
  await sharp(sourcePath)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(publicImagesDir, 'icon-192.png'));

  await sharp(sourcePath)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicImagesDir, 'icon-512.png'));

  console.log('All logo and favicon assets created successfully!');
}

processLogo().catch(err => {
  console.error('Error processing logo:', err);
  process.exit(1);
});
