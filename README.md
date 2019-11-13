## 运行环境开发工具
1. 安装node（> 8.9）环境
2. 安装redis
3. 安装rabbitmq
     
## 项目配置
1. 更新config.default.js文件中的配置参数。 
2. 修改libs/activity.js中的业务逻辑。 
3. 启用穿透本地网络[具体参考钉钉开发文档]

## 项目运行
1. npm install
2. npm start
3. 通过registercallback注册回调
4. 通过send发送流程发起消息