import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Required for path resolution

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'), // Must match tsconfig's "@/*"
		},
	},
});
