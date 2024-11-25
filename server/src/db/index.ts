import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";


import * as schema from "./schema";

import { getDatabasePath } from "../vars";

const dbPath = getDatabasePath()

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ?? createClient({ url: dbPath });

export const db = drizzle(client, { schema });
