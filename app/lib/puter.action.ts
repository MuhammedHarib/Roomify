import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from './puter.hosting';
import { isHostedUrl
} from "./utils";
import { PUTER_WORKER_URL } from "../../lib/constants";

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


  export const createProject = async ({ item, visibility = "private" }: CreateProjectParams):
  Promise<DesignItem | null | undefined> => {
  
    if (!PUTER_WORKER_URL) {
      console.warn('Missing VITE_PUTER_WORKER_URL; skipping history save.');
      return null;
    }
  
    const projectId = item.id;
  
    // ── 1. Upload images to hosting (non-blocking failures) ──────────────────
    let hosting: Awaited<ReturnType<typeof getOrCreateHostingConfig>> = null;
  
    try {
      hosting = await getOrCreateHostingConfig();
    } catch (e) {
      console.warn('getOrCreateHostingConfig failed:', e);
    }
  
    const hostedSource = hosting && projectId
      ? await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: 'source' }).catch(() => null)
      : null;
  
    const hostedRender = hosting && projectId && item.renderedImage
      ? await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: 'rendered' }).catch(() => null)
      : null;
  
    // ── 2. Resolve final image URLs ───────────────────────────────────────────
    const resolvedSource =
      hostedSource?.url ||
      (isHostedUrl(item.sourceImage) ? item.sourceImage : item.sourceImage); // fallback to base64
  
    if (!resolvedSource) {
      console.warn('No source image resolved, skipping save.');
      return null;
    }
  
    const resolvedRender = hostedRender?.url
      ? hostedRender.url
      : item.renderedImage && isHostedUrl(item.renderedImage)
        ? item.renderedImage
        : item.renderedImage ?? undefined; // fallback to base64 render if exists
  
    // ── 3. Build payload ──────────────────────────────────────────────────────
    const {
      sourcePath: _sourcePath,
      renderedPath: _renderedPath,
      publicPath: _publicPath,
      ...rest
    } = item;
  
    const payload: DesignItem = {
      ...rest,
      sourceImage: resolvedSource,
      renderedImage: resolvedRender,
    };
  
    // ── 4. Persist via Puter Worker ───────────────────────────────────────────
    try {
      const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
        method: 'POST',
        body: JSON.stringify({ project: payload, visibility })
      });
  
      if (!response.ok) {
        console.error('Worker failed to save project:', await response.text());
        // Still return payload so navigation works even if persistence failed
        return payload;
      }
  
      // Worker returns { success, key } — not { project }
      // so return the payload we built locally
      return payload;
  
    } catch (e) {
      console.error('Failed to save project via worker:', e);
      // Return payload as fallback so the user can still proceed
      return payload;
    }
  };


export const getProjects = async () => {


  if(!PUTER_WORKER_URL) {
      console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
      return []
  }

  try {
    const workerUrl = PUTER_WORKER_URL.trim().replace(/\/$/, '');
    const response = await puter.workers.exec(`${workerUrl}/api/projects/list`, { method: 'GET' });
      if(!response.ok) {
          console.error('Failed to fetch history', await response.text());
          return [];
      }

      const data = (await response.json()) as { projects?: DesignItem[] | null };
      return Array.isArray(data?.projects) ? data?.projects : [];
  } catch (e) {
      console.error('Failed to get projects', e);
      return [];
  }
}


export const getProjectById = async ({ id }: { id: string }) => {
  if (!PUTER_WORKER_URL) {
      console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
      return null;
  }

  console.log("Fetching project with ID:", id);

  try {
      const response = await puter.workers.exec(
          `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
          { method: "GET" },
          
      );

      console.log("Fetch project response:", response);

      if (!response.ok) {
          console.error("Failed to fetch project:", await response.text());
          return null;
      }

      const data = (await response.json()) as {
          project?: DesignItem | null;
      };

      console.log("Fetched project data:", data);

      return data?.project ?? null;
  } catch (error) {
      console.error("Failed to fetch project:", error);
      return null;
  }
};