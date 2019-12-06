// eslint-disable-next-line strict
module.exports = () => {

  return async function(ctx, next) {
    if (ctx.request.header.authorization) {
      const token = ctx.request.header.authorization.split(' ')[1];
      const result = await ctx.curl('http://api.auth.bullteam.cn/v1/user/perm/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: { domain: 'zeus-config', perm: ctx.request.url },
      });
      if (JSON.parse(result.data).data.result !== true) {
        ctx.status = 401;
        ctx.body = {
          message: '你没有权限访问！',
        };
        return;
      }
      await next();
    } else {
      ctx.status = 401;
      ctx.body = {
        message: '请重新登录',
      };
      return;
    }
  };
};
