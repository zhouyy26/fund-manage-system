// 生产环境，process.env是服务器提供的全局变量，MONGO_URI和SECRET_OR_KEY需要到heroku官网设置
const key = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY
}