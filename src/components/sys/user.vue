<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom:0px">
      <el-form :inline="true" :model="filters" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUsers">查询</el-button>
          <el-button type="primary" @click="handleEdit">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--用户列表-->
    <el-table
      stripe
      highlight-current-row="true"
      v-loading="listLoading"
      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      :data="userList"
      :default-sort="{prop: 'userName', order: 'descending'}"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="userName" label="姓名" sortable width="120"></el-table-column>
      <el-table-column prop="userId" label="账号" sortable width="200"></el-table-column>
      <el-table-column prop="birthday" label="出生日期" sortable width="180"></el-table-column>
      <el-table-column prop="address" label="地址" sortable min-width="180"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="padding-bottom:0px">
      <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        background
        :current-page="pagination.page"
        layout="prev, pager, next"
        :page-size="pagination.size"
        :total="pagination.length"
        @current-change="handleCurrentChange"
        style="float:right"
      ></el-pagination>
    </el-col>

    <el-dialog title="用户信息编辑" :visible.sync="userEditorFormVisible">
      <el-form
        :model="userEditorForm"
        label-width="80px"
        :rules="userEditorRules"
        ref="userEditorForm"
      >
        <el-form-item label="姓名">
          <el-input v-model="userEditorForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="userEditorForm.userId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="userEditorForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" v-model="userEditorForm.birthday" autocomplete="off"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userEditorFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserEdit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import API from '../../api'
export default {
  data: function () {
    var validateUserId = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请保证账号长度不少于6位'))
      } else {
        callback()
      }
    }
    var validateUserName = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('请保证姓名不少于2位'))
      } else {
        callback()
      }
    }
    return {
      filters: {
        name: ''
      },
      listLoading: false,
      userList: [

      ],
      sels: [],
      pagination: {
        size: 20,
        length: 0,
        page: 1
      },
      userEditorFormVisible: false,
      userEditorForm: {
        id: '',
        userName: '',
        userId: '',
        address: '',
        birthday: ''
      },
      userEditorRules: {
        userName: [
          { required: true, message: '请输入姓名', trriger: 'blur' },
          { validator: validateUserName, trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请输入账号', trriger: 'blur' },
          { validator: validateUserId, trigger: 'blur' }
        ]
      },
      editLoading: false
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.pagination.page = page
      this.loadUsers()
    },
    searchUsers () {
      this.pagination.page = 1
      this.loadUsers()
    },
    loadUsers () {
      let params = this.pagination
      params.name = this.filters.name
      this.listLoading = true
      API.userListPage(params).then((res) => {
        this.pagination.length = res.data.total
        this.userList = res.data.users
        this.listLoading = false
      })
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.sels = val
    },

    handleEdit (index, row) {
      this.userEditorForm = Object.assign({}, row)
      this.userEditorFormVisible = true
    },
    handleDelete (index, row) {
      this.$confirm('确定删除人员信息吗?', '系统提示', {
        type: 'warning'
      }).then(() => {
        API.userRemove({ id: row.id }).then(data => {
          let { msg, code } = data

          if (code !== 200) {
            this.$message({
              message: msg,
              type: 'error'
            })
          } else {
            this.loadUsers()
            this.$message({
              message: msg,
              type: 'success'
            })
          }
        })
      })
    },
    batchDelete () {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确定批量删除人员信息吗?', '系统提示', {
        type: 'warning'
      }).then(() => {
        API.userBatchRemove({ id: ids }).then(data => {
          let { msg, code } = data

          if (code !== 200) {
            this.$message({
              message: msg,
              type: 'error'
            })
          } else {
            this.loadUsers()
            this.$message({
              message: msg,
              type: 'success'
            })
          }
        })
      }
      )
    },
    submitUserEdit () {
      this.$refs.userEditorForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.listLoading = true
            API.userEdit(this.userEditorForm).then(data => {
              let { msg, code } = data
              this.listLoading = false
              this.userEditorFormVisible = false
              this.$refs.userEditorForm.resetFields()
              this.loadUsers()
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                })
              } else {
                this.$message({
                  message: msg,
                  type: 'success'
                })
              }
            })
          })
        }
      })
    }
  },
  mounted () {
    this.loadUsers()
  }

}
</script>
