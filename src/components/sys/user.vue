<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            class="toolbar"
            style="padding-bottom:0px">
      <el-form :inline="true"
               :model="filters"
               class="demo-form-inline">
        <el-form-item>
          <el-input v-model="filters.name"
                    placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="searchUsers">查询</el-button>
          <el-button type="primary"
                     @click="onSubmit">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--用户列表-->
    <el-table stripe
              highlight-current-row="true"
              v-loading="listLoading"
              ref="multipleTable"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              :data="userList"
              style="width: 100%"
              :default-sort="{prop: 'userName', order: 'descending'}">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="50">
      </el-table-column>
      <el-table-column prop="userName"
                       label="姓名"
                       sortable
                       width="180">
      </el-table-column>
      <el-table-column prop="userId"
                       label="账号"
                       sortable
                       width="180">
      </el-table-column>
      <el-table-column prop="birthday"
                       label="出生日期"
                       sortable
                       width="220">
      </el-table-column>
      <el-table-column prop="address"
                       label="地址"
                       sortable
                       min-width="220">
      </el-table-column>
      <el-table-column label="操作"
                       width="220">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24"
            class="toolbar"
            style="padding-bottom:0px">
      <el-button type="danger"
                 @click="batchRemove"
                 :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination background
                     :current-page="pagination.page"
                     layout="prev, pager, next"
                     :page-size="pagination.size"
                     :total="pagination.length"
                     @current-change="handleCurrentChange"
                     style="float:right">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
import API from '../../api'
export default {
  data: function () {
    return {
      filters: {
        name: ''
      },
      listLoading: false,
      userList: [

      ],
      sels: [],
      multipleUserSelection: [],
      pagination: {
        size: 20,
        length: 0,
        page: 1
      }
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
      this.multipleUserSelection = val
    }
  },
  mounted () {
    this.loadUsers()
  }

}
</script>
