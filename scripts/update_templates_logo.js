const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_standalone_pages.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace logo link in headers
const oldLogoRegex = /<a href="index\.html" class="logo-link"[^>]*>\s*<span class="logo-icon">🌀<\/span>\s*<span>Tus Desvaríos<\/span>\s*<\/a>/g;
const newLogo = `<a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(255,255,255,0.25); box-shadow:0 0 14px rgba(168,85,247,0.35);">
          <span>Tus Desvaríos</span>
        </a>`;

content = content.replace(oldLogoRegex, newLogo);

// 2. Add Favicons to all <head> sections that have <!-- Google Fonts -->
const faviconBlock = `  <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->`;

content = content.replace(/<!-- Google Fonts -->/g, faviconBlock);

// 3. Add emblem to index.html hero section
const oldIndexHero = `<div class="hero-badge">
        <span>✨</span>
        <span>Tu Rincón Digital de Ocio y Ficción</span>
      </div>

      <h1 class="portal-title">`;

const newIndexHero = `<div class="hero-badge">
        <span>✨</span>
        <span>Tu Rincón Digital de Ocio y Ficción</span>
      </div>

      <div style="display:flex; justify-content:center; margin-bottom:1.25rem;">
        <img src="images/logo.jpg" alt="Tus Desvaríos — Explora, Imagina, Descubre" style="width:135px; height:135px; border-radius:50%; object-fit:cover; border:2.5px solid rgba(255,255,255,0.3); box-shadow:0 0 35px rgba(168,85,247,0.45), 0 0 70px rgba(6,182,212,0.25);">
      </div>

      <h1 class="portal-title">`;

if (content.includes(oldIndexHero)) {
  content = content.replace(oldIndexHero, newIndexHero);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('build_standalone_pages.js updated with logo and favicon across all templates!');
