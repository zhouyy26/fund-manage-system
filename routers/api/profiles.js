/**
 * 用于添加信息的api
 */
const express = require('express');
const passport = require('passport'); // 认证token请求
const ProfileModel = require('../../models/Profile'); // 数据库模型
const router = express.Router(); // 创建可安装的模块化路由处理程序

/**
 * GET api/profiles/test  测试
 */
router.get('/test', (req, res) => {
  res.json("profile works");
});

/**
 * $route  GET api/profiles
 * @desc   查询所有信息 
 * @access private
 */
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  ProfileModel.find().then(profile => {
    profile ? res.json(profile) : res.status(404).json('没有任何内容');
  }).catch(err => {
    res.status(404).json(err);
  });
});

/**
 * $route  GET api/profiles/:id
 * @desc   查询单个信息 
 * @access private
 */
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  ProfileModel.findOne({_id: req.params.id}).then(profile => {
    profile ? res.json(profile) : res.status(404).json('没有任何内容');
  }).catch(err => {
    res.status(404).json(err);
  });
});

/**
 * $route  POST api/profiles/insert
 * @desc   新增信息 
 * @access private
 */
router.post('/insert', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFields = req.body;
  new ProfileModel(profileFields).save().then(profile => {
    res.json(profile);
  }).catch(err => {
    res.status(404).json('新增失败');
  });
});

/**
 * $route  POST api/profiles/update
 * @desc   修改信息 
 * @access private
 */
router.post('/update/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFields = req.body;
  ProfileModel.findOneAndUpdate(
    { _id: req.params.id }, // 查询需要修改的数据
    { $set: profileFields }, // 更新数据
    { new: true } // true为返回更新后的数据，false为返回原始数据
  ).then(profile => {
    profile ? res.json(profile) : res.status(404).json('修改失败');
  }).catch(err => {
    res.status(404).json(err);
  });
});

/**
 * $route  DELETE api/profiles/delete
 * @desc   删除信息 
 * @access private
 */
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  ProfileModel.findOneAndRemove({_id: req.params.id}).then(profile => {
    profile ? res.json(profile) : res.status(404).json('删除失败');
  }).catch(err => {
    res.status(404).json(err);
  });
});

module.exports = router;