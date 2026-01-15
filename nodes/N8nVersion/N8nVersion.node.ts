import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { checkIsLatest, getCurrentN8nVersion, getLatestN8nVersion } from '../VersionUtils';

export class N8nVersion implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Version Checker',
		name: 'versionChecker',
		icon: 'file:n8n-version.svg',
		group: ['transform'],
		version: 1,
		description: 'Outputs current and latest n8n version',
		defaults: {
			name: 'Version Checker',
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

		const returnIsLatest = this.getNodeParameter('returnIsLatest', 0) as boolean;
		
		let currentVersion = getCurrentN8nVersion();
		let latestVersion: string | undefined;
		let isLatest: boolean | undefined;

		if (returnIsLatest) {
			const versions = await checkIsLatest();
			currentVersion = versions.currentVersion;
			latestVersion = versions.latestVersion;
			isLatest = versions.isLatest;
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