// the system that figures out which database the application should be using
import { useState, useEffect, useCallback } from "react";
import { localAdapter, apiAdapter } from "../services/storageService";
import { useAuth } from "../context/AuthContext"; // provides { user, token }

export const useDiceManager = () => {
  const { user, token } = useAuth(); // get authentication status
  const [diceObjects, setDiceObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. The Switchboard
  // This variable changes reference whenever 'user' changes.
  const storageDriver = user ? apiAdapter : localAdapter;

  // --- Read: Load initial data ---
  // 2. The Logic (Freezer)
  // We wrap this in useCallback. It only re-creates this function if
  // storageDriver or token changes. This prevents stale data bugs.
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Because this function re-creates when driver changes,
      // 'storageDriver' is guaranteed to be the correct one (API vs Local).
      const data = await storageDriver.getDiceObjects(token);
      setDiceObjects(data);
    } catch (error) {
      console.error("Failed to load dice objects:", error);
      setDiceObjects([]); // clear data on failure
    } finally {
      setLoading(false);
    }
  }, [storageDriver, token]); // dependency array for useCallback

  // 3. The Trigger
  // When the 'loadData' function changes (because driver changed), run it.
  useEffect(() => {
    loadData();
  }, [loadData]); // dependency is now the stable loadData function

  // ---Create/Update: Save or Update Dice Object ---
  const saveDiceObject = async (diceObject) => {
    // 1. no optimistic user interface update here. we wait for the database

    try {
      // 2. wait for the database to finish saving
      const savedResult = await storageDriver.saveDiceObject(diceObject, token);

      // 3. update the user interface based on what came back
      if (Array.isArray(savedResult)) {
        // the localAdapter returns the *entire* list, so just set it
        setDiceObjects(savedResult);
      } else {
        // the apiAdapter returns just the *single* saved object
        // so we manually swap it into our existing list
        setDiceObjects((previous) => {
          // check if we are updating the existing item
          const exists = previous.some((d) => d.id === savedResult.id);

          if (exists) {
            // update: swap old with new at same position
            return previous.map((d) =>
              d.id === savedResult.id ? savedResult : d,
            );
          } else {
            // create: add to end
            return [...previous, savedResult];
          }
        });
      }
    } catch (error) {
      console.error("Failed to save dice object:", error);
      alert("error saving dice. please try again");
    }
  };

  // --Delete: Delete Dice Object ---
  const deleteDiceObject = async (diceObjectId) => {
    // 1. no optimistic user interface update here, we'll wait for the database

    try {
      // 2. wait for the database to confirm deletion
      const result = await storageDriver.deleteDiceObject(diceObjectId, token);

      // 3. update the user interface
      if (Array.isArray(result)) {
        // localAdapter returns the new list
        setDiceObjects(result);
      } else {
        // apiAdapter returns a success message (or empty), so we filter manually using the ID we sent
        setDiceObjects((previous) => {
          return previous.filter((d) => d.id !== diceObjectId);
        });
      }
    } catch (error) {
      console.error("failed to delete dice object:", error);
      alert("error deleting dice. please try again");
    }
  };

  // expose the necessary state and functions to the ManageDice component
  return {
    diceObjects,
    loading,
    saveDiceObject, // the create/update function
    deleteDiceObject, // the delete function
    loadData, // exposed for manual refresh if needed
  };
};
