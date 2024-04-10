const { join } = require("node:path");
const fs = require("node:fs/promises");

function getFilenameFromPath(path, prefix) {
  return path.slice(prefix.length);
}
  
async function saveFile(directory, filename, content) {
  const resolvedName = resolveFilename(directory, filename);
  try {
    await fs.writeFile(resolvedName, content);
  } catch (err) {
    console.log(
      `Cannot write given content into "${resolvedName}" file. ${err.message}`
    );
    return false;
  }
  return true;
}

async function readFile(directory, filename) {
  const resolvedName = join(directory, filename);
  return await fs.readFile(resolvedName);
}

function resolveFilename(directory, filename) {
  return join(directory, filename);
}

module.exports = {
  getFilenameFromPath,
  saveFile,
  readFile
};