import { SyncTestManager } from "../../util/SyncTestManager";

const syncTestManager: SyncTestManager = new SyncTestManager("", "");
test("syncTestManager.isExtensionJsJsxTsTsx SHOULD detect file with extension js, jsx, ts and tsx", () => {
  expect(syncTestManager.isExtensionJsJsxTsTsx("file.ts")).toBeTruthy();
  expect(syncTestManager.isExtensionJsJsxTsTsx("file.tsx")).toBeTruthy();
  expect(syncTestManager.isExtensionJsJsxTsTsx("file.js")).toBeTruthy();
  expect(syncTestManager.isExtensionJsJsxTsTsx("file.jsx")).toBeTruthy();
  expect(syncTestManager.isExtensionJsJsxTsTsx("file.txt")).toBeFalsy();
  expect(syncTestManager.isExtensionJsJsxTsTsx("file.scss")).toBeFalsy();
});
