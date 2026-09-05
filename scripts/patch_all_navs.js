const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'build_standalone_pages.js');
let content = fs.readFileSync(targetPath, 'utf8');

// The pattern to match navigation before index.html link
const redNavSnippet = `          <a href="desvarios-por-la-red.html" class="nav-link " title="Escaparate Web y Bazar de Curiosidades de Amazon">
            <span>🌐</span>
            <span class="nav-link-text">Por la Red</span>
          </a>
          <a href="index.html"`;

// Replace all occurrences where desvarios-de-humor is followed directly by index.html without desvarios-por-la-red in between
content = content.replace(/(href="desvarios-de-humor\.html"[\s\S]*?<\/a>\s*)(<a href="index\.html")/g, (match, p1, p2) => {
  if (p1.includes('desvarios-por-la-red.html')) {
    return match;
  }
  return p1 + `          <a href="desvarios-por-la-red.html" class="nav-link " title="Escaparate Web y Bazar de Curiosidades de Amazon">
            <span>🌐</span>
            <span class="nav-link-text">Por la Red</span>
          </a>\n` + p2;
});

// Also make sure require('./build_red_pages.js'); is present before the final console.log
if (!content.includes("require('./build_red_pages.js');")) {
  content = content.replace(
    "require('./build_literarios_pages.js');",
    "require('./build_literarios_pages.js');\nrequire('./build_red_pages.js');"
  );
}

// And update the final log message to include desvarios-por-la-red.html
content = content.replace(
  "desvarios-de-humor.html,",
  "desvarios-de-humor.html, desvarios-por-la-red.html,"
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully patched all navigation bars in build_standalone_pages.js!');
