# Core Typeorm

[![npm version](https://badge.fury.io/js/@universal-packages%2Fcore-typeorm.svg)](https://www.npmjs.com/package/@universal-packages/core-typeorm)
[![Testing](https://github.com/universal-packages/universal-core-typeorm/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-core-typeorm/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-core-typeorm/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-core-typeorm)

[Typeorm](https://typeorm.io/) universal-core module abstraction.

## Install

```shell
npm install @universal-packages/core-typeorm
```

## Initialization

```shell
ucore initialize typeorm
```

## Global

Core expose `DataSource` as the global subject if core `modulesAsGlobals` config is true.

```js
typeormSubject.manager.find()
```

```js
core.coreModules.typeormModule.subject.manager.find()
```

## Typeorm cli

To execute any of the [Typeorm cli commands](https://orkhan.gitbook.io/typeorm/docs/using-cli) you can do it through the `typeorm`.

Instead of

```shell
npm run typeorm <command> <options>
```

Do

```shell
ucore exec typeorm <command> <options>
```

All commands will behave the same, except that the data source always will be set from the TypeormModule that gets the configuration through universal-core config system.

## Additional cli

### Crate DB

Creates the configured db using the right adapter. In non production environments it creates the analogous test dbs named `your-development-db-name-<test>-<cpu-#>`

```shell
ucore exec typeorm db:create
```

### Drop DB

Drops the configured db using the right adapter. In non production environments it drops the analogous test dbs named `your-development-db-name-<test>-<cpu-#>`

```shell
ucore exec typeorm db:drop
```

## Typescript
In order for typescript to see the global types you need to reference the types somewhere in your project, normally `./src/globals.d.ts`.

```ts
/// <reference types="@universal-packages/core-typeorm" />
```

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
