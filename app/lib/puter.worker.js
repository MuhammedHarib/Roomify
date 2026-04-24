const PROJECT_PREFIX = "roomify_project";

const { puter } = require("@heyputer/puter.js");

const jsonError = (status, message, extra = {}) => {
    return new Response(JSON.stringify({ error: message, ...extra }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};

const jsonSuccess = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();
        return user?.uuid || user?.id || null;
    } catch {
        return null;
    }
};

// ─── POST /api/projects/save ─────────────────────────────────────────────────

router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if (!project?.id || !project?.sourceImage) return jsonError(400, 'Project not found');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        };

        const key = `${PROJECT_PREFIX}:${project.id}`;
        await userPuter.kv.set(key, JSON.stringify(payload));

        return jsonSuccess({ success: true, key });
    } catch (e) {
        return jsonError(500, 'Failed to save project', { message: e.message || 'Unknown error' });
    }
});

// ─── GET /api/projects/list ──────────────────────────────────────────────────

router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const keys = await userPuter.kv.list(`${PROJECT_PREFIX}:*`);

        if (!keys || keys.length === 0) return jsonSuccess({ projects: [] });

        const projects = await Promise.all(
            keys.map(async (keyEntry) => {
                try {
                    const raw = await userPuter.kv.get(keyEntry.key ?? keyEntry);
                    return raw ? JSON.parse(raw) : null;
                } catch {
                    return null;
                }
            })
        );

        const filtered = projects.filter(Boolean);

        return jsonSuccess({ projects: filtered });
    } catch (e) {
        return jsonError(500, 'Failed to list projects', { message: e.message || 'Unknown error' });
    }
});

// ─── GET /api/projects/get ───────────────────────────────────────────────────

router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonError(400, 'Missing project id');

        const key = `${PROJECT_PREFIX}:${id}`;
        const raw = await userPuter.kv.get(key);

        if (!raw) return jsonError(404, 'Project not found');

        const project = JSON.parse(raw);

        return jsonSuccess({ project });
    } catch (e) {
        return jsonError(500, 'Failed to get project', { message: e.message || 'Unknown error' });
    }
});