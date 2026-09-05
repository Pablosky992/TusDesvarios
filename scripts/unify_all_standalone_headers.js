const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Sincronizando y reconstruyendo todas las páginas con el encabezado unificado...');

const scriptsDir = __dirname;

try {
  console.log('1/3 Reconstruyendo build_standalone_pages.js...');
  execSync('node build_standalone_pages.js', { cwd: scriptsDir, stdio: 'inherit' });

  console.log('2/3 Reconstruyendo build_literarios_pages.js...');
  execSync('node build_literarios_pages.js', { cwd: scriptsDir, stdio: 'inherit' });

  console.log('3/3 Reconstruyendo build_red_pages.js...');
  execSync('node build_red_pages.js', { cwd: scriptsDir, stdio: 'inherit' });

  console.log('🔍 Verificando sincronización de cabeceras en todas las páginas...');
  execSync('node verify_all_headers.js', { cwd: scriptsDir, stdio: 'inherit' });

  console.log('✨ ¡Todas las páginas están 100% actualizadas con el encabezado unificado en 2 filas y logo grande!');
} catch (error) {
  console.error('❌ Error durante la sincronización:', error.message);
  process.exit(1);
}

