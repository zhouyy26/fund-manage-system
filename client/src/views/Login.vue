<template>
  <div class="login-wrap">
    <div class="box">
      <h1 class="title">在线后台管理系统</h1>
      <el-form
        class="form"
        :model="loginUser"
        :rules="rules"
        ref="loginForm"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="submit_btn" type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <div class="tip-box">
          <p class="right">还没有账号？现在<router-link to='/register'>注册</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
export default {
  name: 'myLogin',
  data() {
    return {
      loginUser: {
        email: '123@qq.com',
        password: '123123',
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/users/login', this.loginUser).then(res => {
            // 获取token并存储到localStorage
            const {token} = res.data;
            localStorage.setItem('token', res.data.token);

            // 解析token并存储到vuex
            const decode = jwtDecode(token);
            this.$store.dispatch('setAuthorization', !this.isEmpty(decode));
            this.$store.dispatch('setUser', decode);

            // 页面跳转到首页
            this.$router.push('/index');
          });
        }
      });
    },
    isEmpty(value) { // 判断value是否为空，空为ture,非空为false
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  },
};
</script>
