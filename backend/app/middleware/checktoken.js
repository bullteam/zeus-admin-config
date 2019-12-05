// eslint-disable-next-line strict
const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = () => {

  return async function(ctx, next) {
    if (ctx.request.header.authorization) {
      const token = ctx.request.header.authorization.split(' ')[1];
      // 解码token
      let decoded = '';
      try {
        const cert = fs.readFileSync('./config/key/jwt_public_key.pem')
        decoded = jwt.verify(token, cert, { algorithms: [ 'RS256' ] });
      } catch (error) {
        ctx.status = 401;
        ctx.body = {
          message: '用户信息失效，请重新登录',
        };
        return;
      }
      console.log(decoded);
      // 重置cookie时间
      ctx.cookies.set('token', token, {
        maxAge: 60 * 1000,
        httpOnly: false,
        overwrite: true,
        signed: false,
      });
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
