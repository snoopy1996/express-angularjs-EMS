# express-angularjs-EMS
利用Express+MySQL+angularJs实现的简易管理系统
## 实现效果
暂无截图————

由于重装系统，数据库未做留存。 2018/7/30

## 简要说明

1. 登录认证。

  系统共有两种用户角色：admin和普通用户。
  
  admin可以对所有的部门、职位、员工进行增删改查操作，同时可以看到全部界面。
  
  普通用户登陆后，只能看到主页以及打开自己个人信息的页面。可以修改密码。

2. 数据库
  
  使用mysql作为主要数据库。设计认证相关的用户表以及业务相关的部门、员工、职位表。
  
3. 界面实现

  前端界面相关源码在 `/public/app` 文件夹内。
  
  前端使用angularJS开发，同时使用ui-router作为第三方库引入，组合各个界面。
  
  路由开启H5模式，后端做相应配合。
  
  ![](https://ws1.sinaimg.cn/large/0064OUUqly1ftrmvfeam1j30lh03u3yp.jpg)
  
  ![](https://ws1.sinaimg.cn/large/0064OUUqly1ftrmvx5o0rj30up0a2zlb.jpg)
  
  **为与API区分，所有API定义的路由中全有 api 字段**
  
  UI方面使用bootstrap作为主要风格。
  
  首页则引入Echarts 以及 百度地图 作为展示面板页面。
  
  Echarts做了一层指令封装。
  ![](https://ws1.sinaimg.cn/large/0064OUUqly1ftrmyowf77j30xo0lzwhr.jpg)

4. 后端实现

  使用Express作为主要开发框架，已`router`的定义引用作为API层开发。
  
  鉴于认证系统，以 `app.use('')`作为第一层处理，实现类似面向切面的编程，主要实现拦截认证功能，判断用户身份，是否有当前api的调用权限。
  
  ![](https://ws1.sinaimg.cn/large/0064OUUqly1ftrms8pp3sj30kc04ddge.jpg)
  
  鉴于NodeJS单线程稳定性问题，修改 `/bin/www`文件，利用`cluster`实现多线程启动,同时监控有线程退出，则2秒后重启。
  
  ![](https://ws1.sinaimg.cn/large/0064OUUqly1ftrmt18klgj31230m4q75.jpg)
  
  所有SQL语句，均定义在 `/db/dbAction/sbSql.js`中。
  
  ![](https://ws1.sinaimg.cn/large/0064OUUqly1ftrmqydporj313j0coq61.jpg)
