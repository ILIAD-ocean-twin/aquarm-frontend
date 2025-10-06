# Acuaculture Risk Metrics - ILIAD Pilot

This repository contains the source code for the frontend of the AquaRM pilot. It's a website created with solid-js and depends on the web-API provided by `iliad-pilot-server` and the WMS-server provided by `Acuaculture TC`.

## Env Files

For development (and production), you will need the environment files `env.development` and  `env.production`. In these files `VITE_API_URL` and `VITE_RAZZER_URL` must be defined.

## Usage, Bare Metal

The template dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Development

To run the app in development mode, do

```bash
$ npm run dev  # or pnpm run build
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### Building

To build the app for production (**without** Docker), do

```bash
$ npm run build  # or pnpm run build
```

This builds the app for production to the `dist` folder.

It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

### Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## Usage, Docker

### Build

```bash
$ docker buildx build --tag aquaculture-pilot .
```

### Run, Local Backend

```bash
$ docker run \
    --interactive \
    --tty \
    --env VITE_API_URL=http://localhost:5001/api \
    --env VITE_RAZZER_URL=http://localhost:5001/api \
    --publish 3000:3000 \
    aquaculture-pilot
```

or

```bash
$ docker run \
    --interactive \
    --tty \
    --env-file ./.env.development
    --publish 3000:3000 \
    aquaculture-pilot
```

### Run, Production Backend

```bash
$ docker run \
    --interactive \
    --tty \
    --env VITE_API_URL=https://aquaculture-demo.teinekroken.no \
    --env VITE_RAZZER_URL=https://aquaculture-demo.teinekroken.no/razzer \
    --publish 3000:3000 \
    aquaculture-pilot
```

or

```bash
$ docker run \
    --interactive \
    --tty \
    --env-file ./.env.production
    --publish 3000:3000 \
    aquaculture-pilot
```
