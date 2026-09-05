const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const storyPath = path.join(__dirname, '..', 'data', 'stories', 'el-manuscrito-de-la-abadia.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Map node IDs to numbered sections 1..N
const nodeIds = [
  "inicio_abadia",
  "nodo_2_sacristia_lapis",
  "nodo_3_botica_alquimia",
  "nodo_4_scriptorium_guillermo",
  "nodo_5_celda_mapa",
  "nodo_6_proyeccion_coro",
  "nodo_7_triforio_escape",
  "nodo_8_destilacion_antidoto",
  "nodo_9_autopsia_veneno",
  "nodo_10_trance_alquimico",
  "nodo_11_laberinto_alhazen",
  "nodo_12_pasadizos_muro",
  "nodo_13_celada_biblioteca",
  "nodo_15_esclusas_romanas",
  "nodo_16_observatorio_campanario",
  "nodo_17_refectorio_tension",
  "nodo_18_debate_capitulo",
  "nodo_19_astrolabio_ritual",
  "nodo_20_glaciar_durmiente",
  "nodo_21_inundacion_cataclismo",
  "nodo_22_sabotaje_torre",
  "nodo_23_confrontacion_directa",
  "nodo_24_preparar_exodo",
  "nodo_final_renacimiento",
  "nodo_final_holocausto",
  "nodo_final_patriarca",
  "nodo_final_tinta",
  "nodo_final_baculo",
  "nodo_final_exodo",
  "nodo_final_diluvio",
  "nodo_final_sepulcro"
];

const idToNumber = {};
nodeIds.forEach((id, index) => {
  idToNumber[id] = index + 1;
});

function formatMarkdown(text) {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/);
  return blocks.map(block => {
    const trimmed = block.trim();
    let formatted = trimmed
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    if (trimmed.startsWith('>')) {
      const quote = formatted.replace(/^>\s*/gm, '');
      return `<blockquote>${quote}</blockquote>`;
    }
    return `<p>${formatted}</p>`;
  }).join('\n');
}

function getBase64Image(relPath) {
  try {
    const cleanPath = relPath.replace(/^\//, '');
    const fullPath = path.join(__dirname, '..', cleanPath);
    if (fs.existsSync(fullPath)) {
      const data = fs.readFileSync(fullPath);
      return `data:image/jpeg;base64,${data.toString('base64')}`;
    }
  } catch (err) {
    console.error('Error reading image:', relPath, err);
  }
  return '';
}

const coverBase64 = getBase64Image('images/stories/abadia-prohibida/portada.jpg');

let sectionsHtml = '';

nodeIds.forEach(id => {
  const node = story.nodos[id];
  if (!node) return;
  const num = idToNumber[id];
  const isEnding = !!node.esFinal;
  const imgBase64 = node.imagen ? getBase64Image(node.imagen) : '';

  let choicesHtml = '';
  if (isEnding) {
    let badgeClass = 'ending-neutral';
    let badgeText = 'FINAL NEUTRO / TRASCENDENCIA';
    if (node.tipo_final === 'bueno') {
      badgeClass = 'ending-good';
      badgeText = 'FINAL HEROICO / SALVACIÓN';
    } else if (node.tipo_final === 'malo') {
      badgeClass = 'ending-bad';
      badgeText = 'FINAL TRÁGICO / PERDICIÓN';
    }

    choicesHtml = `
      <div class="ending-box ${badgeClass}">
        <div class="ending-tag">${badgeText}</div>
        <div class="ending-title">${node.titulo}</div>
        ${node.mensaje_final ? `<p class="ending-quote">&ldquo;${node.mensaje_final}&rdquo;</p>` : ''}
        <div class="ending-fin">─── FIN DE LA AVENTURA ───</div>
      </div>
    `;
  } else if (node.opciones && node.opciones.length > 0) {
    const listItems = node.opciones.map(opt => {
      const targetNum = idToNumber[opt.destinoId] || '?';
      return `
        <li class="choice-item">
          <span class="choice-text">${opt.texto}...</span>
          <a href="#sec-${targetNum}" class="choice-link">Pasa al <strong>${targetNum}</strong></a>
        </li>
      `;
    }).join('\n');

    choicesHtml = `
      <div class="choices-container">
        <div class="choices-header">✦ ¿QUÉ DECIDES HACER? ✦</div>
        <ul class="choices-list">
          ${listItems}
        </ul>
      </div>
    `;
  }

  sectionsHtml += `
    <section id="sec-${num}" class="section-card ${isEnding ? 'page-break-after' : ''}">
      <div class="section-header">
        <div class="section-number">${num}</div>
        <div class="section-title">${node.titulo}</div>
      </div>

      ${imgBase64 ? `
        <div class="section-image-wrapper">
          <img src="${imgBase64}" alt="${node.titulo}" class="section-image" />
        </div>
      ` : ''}

      <div class="section-body">
        ${formatMarkdown(node.texto)}
      </div>

      ${choicesHtml}

      <div class="section-divider">❖ ❖ ❖</div>
    </section>
  `;
});

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${story.titulo} — Gran Novela Interactiva</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap');

    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-center {
        content: counter(page);
        font-family: 'Cinzel', serif;
        font-size: 9pt;
        color: #718096;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Crimson Pro', Georgia, 'Times New Roman', serif;
      font-size: 11.5pt;
      line-height: 1.65;
      color: #1a202c;
      background: #ffffff;
    }

    a {
      color: #8b1d1d;
      text-decoration: none;
      font-weight: 600;
    }

    a:hover {
      text-decoration: underline;
    }

    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 90vh;
      text-align: center;
      padding: 3rem 1rem;
      border: 3px double #2d3748;
      margin-bottom: 2rem;
    }

    .cover-ornament {
      font-size: 24pt;
      color: #8b1d1d;
      margin-bottom: 1.5rem;
    }

    .cover-title {
      font-family: 'Cinzel', serif;
      font-size: 28pt;
      font-weight: 900;
      line-height: 1.2;
      color: #1a202c;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .cover-subtitle {
      font-family: 'Crimson Pro', serif;
      font-size: 14pt;
      font-style: italic;
      color: #4a5568;
      max-width: 600px;
      margin-bottom: 2rem;
    }

    .cover-image {
      width: 100%;
      max-width: 520px;
      max-height: 280px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #cbd5e0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      margin-bottom: 2rem;
    }

    .cover-meta {
      font-family: 'Cinzel', serif;
      font-size: 10.5pt;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #718096;
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
      width: 80%;
    }

    .instructions-page {
      page-break-after: always;
      padding: 2.5rem 1.5rem;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      margin-bottom: 3rem;
    }

    .instructions-title {
      font-family: 'Cinzel', serif;
      font-size: 16pt;
      font-weight: 700;
      text-align: center;
      color: #8b1d1d;
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .instructions-body p {
      margin-bottom: 1rem;
      line-height: 1.7;
    }

    .instructions-body ul {
      margin-left: 2rem;
      margin-bottom: 1.25rem;
    }

    .instructions-body li {
      margin-bottom: 0.5rem;
    }

    .section-card {
      margin-bottom: 2.5rem;
      padding: 1.5rem 0;
      position: relative;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
      border-bottom: 2px solid #8b1d1d;
      padding-bottom: 0.5rem;
    }

    .section-number {
      font-family: 'Cinzel', serif;
      font-size: 24pt;
      font-weight: 900;
      color: #ffffff;
      background: #8b1d1d;
      width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 14pt;
      font-weight: 700;
      color: #2d3748;
      letter-spacing: 0.04em;
    }

    .section-image-wrapper {
      margin: 1.25rem 0;
      text-align: center;
    }

    .section-image {
      width: 100%;
      max-height: 260px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #cbd5e0;
    }

    .section-body {
      text-align: justify;
      margin-bottom: 1.5rem;
    }

    .section-body p {
      margin-bottom: 1rem;
      text-indent: 1.5em;
    }

    .section-body p:first-of-type {
      text-indent: 0;
    }

    .section-body p:first-of-type::first-letter {
      font-family: 'Cinzel', serif;
      font-size: 30pt;
      float: left;
      line-height: 0.8;
      padding-right: 0.15em;
      color: #8b1d1d;
      font-weight: 700;
    }

    .section-body blockquote {
      border-left: 3px solid #8b1d1d;
      padding: 0.6rem 1.2rem;
      margin: 1.25rem 1rem;
      background: #fdfaf6;
      font-style: italic;
      color: #4a5568;
    }

    .choices-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #8b1d1d;
      padding: 1.25rem 1.5rem;
      border-radius: 0 6px 6px 0;
      margin: 1.75rem 0;
    }

    .choices-header {
      font-family: 'Cinzel', serif;
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #8b1d1d;
      text-transform: uppercase;
      margin-bottom: 0.85rem;
      text-align: center;
    }

    .choices-list {
      list-style: none;
    }

    .choice-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 11pt;
    }

    .choice-item:last-child {
      border-bottom: none;
    }

    .choice-text {
      flex: 1;
      color: #2d3748;
    }

    .choice-link {
      font-family: 'Cinzel', serif;
      white-space: nowrap;
      background: #8b1d1d;
      color: #ffffff;
      padding: 0.25rem 0.65rem;
      border-radius: 3px;
      font-size: 9.5pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .choice-link:hover {
      background: #6b1414;
      text-decoration: none;
    }

    .ending-box {
      border: 2px solid #8b1d1d;
      padding: 1.75rem;
      text-align: center;
      border-radius: 6px;
      margin: 2rem 0;
      background: #fdfaf6;
    }

    .ending-tag {
      font-family: 'Cinzel', serif;
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #8b1d1d;
      margin-bottom: 0.5rem;
    }

    .ending-title {
      font-family: 'Cinzel', serif;
      font-size: 16pt;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 1rem;
    }

    .ending-quote {
      font-style: italic;
      color: #4a5568;
      font-size: 12pt;
      margin-bottom: 1.25rem;
    }

    .ending-fin {
      font-family: 'Cinzel', serif;
      font-size: 9pt;
      letter-spacing: 0.15em;
      color: #a0aec0;
    }

    .section-divider {
      text-align: center;
      color: #cbd5e0;
      margin: 2rem 0;
      font-size: 12pt;
      letter-spacing: 0.5em;
    }

    .page-break-after {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- PORTADA -->
  <div class="cover-page">
    <div class="cover-ornament">📜 ✦ 🕯️ ✦ ⚔️</div>
    <h1 class="cover-title">${story.titulo}</h1>
    <div class="cover-subtitle">&ldquo;${story.subtitulo}&rdquo;</div>
    ${coverBase64 ? `<img src="${coverBase64}" class="cover-image" alt="Portada" />` : ''}
    <div class="cover-meta">
      <p><strong>Autor:</strong> ${story.autor} | <strong>Género:</strong> ${story.genero}</p>
      <p style="margin-top: 0.5rem; font-size: 9pt;">Gran Novela Interactiva con 31 Secciones Numeradas y 8 Desenlaces Épicos</p>
    </div>
  </div>

  <!-- INSTRUCCIONES -->
  <div class="instructions-page">
    <h2 class="instructions-title">Instrucciones para el Lector</h2>
    <div class="instructions-body">
      <p>Tienes en tus manos una <strong>Novela Interactiva de Investigación y Misterio Gótico</strong>.</p>
      <ul>
        <li>Comenzarás siempre en la sección <strong>1</strong>.</li>
        <li>Al final de cada sección, se te presentarán varias opciones que representan las decisiones de Fray Tomás de Aquitania.</li>
        <li>Cada opción te indicará a qué número de sección debes acudir (por ejemplo: <em>«Pasa al 8»</em>).</li>
        <li>Si estás leyendo este documento en formato digital (PDF o navegador), puedes hacer <strong>clic directo sobre el botón del número</strong> para saltar instantáneamente a esa sección. Si lo tienes impreso, simplemente hojea hasta encontrar el número correspondiente.</li>
        <li>Existen <strong>8 finales exclusivos</strong>: salvación humanista, holocausto inquisitorial, comunión cósmica con el glaciar, ascensión al abadiato secreto, o fuga con los manuscritos fundacionales de la ciencia.</li>
      </ul>
      <p style="text-align: center; font-style: italic; color: #8b1d1d; margin-top: 1.5rem;">
        ✦ Enciende tu candil, ajusta el sayal y da tu primer paso en la sección <strong>1</strong>. ✦
      </p>
    </div>
  </div>

  <!-- SECCIONES NUMERADAS 1..31 -->
  ${sectionsHtml}

</body>
</html>
`;

const htmlOutputPath = path.join(__dirname, '..', 'libro_el_manuscrito_prohibido.html');
fs.writeFileSync(htmlOutputPath, htmlContent, 'utf8');
console.log('Created HTML gamebook at:', htmlOutputPath);

// Word doc copy
const docOutputPath = path.join(__dirname, '..', 'libro_el_manuscrito_prohibido.doc');
fs.copyFileSync(htmlOutputPath, docOutputPath);
console.log('Created Word-compatible .doc at:', docOutputPath);

// Generate PDF via Microsoft Edge or Google Chrome Headless
const pdfOutputPath = path.join(__dirname, '..', 'libro_el_manuscrito_prohibido.pdf');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let browserExe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(chromePath) ? chromePath : null);

if (browserExe) {
  try {
    const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfOutputPath}" --print-to-pdf-no-header "${htmlOutputPath}"`;
    console.log('Generating PDF via browser headless...');
    execSync(cmd);
    console.log('PDF successfully generated at:', pdfOutputPath);
  } catch (e) {
    console.error('Error generating PDF:', e);
  }
}
