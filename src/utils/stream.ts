import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ChatDBSchema extends DBSchema {
  messages: {
    key: number;
    value: {
      id: number;
      role: "user" | "assistant";
      content: string;
      timestamp: number;
    };
    indexes: { "by-timestamp": number };
  };
}

const dbPromise = openDB<ChatDBSchema>("chatDB", 1, {
  upgrade(db) {
    const messageStore = db.createObjectStore("messages", {
      keyPath: "id",
      autoIncrement: true,
    });
    messageStore.createIndex("by-timestamp", "timestamp");
  },
});

export async function getDb(): Promise<IDBPDatabase<ChatDBSchema>> {
  return dbPromise;
}

export async function addMessage(message: {
  role: "user" | "assistant";
  content: string;
}) {
  const db = await getDb();
  return db.add("messages", {
    ...message,
    id: Date.now(),
    timestamp: Date.now(),
  });
}

export async function getAllMessages() {
  const db = await getDb();
  return db.getAllFromIndex("messages", "by-timestamp");
}

export async function clearAllMessages() {
  const db = await getDb();
  return db.clear("messages");
}
