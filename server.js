const Express = require('express'); // 开启服务
const mongoose = require('mongoose'); // 连接数据库
const bodyParser = require('body-parser'); // router的post请求
const passport = require('passport'); // 验证token请求

const confKey = require('./config/keys'); // 配置key
const configPassport = require('./config/passport'); // 配置token
const routerUsers = require('./routers/api/users'); // 登录注册api
const routerProfiles = require('./routers/api/profiles'); // api

const app = new Express();
const port = process.env.PORT || 5001; // 设置端口

// 连接数据库
mongoose.connect(confKey.mongoURI, {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB Connected')
}).catch(err => {
  console.log(err);
});

// 使用bodyParser的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// passport初始化，并把passport传入配置文件里
app.use(passport.initialize());
configPassport(passport);

// 使用router访问api
app.use('/api/users', routerUsers);
app.use('/api/profiles', routerProfiles);


// 开启服务，监听端口
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});