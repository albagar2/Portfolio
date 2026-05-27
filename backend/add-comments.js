const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If the file doesn't already have a generic jsdoc at the top
      if (!content.trim().startsWith('/**')) {
        const comment = `/**\n * ${file}\n * Archivo TypeScript de la aplicación.\n * Contiene la lógica y definiciones para esta parte del módulo.\n */\n`;
        content = comment + content;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Comentado: ${fullPath}`);
      }
    }
  }
}

const srcPath = path.join(__dirname, 'src');
processDirectory(srcPath);
console.log("Todos los archivos han sido comentados.");
