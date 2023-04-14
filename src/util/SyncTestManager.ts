import path from "path";
import { consoleManager } from "./ConsoleManager";
import {
  createPathIfNotExists,
  getFileExtension,
  getFileNameWithoutExtension,
  getRelativePath,
  moveFileTo,
  removeEmptyDirectories,
  visitFilesInDirDeeply
} from "./fileUtil";

const TEST_FILE_SUFFIX = ".test";
const FILES_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

export class SyncTestManager {
  filesMap: Map<string, string> = new Map();
  doublons: string[] = [];

  constructor(public pathToCheck: string, public refPath: string) {}

  run = (pathToCheck: string, refPath: string) => {
    this.createMapSourceFileNameWithDirectory(refPath);
    this.checkAndRefactor(pathToCheck, refPath);
    const emptyDirs = removeEmptyDirectories(pathToCheck);
    emptyDirs.forEach(emptyDir => consoleManager.logRemove(`${emptyDir}`));
    consoleManager.displayLogs();
  };

  createMapSourceFileNameWithDirectory = (dir: string) => {
    this.doublons = this.getDoublons(dir);
    visitFilesInDirDeeply(dir, (fileName, fullPath) => {
      const fileNameWithoutExtension = getFileNameWithoutExtension(fileName);
      if (
        this.isExtensionJsJsxTsTsx(fileName) &&
        this.notDoublon(fileNameWithoutExtension)
      ) {
        this.filesMap.set(fileNameWithoutExtension, fullPath);
      }
    });
  };

  notDoublon = (fileNameWithoutExtension: string) => {
    return !this.doublons.includes(fileNameWithoutExtension);
  };

  getDoublons = (dir: string) => {
    const doublonsTrouvees: string[] = [];
    const filesWithoutExtensionTrouvees: Map<string, string> = new Map();
    visitFilesInDirDeeply(dir, (fileName, fullPath) => {
      const fileNameWithoutExtension = getFileNameWithoutExtension(fileName);
      if (this.isExtensionJsJsxTsTsx(fileName)) {
        if (filesWithoutExtensionTrouvees.has(fileNameWithoutExtension)) {
          doublonsTrouvees.push(fileNameWithoutExtension);
          consoleManager.logWarn(
            `Duplicate file found: ${fileName} \n Existing path: ${filesWithoutExtensionTrouvees.get(
              fileNameWithoutExtension
            )} \n New path     : ${fullPath}`
          );
        } else {
          filesWithoutExtensionTrouvees.set(fileNameWithoutExtension, fullPath);
        }
      }
    });

    return doublonsTrouvees;
  };

  checkAndRefactor = (pathToCheck: string, refPath: string) => {
    visitFilesInDirDeeply(pathToCheck, (testFileName, testFullPath) => {
      const testFullFileName = path.join(testFullPath, testFileName);
      const fileNameWithoutTestSuffix =
        this.getFileNameWithoutTestSuffix(testFileName);
      if (this.notDoublon(fileNameWithoutTestSuffix)) {
        if (this.isInMap(fileNameWithoutTestSuffix)) {
          const correctRefPath = this.filesMap.get(fileNameWithoutTestSuffix);
          if (
            correctRefPath &&
            this.isNotCorrectTestPath(testFullPath, correctRefPath)
          ) {
            const correctTestPath =
              this.getTestPathFromSourcePath(correctRefPath);
            createPathIfNotExists(correctTestPath);
            moveFileTo(testFullFileName, correctTestPath);

            consoleManager.logFix(
              `Incorrect path for test: ${testFileName}\n wrong:   ${testFullPath}\n correct: ${correctTestPath}`
            );
          }
        } else {
          consoleManager.logWarn(
            `Lonely test: ${testFileName} (${testFullPath})`
          );
        }
      }
    });
  };

  isNotCorrectTestPath = (fullTestPath: string, correctPath: string) => {
    let correctRelativePath = getRelativePath(correctPath, this.refPath);

    return (
      getRelativePath(fullTestPath, this.pathToCheck) !== correctRelativePath
    );
  };

  isInMap(fileNameWithoutTestSuffix: string) {
    return this.filesMap.has(fileNameWithoutTestSuffix);
  }

  getFileNameWithoutTestSuffix(testFileName: string) {
    return getFileNameWithoutExtension(
      testFileName.replace(TEST_FILE_SUFFIX, "")
    );
  }

  getTestPathFromSourcePath(sourcePath: string) {
    let relativeSourcePath = getRelativePath(sourcePath, this.refPath);
    return this.pathToCheck + relativeSourcePath;
  }

  isExtensionJsJsxTsTsx(fileName: string) {
    return FILES_EXTENSIONS.includes(getFileExtension(fileName));
  }
}
