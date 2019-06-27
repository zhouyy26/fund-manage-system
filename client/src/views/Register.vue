<template>
  <div class="login-wrap">
    <div class="box">
      <h1 class="title">在线后台管理系统</h1>
      <el-form
        class="form"
        :model="registerUser"
        :rules="rules"
        ref="registerForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerUser.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerUser.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="registerUser.password2" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="选择身份" prop="identity">
          <el-select v-model="registerUser.identity" placeholder="请选择身份">
            <el-option label="员工" value="employee"></el-option>
            <el-option label="管理员" value="manage"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="submit_btn" type="primary" @click="submitForm('registerForm')">提交</el-button>
        </el-form-item>
        <div class="tip-box">
          <p class="right">已有账号？去<router-link to='/login'>登录</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myRegister',
  components: {},
  data() {
    var validatePassword2 = (rule, value, callback) => {
      value !== this.registerUser.password ? callback(new Error('两次输入密码不一致!')) : callback();
    };
    return {
      registerUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        identity: ''
      },
      rules: { // 表单验证规则,validator对表单校验的方法
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validatePassword2 }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/users/register', this.registerUser).then(res => {
            this.$message.success('恭喜你，账号注册成功！');
            this.$router.push('/login');
          });
        }
      });
    }
  },
};
</script>

