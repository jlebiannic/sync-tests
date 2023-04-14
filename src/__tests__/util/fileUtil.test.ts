import { getFileExtension } from "../../util/fileUtil";

test("getFileExtension SHOULD return the correct extension of a file", () => {
  expect(getFileExtension("")).toBe("");
  expect(getFileExtension("fichier.tsx")).toBe(".tsx");
  expect(getFileExtension("fichier.ts")).toBe(".ts");
});
