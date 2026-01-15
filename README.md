# n8n-version-node

> [!NOTE] > [n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.
>
> [Icon](https://icons8.com/icon/9sDRgODM0vNc/refresh) is from [icons8.com](https://icons8.com/)

## Features

- Pulling current installed version of local installed n8n
- Pulling the _latest_ version from the [n8n npm repo](https://www.npmjs.com/package/n8n?activeTab=readme)
- Optional Boolean if the current installed n8n version is the _latest_ release version.
- **[new]** Trigger Node that triggers a workflow when a new n8n version is available.

## Output

#### The latest version is installed

```json
[
  {
    "currentVersion": "2.3.5",
    "latestVersion": "2.3.5",
    "isLatest": true
  }
]
```

#### The latest version is not installed

```json
[
  {
    "currentVersion": "2.3.4",
    "latestVersion": "2.3.5",
    "isLatest": false
  }
]
```

## Version Trigger Node

The **Version Trigger** node allows you to schedule a recurring check (using Cron syntax) to see if a new n8n version is available.

- **Cron Expression**: Define how often to check (e.g., `0 * * * *` for every hour).
- **Default Behavior**: The workflow triggers **only** if your installed version is **older** than the latest version on npm.
- **Trigger on Latest Version**: If enabled, the workflow will trigger even if you are already up-to-date (useful for health checks or status reports).
