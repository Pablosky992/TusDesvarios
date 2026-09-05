const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build_standalone_pages.js');
const robustScriptPath = path.join(__dirname, 'build_robust_humor.js');

const buildContent = fs.readFileSync(buildPath, 'utf8');
const robustContent = fs.readFileSync(robustScriptPath, 'utf8');

// Extract function generateRobustHumorHtml() from robustContent
const startIdx = robustContent.indexOf('function generateRobustHumorHtml()');
const endIdx = robustContent.indexOf('module.exports');

let funcCode = robustContent.substring(
  startIdx,
  endIdx !== -1 ? endIdx : robustContent.length
).replace('function generateRobustHumorHtml()', 'function generateHumorHtml()');

// Replace in build_standalone_pages.js
const splitKey = '// ==========================================================\n// 8. GENERATE DESVARIOS-DE-HUMOR.HTML';
const base = buildContent.split(splitKey)[0];

const newFooter = splitKey + '\n' + funcCode + `
// Save standalone Humor page
const humorOut = path.join(__dirname, '..', 'desvarios-de-humor.html');
fs.writeFileSync(humorOut, generateHumorHtml(), 'utf8');

console.log('Successfully generated index.html, crea-tu-historia.html, desvarios-mentales.html, desvarios-retro.html, desvarios-de-humor.html, juego-el-ahorcado.html, juego-snake-cyberpunk.html, 8 test HTML files, and 2 story HTML files!');
`;

fs.writeFileSync(buildPath, base + newFooter, 'utf8');
console.log('Successfully synchronized build_standalone_pages.js with robust DOM humor generator!');
