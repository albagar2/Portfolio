const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add file header if not exists
  if (!content.includes('@fileoverview')) {
    const fileName = path.basename(file);
    let desc = `Componente o utilidad de la aplicación.`;
    if (file.includes('context')) desc = `Contexto global de la aplicación para manejar el estado.`;
    if (file.includes('services')) desc = `Servicios de integración con APIs externas o backend.`;
    if (file.includes('pages')) desc = `Página o vista principal de la aplicación.`;
    if (file.includes('components')) desc = `Componente de interfaz de usuario (UI).`;
    if (fileName === 'App.tsx') desc = `Componente raíz de la aplicación que maneja el enrutamiento y estado global.`;
    if (fileName === 'main.tsx') desc = `Punto de entrada principal de React.`;
    
    const header = `/**
 * @fileoverview Archivo: ${fileName}
 * @description ${desc}
 * Este archivo fue comentado automáticamente para mejorar la mantenibilidad y legibilidad del código.
 */\n`;
    
    // insert after imports
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + '\n' + header + content.slice(endOfLine + 1);
    } else {
      content = header + content;
    }
    changed = true;
  }

  // Add inline comments for hooks
  const useEffectRegex = /useEffect\(\(\) => {/g;
  if (content.match(useEffectRegex) && !content.includes('// EFECTO:')) {
    content = content.replace(useEffectRegex, '// EFECTO: Se ejecuta ciclo de vida del componente o suscripciones\n  useEffect(() => {');
    changed = true;
  }

  const useStateRegex = /useState\(/g;
  if (content.match(useStateRegex) && !content.includes('// ESTADO LOCAL:')) {
    content = content.replace(/const \[([a-zA-Z0-9_]+), set[a-zA-Z0-9_]+\] = useState/g, '// ESTADO LOCAL: Maneja el valor de $1\n  const [$1, set$1] = useState');
    // We might have duplicated spaces but it's ok
    changed = true;
  }

  // Add comments to component declarations
  const componentRegex = /export const ([A-Z][a-zA-Z0-9_]+) =/g;
  if (content.match(componentRegex)) {
    content = content.replace(/export const ([A-Z][a-zA-Z0-9_]+) =/g, '/**\n * Componente $1\n * @returns {JSX.Element} El componente renderizado.\n */\nexport const $1 =');
    changed = true;
  }

  // function declarations
  const funcRegex = /export function ([a-zA-Z0-9_]+)\(/g;
  if (content.match(funcRegex)) {
    content = content.replace(/export function ([a-zA-Z0-9_]+)\(/g, '/**\n * Función $1\n */\nexport function $1(');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Added comments to ' + files.length + ' files.');
