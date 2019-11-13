## 项目指南
1. 钉钉开放了丰富的服务端接口能力，开发者可以借助这些接口能力，实现企业系统与钉钉的集成打通
2. [钉钉服务端API](https://ding-doc.dingtalk.com/doc#/serverapi2/gh60vz)

## 运行环境
1. 安装node（> 8.9）环境
2. 安装redis
3. 安装rabbitmq
     
## 项目配置
1. 修改config.default.js中的配置参数。 
2. 按需修改libs/activity.js中的业务逻辑。 
3. [启用内网穿透](https://ding-doc.dingtalk.com/doc#/kn6zg7/hb7000)

## 项目运行
1. npm install
2. npm start
3. 通过调用registercallback注册回调
4. 通过调用send发送流程发起消息
