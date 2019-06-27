<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
export default {
  name: 'app',
  created() {
    this.setStore();
  },
  methods: {
    setStore() {
    const decode = jwtDecode(localStorage.token);
    this.$store.dispatch('setAuthorization', !this.isEmpty(decode));
    this.$store.dispatch('setUser', decode);
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      );
    }
  }
};
</script>

<style lang="scss">
  @import "@/assets/scss/main.scss";
</style>
