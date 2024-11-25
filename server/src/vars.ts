// Get DB path from arg's
export const getDatabasePath = (): string => {
  let dbPath: string | undefined;

  for (const arg of process.argv) {
      if (arg.startsWith('--dbPath=')) {
          dbPath = arg.split('=')[1];
          break;
      }
  }

  dbPath = dbPath || './default.db';

  console.log(`Using SQLite database at: ${dbPath}`);
  return dbPath;
};