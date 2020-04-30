<template>
  <el-container>
    <el-header>
      <el-col
        :span="4"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >{{collapsed?'':sysName}}</el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userInfo">
        <el-dropdown>
          <span class="el-dropdown-link userInfo-inner">
            <img :src="this.sysUserAvatar" />
            {{sysUserName}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-header>
    <el-container>
      <el-aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--侧边导航栏-->
        <!--default-active:当前激活菜单的 index-->
        <!--router:是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
        <el-menu :default-active="$route.path" unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf" :key="index">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf&&item.children.length>0"
              :index="item.children[0].path"
              :key="index"
            >
              <i :class="item.iconCls"></i>
              <span>{{item.name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$router.name}}</strong>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="item in $route.matched"
                :key="item.path"
                :to="{ path: item.path}"
              >{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </el-main>
      </el-container>
    </el-container>
    <el-footer>Footer</el-footer>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      sysName: '电子证书服务',
      collapsed: false,
      sysUserAvatar: 'http://159.226.28.4/uploadFile/userFile/90237803.jpg',
      sysUserName: '张大宝'
    }
  },
  methods: {
    // 退出登录
    logout: function () {
      var _this = this
      this.$confirm('确认退出吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        sessionStorage.removeItem('user')
        _this.router.push('/login')
      }).catch(() => {
      })
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    mounted () {
      var user = sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
        this.sysUserName = user.name || ''
        this.sysUserAvatar = user.avatar || ''
      }
    }

  }

}
</script>
<style scoped lang="scss">
@import "~scss_vars";

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

#app > .el-container {
  position: absolute;
  width: 100%;
  bottom: 0px;
  top: 0px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-container {
  .el-header {
    height: 60px;
    padding: 0px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userInfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userInfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .el-aside {
    flex: 0 0 230px;
    width: 230px;
    // position: absolute;
    // top: 0px;
    // bottom: 0px;
    .el-menu {
      height: 100%;
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }

    .collapsed {
      width: 60px;
      .item {
        position: relative;
      }
      .submenu {
        position: absolute;
        top: 0px;
        left: 60px;
        z-index: 99999;
        height: auto;
        display: none;
      }
    }
  }

  .el-main {
    //display: flex;
    // background: #324057;
    overflow: hidden;
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
