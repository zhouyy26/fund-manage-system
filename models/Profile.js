/**
 * 把操作的数据存入数据库
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 数据库模型骨架

// 定义Schema
const ProfileSchema = new Schema({
  type: { // 类型
    type: String,
    required: true
  },
  describe: { // 描述
    type: String
  },
  income: { // 收入
    type: String,
    required: true
  },
  expend: { // 支出 
    type: String,
    required: true
  },
  cash: { // 现金
    type: String,
    required: true
  },
  remark: { // 备注
    type: String
  },
  date: {
    type: Date,
    default: Date.now // date为创建时的时间
  },
});

// 生成Model，并定义集合名为Users，通过Profiles索引到数据库的集合
const ProfileModel = mongoose.model('Profiles', ProfileSchema);

module.exports = ProfileModel;