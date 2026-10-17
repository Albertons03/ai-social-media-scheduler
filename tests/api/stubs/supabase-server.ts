import { getState } from "./state.ts";

export async function createClient() {
  return {
    auth: {
      getUser: async () => {
        const userId = getState().userId;
        return { data: { user: userId ? { id: userId } : null } };
      },
    },
  };
}
