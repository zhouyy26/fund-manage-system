<template>
  <div class="menu-wrap">
    <el-menu :default-active="initIndex">
      <template v-for="(item, index) in menuList">
        <el-menu-item
          v-if="item.type === 'menu'"
          :key="item.path"
          :index="item.index"
          @click="toPath(item)"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
        <el-submenu v-else :key="item.path" :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item
            v-for="subitem in item.children"
            :index="subitem.index"
            @click="toPath(subitem)"
          >{{subitem.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'myMenu',
  data() {
    return {
      initIndex: '0',
      menuList: [
        {
          type: 'menu',
          icon: "el-icon-menu",
          name: '首页',
          path: 'home',
          index: '0'
        },
        {
          type: 'submenu',
          icon: "el-icon-s-order",
          name: '资金管理',
          path: 'fund',
          index: '1',
          children: [{name: '资金流水', path: 'fundStatement', index: '1-1'}]
        },
        {
          type: 'submenu',
          icon: "el-icon-s-tools",
          name: '信息管理',
          path: 'info',
          index: 2,
          children: [{name: '个人信息', path: 'personalInfo', index: '2-1'}]
        },
      ]
    }
  },
  created() {
    this.setInitIndex();
  },
  methods: {
    toPath(menu) {
      this.$router.push(menu.path);
      localStorage.menuIndex = menu.index;
    },
    setInitIndex() {
      this.initIndex = localStorage.menuIndex ? localStorage.menuIndex : '0';
    }
  }
}
</script>
