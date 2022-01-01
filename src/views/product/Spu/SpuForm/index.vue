<template>
  <div>
    <el-form :model="spuForm" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <template slot-scope="{ row, $index }">
          <el-select placeholder="请选择" v-model="spuForm.tmId">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          rows="5"
          v-model="spuForm.description" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <template slot-scope="{ row, $index }">
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="spuImageList"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </template>
      </el-form-item>

      <el-form-item label="销售属性">
        <template slot-scope="{ row, $index }">
          <!--:model="formInline"-->
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <!--v-model="formInline.region"-->
              <el-select :placeholder="`${unSelectedSaleAttrList.length===0?'没有啦':'还剩'+unSelectedSaleAttrList.length+'项'}`" v-model="spuSaleAttrListSelected">
                <el-option
                  v-for="attr in unSelectedSaleAttrList"
                  :key="attr.id"
                  :label="attr.name"
                  :value="attr.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <!--@click="onSubmit"-->
              <el-button
                :disabled="spuSaleAttrListSelected===''"
                type="primary" icon="el-icon-plus" @click="addAttrValue">添加销售属性</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-form-item>

      <el-form-item>
        <template>
          <!--:data="tableData"-->
          <el-table
            :data="spuForm.spuSaleAttrList"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="saleAttrName"
              label="属性名"
              width="180">
            </el-table-column>
            <el-table-column
              label="属性名称列表">
              <!--@close="handleClose(tag)"-->
              <template slot-scope="{ row, $index }">
                <el-tag
                  @close="handleClose(row,index)"
                  :key="tag.id"
                  v-for="(tag,index) in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="inputValue"
                  :ref="$index"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row,$index)"
                  @blur="handleInputConfirm(row,$index)"
                >
                </el-input>

                <el-button
                  @click="showTagInput($index)"
                  v-else class="button-new-tag" size="mini" >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width="180"
              label="操作">
              <template slot-scope="{ row, $index }">
                <HintButton
                  @click="deleteSaleAttrItem($index)"
                  type="danger" icon="el-icon-delete" size="mini" content='删除此行'></HintButton>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary">保存</el-button>
          <el-button @click="cancelFn">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuForm: {
        category3Id: 0,
        //描述
        description: "",
        //从row里面取得的id
        id: 0,
        //spu的图片列表(渲染图片上传列表
        spuImageList: [],
        //spu名称
        spuName: "",
        //spu的销售属性列表(似乎是渲染最后面的那个table的数组对象
        spuSaleAttrList: [],
        //品牌id
        tmId: 0,
      },
      //图片墙上传所用的数据,后期更改
      dialogImageUrl: '',
      dialogVisible: false,
      //预处理的品牌列表,以后可能要从这里面拿数据处理到spuForm里
      trademarkList: [],
      //TODO 品牌列表搜集到的数据,先暂定只搜集的到品牌列表Id,后期更改
      trademarkValue: 0,
      //预处理的销售属性总列表,包含所有
      spuSaleAttrList: [],
      //预处理的销售属性值列表,saleAttrValueName为需要搜集的tag数据,以后要用这个数据拼接到spuSaleAttrList数组里
      spuSaleAttrValueList: [],
      //预处理的图片列表,以后用这里面的数据处理到spuForm里
      spuImageList: [],
      //以下是el-tag需要的属性
      inputVisible: false,
      inputValue: '',
      //预处理的选择销售属性,暂定搜集id值
      spuSaleAttrListSelected: '',
      //以下是需要构造出来的最终数据
      // {
      //   "category3Id": 0,
      //   "description": "string",
      //   "id": 0,
      //   "spuImageList": [
      //   {
      //     "id": 0,
      //     "imgName": "string",
      //     "imgUrl": "string",
      //     "spuId": 0
      //   }
      // ],
      //   "spuName": "string",
      //   "spuSaleAttrList": [
      //   {
      //     "baseSaleAttrId": 0,
      //     "id": 0,
      //     "saleAttrName": "string",
      //     "spuId": 0,
      //     "spuSaleAttrValueList": [
      //       {
      //         "baseSaleAttrId": 0,
      //         "id": 0,
      //         "isChecked": "string",
      //         "saleAttrName": "string",
      //         "saleAttrValueName": "string",
      //         "spuId": 0
      //       }
      //     ]
      //   }
      // ],
      //   "tmId": 0
      // }
    }
  },
  methods: {
    //初始化本页数据,由父组件调用
    async initUpdateSpuForm(row) {
      // 发送编辑模式下的四个请求来填充表单数据

      //根据传过来的值先初始化一下数据
      const {category3Id, description, id, spuName, tmId} = row
      this.spuForm.category3Id = category3Id
      this.spuForm.description = description
      this.spuForm.id = id
      this.spuForm.spuName = spuName
      this.spuForm.tmId = tmId

      // 根据ID获取SPU信息
      // http://localhost:9529/dev-api/admin/product/getSpuById/1724
      let spuInfo = await this.$API.spu.get(id)
      if (spuInfo.code === 200) {
        //这里spuForm已经被我预先定义了,所以应该不会丢失响应式能力
        this.spuForm = spuInfo.data
      }

      // 根据ID获取spuImageList,之后要处理进spuForm.spuImageList里面
      // http://localhost:9529/dev-api/admin/product/spuImageList/1724
      let spuImageList = await this.$API.sku.getSpuImageList(id)
      if (spuImageList.code === 200) {
        this.spuImageList = spuImageList.data
      }

      // 获取所有品牌列表,用于渲染品牌列表
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      let trademarkList = await this.$API.trademark.getTrademarkList()
      if (trademarkList.code === 200) {
        this.trademarkList = trademarkList.data
      }

      // 获取所有的销售属性列表(不管是使用的还是未使用的
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      let saleAttrList = await this.$API.spu.getSaleAttrList()
      if (saleAttrList.code === 200) {
        this.spuSaleAttrList = saleAttrList.data
      }

      //整理数据
      //spuImageList里面的数据要整理成为upload组件能显示的格式:name,url
      this.spuImageList.forEach((item) => {
        this.$set(item, 'name', item.imgName)
        this.$set(item, 'url', item.imgUrl)
      })
      //spuForm.spuSaleAttrList每项要加上inputVisible = false,方便tag显示
      this.spuForm.spuSaleAttrList.forEach(item=>{
        this.$set(item,'inputVisible',false)
      })
      //清空选择的销售属性
      this.spuSaleAttrListSelected=''
    },
    //删除图片的回调
    handleRemove(file, fileList) {
      //fileList即是删除之后的图片列表,用它来更新一下spuImageList
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // 把相应的数据存入spuImageList中
      // 但是如果直接操作spuImageList 会触发再次加载
      // TODO 所以这里之后的操作应该是把图片直接整理进spuForm.spuImageList
      // this.spuImageList.push({
      //   name:file.name,
      //   url:res.data,
      // })
    },
    //点击添加销售属性按钮
    addAttrValue(){
      //给表格添加一项:inputVisible和spuSaleAttrValueList都必须在这里初始化,不然后面会报错
      this.spuForm.spuSaleAttrList.push({
        saleAttrName:this.spuSaleAttrListSelected,
        inputVisible:false,
        spuSaleAttrValueList:[]
      })
      //清空当前选择的
      this.spuSaleAttrListSelected = ''
    },
    //tag的添加按钮
    showTagInput(index){
      // console.log(index);
      // 让输入框显示出来
      this.spuForm.spuSaleAttrList[index].inputVisible = true
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    //确定添加tag
    handleInputConfirm(row,index){
      //数据处理:
      // 1.不能为空
      if(this.inputValue.trim() === ""){
        this.$message('不可以输入空字符串,请重新输入')
        //编辑状态变为tag
        this.spuForm.spuSaleAttrList[index].inputVisible = false
        return
      }
      // 2.不能重复
      let flag = this.spuForm.spuSaleAttrList[index].spuSaleAttrValueList.find(item=>{
        return  item.saleAttrValueName === this.inputValue.trim()
      })
      if (flag) {
        this.$message('不可以输入相同字符串,请重新输入')
        this.inputValue=''
        //编辑状态变为tag
        this.spuForm.spuSaleAttrList[index].inputVisible = false
        return
      }

      //把this.inputValue封装为对象 push进this.spuForm.spuSaleAttrList
      this.spuForm.spuSaleAttrList[index].spuSaleAttrValueList.push({
        saleAttrValueName:this.inputValue,
        saleAttrName:row.saleAttrName
      })
      //编辑状态变为tag
      this.spuForm.spuSaleAttrList[index].inputVisible = false
      //编辑框清空
      this.inputValue = ''
    },
    //删除此tag
    handleClose(row,index){
      row.spuSaleAttrValueList.splice(index,1)
    },

    //删除销售属性表格的此行
    deleteSaleAttrItem(index){
      this.spuForm.spuSaleAttrList.splice(index,1)
    },
    //点击取消按钮,隐藏此子组件,返回到父组件
    cancelFn() {
      //更改父组件的showStatus值,使用了.sync 修饰符
      this.$emit('update:visible', -1)
    },

  },
  computed: {
    //计算出未选择的销售属性列表
    unSelectedSaleAttrList() {
      // 根据请求拿回来的spuSaleAttrList[].name
      // 和spuForm.spuSaleAttrList[].saleAttrName来计算未选择的
      let {spuSaleAttrList, spuForm} = this
      //筛选出未重合的项目
      return spuSaleAttrList.filter(
        baseItem => !spuForm.spuSaleAttrList.find(
          usedItem => usedItem.saleAttrName === baseItem.name)
      )
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
