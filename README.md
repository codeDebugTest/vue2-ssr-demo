# hello-world
[中文文档](https://github.com/codeDebugTest/vue2-ssr-demo/blob/master/README.zh-cn.md)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
**then visit http://localhost:3000 for ssr development**

Take care:
*npm run serve* will start two services:
1. static service running by *npm run dev:client* command. It use to hot-reloads static resources
2. SSR service running by *npm run dev:server* command. this

others:
1. You can set static service port by setting env STATIC_PORT=xxxx on package.json's scripts。
2. If directly visit http://localhost:8090，then into the CSR mode. The html is not produced by SSR.

#### CSR mode for development
```sh
npm run dev:client
```

#### SSR local server for production
```sh
npm run build
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
*npm run build* command will execute two commands as shown below.
1. **npm run build:client** generate files for client render
2. **npm run build:server** generate files for server render

### Code lints

#### only lints

```sh
npm run lint
```

#### Lints and fixes
```
npm run lint:fix
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
