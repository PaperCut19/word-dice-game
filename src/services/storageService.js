// --- 1. local storage adapter (guest mode) ---
const LOCAL_STORAGE_KEY = "dice_objects";

const localAdapter = {
  /**
   * Retrieves dice configuration objects from browser storage
   * @returns {Promise<Array>} A promise that resolves with the array of dice objects
   */
  getDiceObjects: () => {
    // 1. retrieve the string, defaulting to [] if nothing is there
    const objectsString = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
    // 2. parse the string into a javascript array
    const objects = JSON.parse(objectsString);

    // 3. return a resolved promise to match the async interface of apiAdapter
    return Promise.resolve(objects);
  },

  /**
   * Saves or updates a single dice configuration object to browser storage
   * @param {Object} diceObject - the configuration object to save/update (must have an 'id')
   * @returns {Promise<Array>} A promise that resolves with the updated list of objects
   */
  saveDiceObject: (diceObject) => {
    const currentObjects = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
    );

    // find where the item currently live
    const index = currentObjects.findIndex((d) => d.id === diceObject.id);

    let newObjects;
    if (index !== -1) {
      // update: create copy and replace at exact index
      newObjects = [...currentObjects];
      newObjects[index] = diceObject;
    } else {
      // create: add to the end
      newObjects = [...currentObjects, diceObject];
    }

    // save the updated array back to storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newObjects));

    return Promise.resolve(newObjects);
  },

  /**
   * deletes a dice configuration object from browser storage
   * @param {string} diceObjectId - the ID of the object to delete
   * @returns {Promise<Array>} A promise that resolves with the updated list of objects
   */
  deleteDiceObject: (diceObjectId) => {
    const currentObjects = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
    );

    // filter out the object that matches the provided ID
    const newObjects = currentObjects.filter((d) => d.id !== diceObjectId);

    // save the updated, filtered array back to storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newObjects));
    return Promise.resolve(newObjects);
  },
};

// --- 2. API adapter (user mode) ---
// base URL for your API endpoint
const API_BASE_URL = "http://localhost:3000/api/dice_objects";

// [!] NEW HELPER FUNCTION: centralized response handler
// this handles the 'token expired' check for all API calls below
const handleApiResponse = async (response) => {
  // check for 'unauthorized' (401) or 'forbidden' (403)
  if (response.status === 401 || response.status === 403) {
    // 1. notify the user
    alert("your session has expired. please log in again");

    // 2. clear the stored credentials (keys must match AuthContext.jsx)
    localStorage.removeItem("site_token");
    localStorage.removeItem("site_user");

    // 3. force the browser to reload.
    // this resets the React app, forcing it to notice the missing token
    // and show the login screen
    window.location.reload();

    // throw error to stop further code execution
    throw new Error("session expired");
  }

  // check for other API errors (500, 404, etc)
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  // if all good, parse the JSON
  return response.json();
};

const apiAdapter = {
  /**
   * Retrieves dice configuration objects from the online database
   * @param {string} token - the JSON web token for authorization
   * @returns {Promise<Array>} A promise that resolves with the array of objects from the API
   */
  getDiceObjects: async (token) => {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleApiResponse(response);
  },

  /**
   * Saves a new dice or updated dice configuration object to the online database
   * @param {Object} diceData - the configuration object to save
   * @param {string} token - the JSON web token for authorization
   * @returns {Promise<Object>} a promise that resolves with the API response
   */
  saveDiceObject: async (diceData, token) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST", // assuming POST handles both create and update for now
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // this handles authentication
      },
      body: JSON.stringify(diceData),
    });

    return handleApiResponse(response);
  },

  /**
   * Deletes a dice configuration object from the online database.
   * @param {string} diceObjectId - The ID of the object to delete.
   * @param {string} token - The JSON web token for authorization.
   * @returns {Promise<Object>} A promise that resolves with the API response (e.g., success message).
   */
  deleteDiceObject: async (diceObjectId, token) => {
    const response = await fetch(`${API_BASE_URL}/${diceObjectId}`, {
      method: "DELETE", // use the DELETE HTTP method
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); // endpoint includes the ID

    return handleApiResponse(response);
  },
};

export { localAdapter, apiAdapter };
