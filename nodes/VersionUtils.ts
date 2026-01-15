
import { execSync } from 'child_process';
import https from 'https';

/**
 * Returns latest n8n version from npm
 */
export function getLatestN8nVersion(): Promise<string> {
	return new Promise((resolve) => {
		try {
			https
				.get('https://registry.npmjs.org/n8n/latest', (res) => {
					let data = '';

					res.on('data', (chunk) => (data += chunk));
					res.on('end', () => {
						try {
							const parsed = JSON.parse(data);
							resolve(parsed.version ?? 'unknown');
						} catch {
							resolve('unknown');
						}
					});
				})
				.on('error', () => resolve('unknown'));
		} catch {
			resolve('unknown');
		}
	});
}

/**
 * Returns current installed n8n version
 */
export function getCurrentN8nVersion(): string {
	let currentVersion: string | undefined = process.env.N8N_VERSION;

	// ENV first
	if (!currentVersion) {
		try {
			const stdout = execSync('n8n --version').toString();
			if (stdout) {
				currentVersion = stdout.trim();
			}
		} catch {}
	}

	// ENV scan fallback
	if (!currentVersion) {
		const versionKey = Object.keys(process.env).find(
			(key) => key.includes('VERSION') && key.includes('N8N'),
		);
		if (versionKey) {
			currentVersion = process.env[versionKey];
		}
	}

	return currentVersion || 'unknown';
}

/**
 * Checks if the current version is the latest
 */
export async function checkIsLatest() {
	const currentVersion = getCurrentN8nVersion();
	const latestVersion = await getLatestN8nVersion();
	const isLatest =
		currentVersion !== 'unknown' &&
		latestVersion !== 'unknown' &&
		currentVersion === latestVersion;

	return {
		currentVersion,
		latestVersion,
		isLatest,
	};
}
