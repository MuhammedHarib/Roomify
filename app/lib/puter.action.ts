import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from './puter.hosting';
import { isHostedUrl
} from "./utils";

export const signIn = async () => await puter.auth.signIn();
export const signOut = async () => {
  await puter.auth.signOut();
};


export const  getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch (error) {

        return null;
        
    }
}


// In puter.action.ts
export const waitForPuter = (): Promise<void> => {
    return new Promise((resolve) => {
      if (puter.auth.isSignedIn()) return resolve();
      const interval = setInterval(() => {
        if (puter.auth.isSignedIn()) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
      // Timeout after 5s to avoid hanging forever
      setTimeout(() => { clearInterval(interval); resolve(); }, 5000);
    });
  };


export const createProject = async ({ item }: CreateProjectParams):
Promise<DesignItem | null | undefined> => {
  try {
    // Skip hosting upload — just return the item with base64 image directly
    // Hosting can be added later once the user session is confirmed stable
    const { sourcePath: _, renderedPath: __, publicPath: ___, ...rest } = item;

    const payload = {
      ...rest,
      sourceImage: item.sourceImage, // keep as base64
      renderedImage: item.renderedImage,
    };

    // Optionally persist to KV (non-blocking, don't await)
    puter.kv.set(`project:${item.id}`, JSON.stringify(payload)).catch(() => {});

    return payload;

  } catch (e) {
    console.error('Failed to save project', e);
    return null;
  }
};