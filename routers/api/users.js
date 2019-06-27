/**
 * 用于登录注册的api
 */
const express = require('express');
const bcrypt = require('bcrypt'); // 密码加密
const jwt = require('jsonwebtoken'); // 生成token
const passport = require('passport'); // 认证token请求
const gravatar = require('gravatar'); // 第三方头像库

const UserModel = require('../../models/User'); // 数据库模型
const confKey = require('../../config/keys'); // 密码配置

const router = express.Router(); // 创建可安装的模块化路由处理程序

/**
 * GET api/users/test  测试
 */
router.get('/test', (req, res) => {
  res.json({
    "msg": "hehe"
  });
});

/**
 * $route  POST api/users/register
 * @desc   return json
 * @access public
 */
router.post('/register', (req, res) => {
  // 查询数据库
  UserModel.findOne({
    email: req.body.email
  }).then(user => {
    // 邮箱被注册时，直接返回邮箱已被注册，不往下执行
    if (user) {
      return res.status(404).json('邮箱已被注册');
    }
    // 创造Entity
    const body = req.body;
    const avatar = gravatar.url(body.email, {s: '200', r: 'pg', d: 'mm'}); // 第三方头像
    const UserEntity = new UserModel({
      name: body.name,
      email: body.email,
      avatar,
      password: body.password,
      identity: body.identity
    });
    // 密码加密
    const saltRounds = 10; // 加密后的长度
    const password = UserEntity.password;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        // 加密失败时，报错  
        if (err) throw err;
        // 保存加密后的值，并通过实体保存数据库信息
        UserEntity.password = hash;
        UserEntity.save().then(result => {
          res.json(result)
        }).catch(err => {
          console.log(err)
        });
      });
    });
  });
});

/**
 * $route  POST api/users/login
 * @desc   return token
 * @access public
 */
router.post('/login', (req, res) => {
  const email = req.body.email;
  const PlaintextPassword = req.body.password; // 明文密码
  UserModel.findOne({ email }).then(user => {
    // 邮箱不存，结束代码
    if (!user) {
      return res.status(404).json('用户不存在');
    }
    // 密码匹配
    const hash = user.password; // hash密码
    bcrypt.compare(PlaintextPassword, hash).then(isMatch => {
      if (isMatch) { // 密码匹配成功
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          identity: user.identity,
          createDate: user.date
        } // 用户角色
        const secretOrKey = confKey.secretOrKey; // 密钥
        const expiresIn = { expiresIn: 3600 } // 有效期
        // 生成token
        jwt.sign(payload, secretOrKey, expiresIn, (err, token) => {
          if (err) throw err;
          res.json({
            msg: 'success',
            token: `Bearer ${token}` // 必须写Bearer ，否则token认证时匹配不上
          });
        });
      } else {
        return res.status(404).json('密码有误');
      }
    });
  });
});

/**
 * $route  GET api/users/current
 * @desc   return current user
 * @access private
 * router.get(api, 认证token, 认证成功的函数)
 */
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    identity: user.identity
  })
});

module.exports = router;