const { spawn } = require('child_process');
const fs = require('fs');

const fileStream = fs.createWriteStream('seed_execution_log.txt');

const ls = spawn('npx', ['tsx', 'prisma/seed.ts'], {
  cwd: process.cwd(),
  shell: true
});

ls.stdout.pipe(fileStream);
ls.stderr.pipe(fileStream);

ls.on('close', (code) => {
  fs.appendFileSync('seed_execution_log.txt', `\nCHILD PROCESS EXITED WITH CODE ${code}`);
});
