# Electron sample

## Dependencies

```bash
npm install
```

## Build

```bash
npm run build
```

## Auth

```bash
npm run connect
```

Provide auth options for SPO site.

Auth options are stored in `../config/private.addin.json`

See more [here](https://github.com/koltyakov/node-sp-auth-config).

## Run

```bash
npm run start
```

Should start the Electron app with a browser window authenticated to SharePoint with [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth).