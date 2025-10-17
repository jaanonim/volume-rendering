import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
    if (command === "build") {
        const env = loadEnv(mode, process.cwd(), "");
        return {
            base: env.BASE_URL,
        };
    }
    return {};
});
