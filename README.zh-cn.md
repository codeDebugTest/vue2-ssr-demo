# hello-world

### 动机
鉴于vue-ssr 官网例子 https://github.com/vuejs/vue-hackernews-2.0/ 
1. too old
2. too slow，通过webpack 打包，非vue-cli
3. unused github 上好多通过vue-cli的项目跑不起来
4. not compatible 不兼容 CSR模式

通过此项目你可以快速开始一个更具现代化地 vue-ssr 项目。

#### 好处
1. 支持vue-cli4
2. 向下兼容：支持CSR(客户端渲染)模式


### 安装
```sh
npm install
```

### 本地开发

#### development ssr 模式
```sh
npm run serve
```
npm run serve 会启动两个服务：
1. npm run dev:client 静态资源服务（默认8090端口），用于供服务端渲染时hot-update 静态资源
2. npm run dev:server 服务端渲染（3000端口），真正的访问入口，该服务会将静态资源的访问代理到上面的静态资源服务

启动后，访问 http://localhost:3000 。dev模式带有hot-reload 的 服务端渲染。

其他：
1. 设置静态服务端口，通过设置环境变量 STATIC_PORT=xxxx 进行控制。
2. 若访问 http://localhost:8090 则走本地CSR模式，此时浏览器拿到的结果均为不经过SSR产出的结果

#### development csr 模式
```sh
npm run dev:client
```
本地开发，但不启用SSR服务端渲染

#### production ssr 模式
```sh
npm run build
npm run serve
```
启动后，访问 http://localhost:3000 。线上ssr Server 模拟

### 构建

```sh
npm run build
```
1. npm run build:client 编译生成ssr 生成客户端渲染所需内容
2. npm run build:server 编译生成ssr 生成服务端渲染所需内容

### 代码检查

#### 仅检查

```sh
npm run lint
```

#### 检查并修复

```sh
npm run lint:fix
```

## [搭建指南](https://github.com/codeDebugTest/blog/issues/4)
