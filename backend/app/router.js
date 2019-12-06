'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app; // 获取app中的router对象和controller
  const authorize = app.middleware.checktoken(); // 登陆验证参数
  const checkperm = app.middleware.checkperm(); // 登陆验证参数

  router.get('/', controller.home.index);
  router.get('/configlist/list', authorize, checkperm, controller.home.index);
  router.get('/configlist/list2', authorize, checkperm, controller.home.index);
};
