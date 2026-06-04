# DNSNeko Dashboard

DNSNeko DNS 管理 API 的 Web 操作面板，支持域名管理、DNS 记录增删改查、批量操作等功能。

## 在线演示

- 面板地址：https://lo.os.kg
- API 代理：https://dns.liw.cc.cd

## 项目结构

```
├── index.html          # 前端管理面板（纯静态页面）
└── worker/
    ├── worker.js       # Cloudflare Worker CORS 代理
    └── wrangler.toml   # Worker 部署配置
```

## 功能

- 🔑 API 认证（用户名 + API Key）
- 📋 域名列表查看与详情
- 📝 DNS 记录管理（添加 / 编辑 / 删除）
- 🔄 记录状态切换（启用 / 暂停）
- 🔍 按类型、关键词筛选记录
- 📦 批量操作（启用、暂停、删除、修改 TTL、修改线路）
- 📄 分页支持

## 部署指南

### 1. 部署 Cloudflare Worker（CORS 代理）

前端直接调用 DNSNeko API 会遇到 CORS 跨域限制，需要通过 Cloudflare Worker 作为代理转发请求。

#### 前置条件

- 一个 Cloudflare 账户
- 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

#### 步骤

```bash
# 1. 进入 worker 目录
cd worker

# 2. 登录 Cloudflare
wrangler login

# 3. 修改 wrangler.toml 中的路由配置（可选）
# 如果你有自己的域名托管在 Cloudflare，修改 routes 中的 pattern 和 zone_name
# 如果不需要自定义域名，删除 routes 部分即可使用默认的 workers.dev 域名

# 4. 部署
wrangler deploy
```

部署成功后，Worker 会获得一个地址：
- 默认地址：`https://<worker-name>.<your-subdomain>.workers.dev`
- 自定义域名：需在 Cloudflare DNS 中添加一条 Proxied 的 A 记录指向任意 IP（如 `192.0.2.1`），流量会被 Worker Route 拦截

### 2. 部署前端页面（GitHub Pages）

#### 方式一：GitHub Pages（推荐）

```bash
# 1. Fork 或 clone 本仓库
git clone https://github.com/lyrhub/dnsneko-dashboard.git
cd dnsneko-dashboard

# 2. 修改 index.html 中的 API_PROXY 地址为你的 Worker 地址
# 找到这一行并修改：
# const API_PROXY = 'https://dns.liw.cc.cd/proxy';
# 改为你的 Worker 地址，如：
# const API_PROXY = 'https://your-worker.your-subdomain.workers.dev/proxy';

# 3. 推送到 GitHub
git add -A
git commit -m "update proxy url"
git push

# 4. 在 GitHub 仓库 Settings → Pages 中：
#    - Source: Deploy from a branch
#    - Branch: master / (root)
#    - 保存后等待构建完成
```

#### 方式二：直接使用

`index.html` 是纯静态文件，可以部署到任何静态托管服务：

- Cloudflare Pages
- Vercel
- Netlify
- 或直接双击用浏览器打开

### 3. 绑定自定义域名（可选）

如果你想给 GitHub Pages 绑定自定义域名：

```bash
# 1. 在 DNS 服务商（如 DNSNeko）添加 CNAME 记录
# 名称: @（或子域名）
# 类型: CNAME
# 值: <your-github-username>.github.io

# 2. 在 GitHub 仓库 Settings → Pages → Custom domain 中填入你的域名
```

## API 文档

本项目基于 [DNSNeko API](https://www.dnsneko.com) 构建，支持的接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/domains` | GET | 获取域名列表 |
| `/domains/{id}` | GET | 获取域名详情 |
| `/records` | GET | 查询 DNS 记录 |
| `/records/{domainId}` | POST | 添加 DNS 记录 |
| `/records/{domainId}/{recordId}` | PUT | 修改 DNS 记录 |
| `/records/{domainId}/{recordId}` | DELETE | 删除 DNS 记录 |
| `/records/{recordId}/status` | POST | 启用/暂停记录 |
| `/records/batch/status` | POST | 批量启用/暂停 |
| `/records/batch/delete` | POST | 批量删除 |
| `/records/batch/ttl` | POST | 批量修改 TTL |
| `/records/batch/line` | POST | 批量修改线路 |

## 注意事项

- API 认证信息保存在浏览器 localStorage 中，仅存储在本地
- Worker 代理不会记录或存储任何 API Key
- 建议使用 HTTPS 访问确保传输安全

## License

MIT
