'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app; // 获取app中的router对象和controller
  router.get('/', controller.home.index);
};
