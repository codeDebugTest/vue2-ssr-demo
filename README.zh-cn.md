# hello-world

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
