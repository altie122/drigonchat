import { type Config } from "drizzle-kit";

import { getDatabasePath } from "./src/vars";

const dbPath = getDatabasePath()

export default {
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
  tablesFilter: ["drigonchat-server_*"],
} satisfies Config;
