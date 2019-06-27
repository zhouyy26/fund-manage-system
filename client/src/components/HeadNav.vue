<template>
  <el-row class="topbar-wrap" justify="space-between">
    <el-col class="logo-box" :span="14">
      <img class="logo" src="../assets/img/logo.png" alt="logo">
      <span class="title">在线后台管理系统</span>
    </el-col>
    <el-col class="user-box" :span="10">
      <el-dropdown class="dropdown" trigger="click" @command="handleCommand">
        <div class="el-dropdown-link">
          <img class="avatar" :src="user.avatar" alt="头像">
          <span class="name">{{user.name}}</span>
          <i class="icon el-icon-caret-bottom el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'myTapbar',
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'info':
          this.info();
          break;
        case 'logout':
          this.logout();
          break;
      }
    },
    info() {
      this.$router.push('/personalInfo');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('menuIndex');
      this.$router.push('/login');
      this.$store.dispatch('setAuthorization', false);
      this.$store.dispatch('setUser', {});
    }
  }
}
</script>