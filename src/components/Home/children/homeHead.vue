<template>
  <el-header>
    <div>
      <img src="~assets/web.png">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script>
  export default {
    name: "homeHead",
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
    },
  }
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }

    img {
      height: 60px;
    }
  }
</style>