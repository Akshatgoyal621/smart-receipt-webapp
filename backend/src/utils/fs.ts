import fs from 'fs';
import path from 'path';

export function ensureUploadDir(dirName: string) {
  const dir = path.join(process.cwd(), dirName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created upload dir:', dir);
  }
}
