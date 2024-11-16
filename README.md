# Vue前台模板

使用vite做了以下集成：

✅自动引入组件库组件 element-plus

✅unplugin-vue-router自动引入路由

🔨使用iconfiy对icon组件封装

🔨极致封装axios

* 将请求处理、响应处理、请求拦截器、请求错误拦截器、响应拦截器、响应错误拦截器统一封装成一个类 => axiosTransoform.ts
* 将其他辅助函数，如：检查响应状态码，拼接时间戳，格式化时间，url params拼接等 => checkStatus.ts，helps.ts
* 取消请求处理 => axiosCancel.ts
* 整体导出的实例封装 => instance.ts

​	注意：没有对需要token检验进行封装，因为这是一个模板，不一定需要用户鉴权，如需要则去axiosTransoform.ts去定义；如果在项目中觉得这个axios不需要封装，	删除文件夹即可。

🔨简单的代码校验规范 EsLint + Prettier

`TODO`:

▶️ [任务列表](https://o0ke9xr7eb.feishu.cn/sheets/JEifsQ7TNh9yR8tlahfcaafNnfd?from=from_copylink)
