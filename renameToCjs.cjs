const fs = require('fs');
const path = require('path');

const directories = ['src/database/migrations', 'src/database/seeders'];

directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      if (file.endsWith('.js')) {
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, file.replace('.js', '.cjs'));

        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} → ${path.basename(newPath)}`);
      }
    });
  }
});
