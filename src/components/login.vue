<template>
  <el-form
    :model="accountForm"
    status-icon
    :rules="rules"
    ref="accountForm"
    label-width="0px"
    class="demo-ruleForm login-container"
  >
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="accountForm.account" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="accountForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%">
      <el-button type="primary" style="width:40%" @click="submitForm('accountForm')">提交</el-button>
      <el-button style="width:40%" @click="resetForm('accountForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import API from '../api'
export default {
  data () {
    var validateAccount = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请保证账号长度不少于6位'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请保证密码长度不少于6位'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      accountForm: {
        account: '',
        password: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trriger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trriger: 'blur' },
          { validator: validateAccount, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      var $vm = this
      // 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.requestLogin({ username: $vm.accountForm.account, password: $vm.accountForm.password }).then(function (data) {
            let { msg, code, user } = data
            if (code !== 200) {
              $vm.$message({
                message: msg,
                type: 'error'
              })
            } else {
              sessionStorage.setItem('user', JSON.stringify(user))
              $vm.$router.push({ path: '/userInfo' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
//在style标签上添加scoped属性，以表示它的样式作用域当下的模块，很好的实现了样式私有化的目的。但在
//实际业务中往往会对公共组件样式做细微调整，如果添加了scoped属性，那么样式将会变得不易修改。
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
