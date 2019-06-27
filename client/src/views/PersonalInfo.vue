<template>
  <el-row class="personal-info-wrap">
    <el-col class="user-avatar" :span="8">
      <img class="avatar" :src="user.avatar" alt="头像">
    </el-col>
    <el-col class="user-info" :span="14">
      <div class="user-item name">
        <i class="icon el-icon-user-solid"></i>
        <span>{{user.name}}</span>
      </div>
      <div class="user-item identity">
        <i class="icon el-icon-s-tools"></i>
        <span>{{user.identity === 'manage' ? '管理员' : '普通员工'}}</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'myInfoShow',
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
}
</script>