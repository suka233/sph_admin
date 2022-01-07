<template>
<div>
  <!--联动三级列表-->
  <el-card>
    <!--这里先默认让它不被禁用,之后才来判断是否禁用它-->
    <CategoryList @Category="Category" :disabled="showStatus!==-1"></CategoryList>
  </el-card>
  <!--SPU列表,SPU修改,SKU添加-->
  <el-card>
    <!--SPU列表展示-->
    <div v-show="showStatus === -1">
      <el-button
        @click="addSpu"
        type="primary" icon="el-icon-plus">添加SPU</el-button>
      <el-table :data="spuList">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="spuName"
          label="SPU名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="SPU描述">
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template slot-scope="{ row, $index }">
            <HintButton type="success" icon="el-icon-plus" size="mini" content="添加SKU"></HintButton>
            <HintButton
              @click="editSpu(row)"
              type="warning" icon="el-icon-edit" size="mini" content="修改SPU"></HintButton>
            <HintButton type="info" icon="el-icon-info" size="mini" content="查看SKU列表"></HintButton>
            <HintButton type="danger" icon="el-icon-delete" size="mini" content="删除SPU"></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center"
        @current-change="getSpuList"
        @size-change="handleSizeChange"
        :current-page="page"
        :page-size="limit"
        :page-sizes="[3, 5, 7]"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total"
      ></el-pagination>
    </div>
    <SpuForm
      @addUpdateBack="addUpdateBack"
      :visible.sync="showStatus"
      ref="SpuForm"
      v-show="showStatus === 0"></SpuForm>
    <SkuForm v-show="showStatus === 1"></SkuForm>
  </el-card>
</div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  data() {
    return{
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      //-1:SPU列表 0:SpuForm 1:SkuForm
      showStatus:-1,
      //当前处于多少页
      page:1,
      //每页的限制多少条
      limit:3,
      //总共有多少条数据
      total:0,
      //flag标识 标记是添加spu还是修改spu
    }
  },
  components:{
    SpuForm,
    SkuForm
  },
  methods: {
    //从子组件获取相应的category
    Category({category, level}) {
      if (level === 1) {
        //先清空 2 3
        this.category2Id = "";
        this.category3Id = "";
        //再清空el-table
        this.spuList = [];

        this.category1Id = category;
      } else if (level === 2) {
        //清空 3
        this.category3Id = "";
        //再清空el-table
        this.spuList = [];

        this.category2Id = category;
      } else {
        //拿到第三个category 可以发送请求了
        this.category3Id = category;

        //发送请求拿到SPU列表数据
        this.getSpuList();
      }
    },

    //发送请求 填充SpuList
    async getSpuList(page=1) {
      //把data中的page修改为传入的page,因为pagination会传入当前的page
      this.page = page
      const{limit, category3Id} = this
      const {code, data} = await this.$API.spu.getList(page, limit, category3Id);
      if (code === 200) {
        //将拿到的数据给spuList
        this.spuList = data.records
        this.total = data.total
      }
    },

    //改变pagination每页条数
    handleSizeChange(size) {
      //看文档得知:回调参数即是每页的条数
      this.limit = size
    },

    //点击添加Spu按钮
    addSpu(){
      this.showStatus = 0

      this.$refs.SpuForm.initAddSpuForm(this.category3Id)
    },

    //点击修改Spu按钮
    editSpu(row){
      //展示spu组件
      this.showStatus = 0

      //发送初始化数据,把当前的row信息传递过去
      this.$refs.SpuForm.initUpdateSpuForm(row)
    },

    //addUpdateBack spuForm子组件成功返回调用的事件
    addUpdateBack(flag){
      flag ? this.getSpuList() : this.getSpuList(this.page)
    }
  },
}
</script>

<style scoped>

</style>
