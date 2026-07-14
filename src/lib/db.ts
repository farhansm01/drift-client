import { MongoClient, Db } from "mongodb";

/**
 * Drift — MongoDB connection helper (Next.js frontend side).
 *
 * Uses a NON-SRV connection string (mongodb://host1:port,host2:port/...)
 * instead of mongodb+srv://, since SRV lookups need DNS TXT/SRV records
 * that some ISPs block. Atlas gives you this under "Drivers" ->
 * "I don't have DNS SRV support".
 *
 * Cached on globalThis so Next.js dev-mode HMR doesn't spawn a new
 * MongoClient (and connection pool) on every save.
 */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "drift";

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI in .env.local — use the non-SRV connection string from Atlas (Drivers -> I don't have DNS SRV support)."
  );
}

interface MongoGlobalCache {
  client: MongoClient | null;
  clientPromise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _driftMongo: MongoGlobalCache | undefined;
}

const globalCache: MongoGlobalCache = global._driftMongo ?? {
  client: null,
  clientPromise: null,
};

if (process.env.NODE_ENV === "development") {
  global._driftMongo = globalCache;
}

function getClientPromise(): Promise<MongoClient> {
  if (globalCache.clientPromise) {
    return globalCache.clientPromise;
  }

  const client = new MongoClient(MONGODB_URI as string);
    globalCache.clientPromise = client.connect().then((connected) => {
        globalCache.client = connected;
        return connected;
    });

  return globalCache.clientPromise;
}

/**
 * Get a handle to the Drift database. Call inside route handlers /
 * server actions — never at module top-level outside this file.
 *
 *   const db = await getDb();
 *   const cars = await db.collection("cars").find().toArray();
 */
export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(MONGODB_DB);
}

export default getClientPromise;