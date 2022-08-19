# Core Typeorm

[![npm version](https://badge.fury.io/js/@universal-packages%2Fcore-typeorm.svg)](https://www.npmjs.com/package/@universal-packages/core-typeorm)
[![Testing](https://github.com/universal-packages/universal-core-typeorm/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-core-typeorm/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-core-typeorm/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-core-typeorm)

[Typeorm](https://typeorm.io/) universal-core module abstraction.

## Install

```shell
npm install @universal-packages/core-typeorm
```

## Typeorm cli
To execute any of the [Typeorm cli commands](https://orkhan.gitbook.io/typeorm/docs/using-cli#log-sync-database-schema-queries-without-actual-running-them) you can do it through the `typeorm-task`.

Instead of
```shell
npm run typeorm <command> <options>
```

Do
```shell
ucore exec typeorm-task <command> <options>
```

All comand will behave the same, except that the data source always will be set from the TypeormModule that gest the configuration through universal-core config system.

Also the `init` will only pupulate your current project with the typeorm template.
After 

## Accessing DataSource
The TypeormModule will be normally available as a global variable, you can access the data source from there.

```js
typeormModule.dataSource
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).



