<template>
  <div class="index-wrap">
    <my-headNav/>
    <my-sideMenu/>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import myHeadNav from '../components/HeadNav';
import mySideMenu from '../components/SideMenu';
export default {
  name: 'myIndex',
  components: {
    myHeadNav,
    mySideMenu,
  }
}
</script>