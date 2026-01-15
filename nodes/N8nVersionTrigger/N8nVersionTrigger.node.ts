
import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ITriggerResponse,
} from 'n8n-workflow';
import { CronJob } from 'cron';

import { checkIsLatest } from '../VersionUtils';

export class N8nVersionTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Version Trigger',
		name: 'versionTrigger',
		icon: 'file:n8n-version.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers workflow when installed n8n version is the latest',
		defaults: {
			name: 'Version Trigger',
		},
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Cron Expression',
				name: 'cronExpression',
				type: 'string',
				default: '0 * * * *',
				description: 'Cron expression for when to check for the version',
			},
			{
				displayName: 'Trigger on Latest Version',
				name: 'triggerOnLatest',
				type: 'boolean',
				default: false,
				description: 'Whether to trigger even if the installed version is already the latest',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const cronExpression = this.getNodeParameter('cronExpression') as string;

		const job = new CronJob(
			cronExpression,
			async () => {
				const { isLatest, currentVersion, latestVersion } = await checkIsLatest();
				const triggerOnLatest = this.getNodeParameter('triggerOnLatest') as boolean;

				if (!isLatest || (isLatest && triggerOnLatest)) {
					this.emit([
						[
							{
								json: {
									currentVersion,
									latestVersion,
									isLatest,
								},
							},
						],
					]);
				}
			},
			null,
			true,
		);

		async function closeFunction() {
			job.stop();
		}

		return {
			closeFunction,
		};
	}
}
