# gradual

一个现代化前端开发模版

👏预览地址：[gradual-iota.vercel.app](https://gradual-iota.vercel.app/)

🛠️技术栈：

* 核心：Vue3 Vite TypeScript
* 预安装：Vue-Router Pinia Element-plus

## 🏃‍♂️‍➡️动机

* 简化前端开发流程
* 代码编译时校验、git约定提交
* 现代化、强大的项目结构用于生产

## ✨亮点

* 运行时工程文件按需引入Vue、Element-plus等常用API

* TypeScript（后续加入Zod）的类型校验

* 基于文件的路由

* 常用hooks集成（如果有需要还可安装VueUse）

  * ICON组件

* 常用组件封装

* axios 极致封装（尚未完成）

  - 将请求处理、响应处理、请求拦截器、请求错误拦截器、响应拦截器、响应错误拦截器统一封装成一个类 => axiosTransoform.ts

  - 将其他辅助函数，如：检查响应状态码，拼接时间戳，格式化时间，url params拼接等 => checkStatus.ts，helps.ts

  - 取消请求处理 => axiosCancel.ts

  - 整体导出的实例封装 => instance.ts

     注意：没有对需要token检验进行封装，因为这是一个模板，不一定需要用户鉴权，如需要则去axiosTransoform.ts去定义；如果在项目中觉得这个axios不需要封装， 删除文件夹即可。


## 任务列表

飞书文档▶️ [任务列表](https://o0ke9xr7eb.feishu.cn/sheets/JEifsQ7TNh9yR8tlahfcaafNnfd?from=from_copylink)
