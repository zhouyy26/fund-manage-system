/**
 * 把登录注册数据存入数据库
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 定义数据库集合存储结构（数据库模型骨架）

// 定义Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true  // 是否必填
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  identity: { // 身份，管理员(admin)/员工(employe)
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now // date为创建时的时间
  },
});

// 生成Model，并定义集合名为Users，通过Users索引到数据库的集合
const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;