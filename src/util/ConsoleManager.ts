class ConsoleManager {
  warns: string[] = [];
  fixs: string[] = [];
  removes: string[] = [];

  logFix = (msg: string) => {
    this.fixs.push(msg);
  };

  logWarn = (msg: string) => {
    this.warns.push(msg);
  };

  logRemove(msg: string): void {
    this.removes.push(msg);
  }

  displayLogs = () => {
    this.fixs.forEach(aFix => console.log(`[FIX] ${aFix}`));
    this.removes.forEach(aRemove => console.log(`[REMOVE] ${aRemove}`));
    this.warns.forEach(aWarn => console.log(`[WARN] ${aWarn}`));
  };
}

export const consoleManager = new ConsoleManager();
