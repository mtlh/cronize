import { createClient } from "@libsql/client/web";

export function connectdb() {
  return createClient({
    url: import.meta.env.TURSO_DATABASE_URL!,
    authToken: import.meta.env.TURSO_AUTH_TOKEN,
  });
}
