/**
 * 配置passport
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/User'); // 数据库模型
const mongoose = require('mongoose'); // 连接数据库
const User = mongoose.model('Users'); // 获取数据库里的user集合
const confKey = require('./keys'); // 数据库配置
const opts = {}; // 配置信息，是要拿到的token

// 用配置信息调用jwt请求来验证token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = confKey.secretOrKey;

//  passport是server.js里传递过来的
const handlePassport = passport => {
  passport.use(new JwtStrategy(opts, (payload, done) => { // payload是用户角色传进来的对象,done是回调
    User.findById(payload.id).then(user => {
      return user ? done(null, user) : done(null, false);
    }).catch(err => {
      console.log(err);
    });
  }));
}

module.exports = handlePassport;