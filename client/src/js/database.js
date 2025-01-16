import { openDB } from "idb";

// Initialize the database and create the object store if it doesn't already exist
const initdb = async () =>
  openDB("textedit", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("textedit")) {
        // Log if the database already exists
        console.log("textedit database already exists");
        return;
      }
      // Create the object store for textedit with autoIncrement for the id
      db.createObjectStore("textedit", { keyPath: "id", autoIncrement: true });
      console.log("textedit database created");
    },
  });

// Method that accepts content and saves it to the database
export const putDb = async (content) => {
  console.log("PUT to the database");
  // Open the database and initiate a transaction with 'readwrite' mode
  const todosDb = await openDB("textedit", 1);
  const tx = todosDb.transaction("textedit", "readwrite");
  const store = tx.objectStore("textedit");
  // Put the content into the object store
  const request = store.put({ id: 1, value: content });
  const result = await request;
  console.log("Data saved to the database", result.value);
};

// Method that retrieves the content from the database
export const getDb = async () => {
  console.log("GET from the database");
  // Open the database and initiate a 'readonly' transaction
  const todosDb = await openDB("textedit", 1);
  const tx = todosDb.transaction("textedit", "readonly");
  const store = tx.objectStore("textedit");
  // Get the data from the object store by the specified key
  const request = store.get(1);
  const result = await request;
  console.log("result.value", result);
  return result?.value;
};

// Initialize the database
initdb();