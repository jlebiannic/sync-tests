import fs from "fs";
import path from "path";

export function visitFilesInDirDeeply(
  dir: string,
  visitAction: (fileName: string, fullPath: string) => void
) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      visitFilesInDirDeeply(filePath, visitAction);
    } else {
      visitAction(file, dir);
    }
  });
}

export function visitDirectoriesInDirDeeply(
  dir: string,
  visitAction: (dirFullPath: string) => void
) {
  fs.readdirSync(dir).forEach(dirElement => {
    const filePath = path.join(dir, dirElement);
    if (fs.statSync(filePath).isDirectory()) {
      visitAction(filePath);
      visitDirectoriesInDirDeeply(filePath, visitAction);
    }
  });
}

export function getRelativePath(fullPath: string, rootPath: string) {
  return fullPath.replace(rootPath, "");
}

export function createPathIfNotExists(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

export function moveFileTo(fullFilePath: string, targetPath: string) {
  const fileName = path.basename(fullFilePath);
  const newFilePath = path.join(targetPath, fileName);
  fs.renameSync(fullFilePath, newFilePath);
  return newFilePath;
}

export function getLastPathElement(fullPath: string) {
  return path.basename(fullPath);
}

export function isDirectoryEmpty(dir: string) {
  let isEmpty = false;
  try {
    const files = fs.readdirSync(dir);
    isEmpty = files.length === 0;
  } catch (err) {
    console.error(err);
  }
  return isEmpty;
}

export function removeDirectory(dir: string) {
  try {
    fs.rmdirSync(dir);
  } catch (err) {
    console.error(err);
  }
}

export function removeEmptyDirectories(dir: string): string[] {
  const emptyDirs: string[] = getEmptyDirectories(dir);
  removeEmptyListOfDirectories(emptyDirs);
  return emptyDirs;
}
function removeEmptyListOfDirectories(emptyDirs: string[]) {
  emptyDirs.forEach(emptyDir => {
    removeDirectory(emptyDir);
  });
}

function getEmptyDirectories(dir: string) {
  const emptyDirs: string[] = [];
  visitDirectoriesInDirDeeply(dir, (fullDirName: string) => {
    if (isDirectoryEmpty(fullDirName)) {
      emptyDirs.push(fullDirName);
    }
  });
  return emptyDirs;
}

export function getFileNameWithoutExtension(fileName: string) {
  return path.parse(fileName).name;
}

export function getFileExtension(fileName: string) {
  return path.parse(fileName).ext;
}
