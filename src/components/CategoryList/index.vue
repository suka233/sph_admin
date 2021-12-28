<template>
<div>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="category1Id" placeholder="请选择" @change="category1Change">
        <el-option :label="category1.name" :value="category1.id" v-for="category1 in category1List"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="category2Id" placeholder="请选择" @change="category2Change">
        <el-option :label="category2.name" :value="category2.id" v-for="category2 in category2List"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="category3Id" placeholder="请选择" @change="category3Change">
        <el-option :label="category3.name" :value="category3.id" v-for="category3 in category3List"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: "CategoryList",
  data(){
    return{
      category1Id:'',
      category2Id:'',
      category3Id:'',
      category1List:[],
      category2List:[],
      category3List:[]
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods:{
    async getCategoryList(){
      const{code,data} = await this.$API.attr.getCategory1List()
      if(code === 200){
        this.category1List = data
      }
    },
    //更改一级菜单触发的事件
    async category1Change(id){
      //清空二三级
      this.category2Id = ''
      this.category3Id = ''
      this.category2List = []
      this.category3List = []

      //获取二级菜单
      const{code,data} = await this.$API.attr.getCategory2List(id)
      if(code === 200){
        this.category2List = data
      }
    },
    //更改二级菜单触发的事件
    async category2Change(id){
      //清空三级
      this.category3Id = ''
      this.category3List = []

      //获取二级菜单
      const{code,data} = await this.$API.attr.getCategory3List(id)
      if(code === 200){
        this.category3List = data
      }
    },
    //更改三级菜单触发的事件
    category3Change(id){

    }
  }
}
</script>

<style scoped>

</style>
