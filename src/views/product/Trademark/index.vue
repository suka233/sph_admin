<template>
  <div>
    <el-button type="primary" icon="">添加</el-button>

    <el-table
      :data="trademarkList"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="tmName"
        label="品牌名称">
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width: 100px;height: 80px;">
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template>
          <el-button type="warning" size="mini">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="limit"
      :page-sizes="[3, 5, 7]"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total">
    </el-pagination>


  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      trademarkList: [],
      currentPage: 1, //当前页码数
      limit: 3, //每页多少条
      total: 0, //远程拿回来的数据,总共多少条
      pages: 0 //远程拿回来的数据,总共多少页
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.currentPage = page
      const {data, code, message} = await this.$API.trademark.getPageList(this.currentPage, this.limit)
      if (code === 200) {
        //data下面的record才是我想要的数据
        this.trademarkList = data.records
        this.total = data.total
        this.pages = data.pages
      } else {
        throw error(message)
      }
    },
    //改变每页条数
    handleSizeChange(size) {
      //看文档得知:回调参数即是每页的条数
      this.limit = size
    }
  }
}
</script>

<style scoped>

</style>
