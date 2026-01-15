import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { execSync } from 'child_process';
import https from 'https';

/**
 * Helper outside the class – n8n-safe
 */
function getLatestN8nVersion(): Promise<string> {
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

export class N8nVersion implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Version Controller',
		name: 'versionController',
		icon: 'file:n8n-version.svg',
		group: ['transform'],
		version: 1,
		description: 'Outputs current and latest n8n version',
		defaults: {
			name: 'Version Controller',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Returns if Latest',
				name: 'returnIsLatest',
				type: 'boolean',
				default: true,
				description: 'Whether to return if the current version is the latest',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

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

		if (!currentVersion) {
			currentVersion = 'unknown';
		}

		const returnIsLatest = this.getNodeParameter('returnIsLatest', 0) as boolean;
		let latestVersion: string | undefined;
		let isLatest: boolean | undefined;

		if (returnIsLatest) {
			latestVersion = await getLatestN8nVersion();

			isLatest =
				currentVersion !== 'unknown' &&
				latestVersion !== 'unknown' &&
				currentVersion === latestVersion;
		}

		for (let i = 0; i < items.length; i++) {
			const json: { [key: string]: any } = {
				currentVersion,
			};

			if (returnIsLatest) {
				json.latestVersion = latestVersion;
				json.isLatest = isLatest;
			}

			returnData.push({
				json,
			});
		}

		return [returnData];
	}
}