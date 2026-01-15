# n8n-version-node

> [!NOTE] > [n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.
> [Icon](https://icons8.com/icon/9sDRgODM0vNc/refresh) is from [icons8.com](https://icons8.com/)

## Features

- Pulling current installed version of local installed n8n
- Pulling the newest _latest_ version from the [n8n npm repo](https://www.npmjs.com/package/n8n?activeTab=readme)
- Boolean if the current installed n8n version is the newest _latest_ release version.

## Output

#### The newest version is installed

```json
[
  {
    "currentVersion": "2.3.5",
    "latestVersion": "2.3.5",
    "isLatest": true
  }
]
```

#### The newest version is not installed

```json
[
  {
    "currentVersion": "2.3.4",
    "latestVersion": "2.3.5",
    "isLatest": false
  }
]
```
