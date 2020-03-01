<template>
  <el-container class="home-container">
    <home-head/>
      <el-container>
        <el-aside :width="isCollapsed ? '64px': '200px'">
          <div class="toggle-button" @click="toggleClick">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="isCollapsed"
            :collapse-transition="false"
            router
            :default-active="activePath">
            <el-submenu :index="item.id+''" v-for="item in menulists" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNavState('/'+subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

  </el-container>
</template>

<script>
  import homeHead from './children/homeHead'

  export default {
    name: "Home",
    data() {
      return {
        menulists: [],
        iconObj: {
          '125': "iconfont icon-user",
          '103': "iconfont icon-tijikongjian",
          '101': "iconfont icon-shangpin",
          '102': "iconfont icon-danju",
          '145': "iconfont icon-baobiao"
        },
        isCollapsed: false,
        activePath: ''
      }
    },
    components: {
      homeHead
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      async getMenuList() {
        const {data: res} = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulists = res.data
      },
      toggleClick() {
        this.isCollapsed = !this.isCollapsed
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
  }
</style>