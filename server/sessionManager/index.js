import { getIronSession } from "iron-session";

// Due to cookie limits store the minimum items that need to be persistent.
const keysInCookie = ["refresh_token", "ac-state-key"];
let memorySession = {};

async function ironSessionManager(req, res, options) {
  const session = await getIronSession(req, res, options);

  const getSession = (key) => {
    return keysInCookie.includes(key) ? session : memorySession;
  };

  return {
    getSessionItem: async (itemKey) => {
      return getSession(itemKey)[itemKey];
    },
    setSessionItem: async (itemKey, itemValue) => {
      console.log({ itemKey, itemValue });
      getSession(itemKey)[itemKey] = itemValue;
      if (keysInCookie.includes(itemKey)) {
        await session.save();
      }
    },
    removeSessionItem: async (itemKey) => {
      delete getSession(itemKey)[itemKey];

      if (keysInCookie.includes(itemKey)) {
        await session.save();
      }
    },
    destroySession: async () => {
      session.destroy();
      memorySession = {};
    },
  };
}

const ironSessionOptions = {
  cookieName: "kindeAuth",
  password: "123456789876543211234567899876543",
};

export { ironSessionOptions, ironSessionManager };
