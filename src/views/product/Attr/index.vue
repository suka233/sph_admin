<template>
  <div>
    <el-card class="box-card">
      <CategoryList @Category="Category" :disabled="isShowEdit"></CategoryList>
    </el-card>

    <el-card class="box-card" style="margin: 20px 0">
      <div v-show="!isShowEdit">
        <!--初始页面-->
        <el-button type="primary" icon="el-icon-plus" @click="showEdit" :disabled="!category3Id">
          添加属性
        </el-button>

        <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="info"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin-right: 5px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <HintButton
                style="margin-right:10px"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEdit(row)"
                content="修改"
              >
              </HintButton>
              <el-popconfirm
                @confirm="deleteAttrConfirm(row.id)"
                title="确定删除吗？">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  content="删除">
                </HintButton>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="isShowEdit">
        <!--编辑页面-->
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              v-model="attrListItem.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!attrListItem.attrName"
          @click="addAttrValue"
          type="primary" icon="el-icon-plus">
          添加属性值
        </el-button>
        <el-button type="" @click="hideEdit">取消</el-button>

        <el-table
          :data="attrListItem.attrValueList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                size="mini"
                :ref="$index"
                placeholder="请输入名称"
                v-model="row.valueName"
                v-if="row.isEdit"
                @blur="completeEdit(row)"
                @keyup.enter.native="completeEdit(row)"
              ></el-input>
              <span
                style="display: block"
                v-else
                @click="toEdit(row, $index)"
              >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-popconfirm
                @confirm="deleteConfirm(row,$index)"
                title="确定删除吗？">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  content="删除"
                ></HintButton>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-button
          @click="saveChange"
          :disabled="attrListItem.attrValueList.length === 0"
          type="primary">
          保存
        </el-button>
        <el-button type="" @click="hideEdit">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
// TODO 解决BUG,多次点击添加属性值,会多次提醒不能输入空字符串

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowEdit: false, //是否显示编辑面板
      attrListItem: {
        //每项attrList
        attrName: "",
        attrValueList: [],
        categoryId:'',
        categoryLevel:"",
      },
      isEdit: false, //当前属性值是否为编辑状态
      // attrList的数据结构:
      // [
      // {
      //   "attrName": "string",
      //   "attrValueList": [
      //     {
      //       "attrId": 0,
      //       "id": 0,
      //       "valueName": "string"
      //     }
      //   ],
      //   "categoryId": 0,
      //   "categoryLevel": 0,
      //   "id": 0
      // }
      // ]
    };
  },
  methods: {
    //从子组件获取相应的category
    Category({category, level}) {
      if (level === 1) {
        //先清空 2 3
        this.category2Id = "";
        this.category3Id = "";
        //再清空el-table
        this.attrList = [];

        this.category1Id = category;
      } else if (level === 2) {
        //清空 3
        this.category3Id = "";
        //再清空el-table
        this.attrList = [];

        this.category2Id = category;
      } else {
        //拿到第三个category 可以发送请求了
        this.category3Id = category;

        //发送请求拿到数据
        this.getAttr();
      }
    },

    //发送请求
    async getAttr() {
      const {code, data} = await this.$API.attr.getAttr(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (code === 200) {
        //将拿到的数据给attrList
        this.attrList = data;
      }
    },

    // 点击添加属性/编辑 按钮
    showEdit(row) {
      if (row.attrName) {
        // 如果row.attrName存在,说明是编辑,转存(深拷贝)row数据给attrListItem,避免影响原数据
        this.attrListItem = cloneDeep(row);

        //再给每一个属性值加上属性isEdit
        this.attrListItem.attrValueList.forEach((item) => {
          this.$set(item, "isEdit", false);
        });
      } else {
        //如果不存在说明是添加属性,那么就直接添加,那就要先清空attrListItem
        this.attrListItem = {
          attrName: "",
          attrValueList: [],
          categoryId: this.category3Id,
          categoryLevel: 3
        };
      }
      //显示编辑页面
      this.isShowEdit = true;
    },

    // 点击取消按钮 隐藏edit页面
    hideEdit() {
      this.isShowEdit = false;
    },

    //点击添加属性值按钮
    addAttrValue() {
      //新增一项
      this.attrListItem.attrValueList.push({
        attrId:this.attrListItem.id,
        valueName: "",
        isEdit: true,
      });

      //最后一项获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrListItem.attrValueList.length - 1].focus();
      });
    },

    //完成编辑
    completeEdit(row) {
      //校验数据:
      // 1.不能为空
      if (row.valueName.trim() === "") {
        //提示不能为空
        this.$message("输入值不能为空!");
        return;
      }

      // 2.不能和之前项目重合
      let _arr = this.attrListItem.attrValueList.filter((item) => {
        return item.valueName === row.valueName;
      });
      if (_arr.length >= 2) {
        //只能有一项,就是自己
        //清空当前值,并提示
        row.valueName = "";
        this.$message("输入值重复!请重新输入!");
        return;
      }

      //退出编辑状态
      row.isEdit = false;
    },

    //开始编辑
    toEdit(row, index) {
      // console.log(index);
      //转为编辑形态
      row.isEdit = true;

      //自动获取焦点
      //以下方法虽然写的没错,但是论如何都获取不到,原因是这里使用的是v-if 即当isEdit为true的u
      //input还没被创建呢
      // this.$refs[index].focus()
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    //确定删除吗
    deleteConfirm(row,index){
      this.attrListItem.attrValueList.splice(index,1)
    },

    //保存并发送请求
    async saveChange(){
      //整理数据

      //去除空数据 与 isEdit属性
      this.attrListItem.attrValueList = this.attrListItem.attrValueList.filter(item=>{
        if(item.valueName !== "") {
          //如果不等于空,那么处理一下数据,就返回到新数组中
          delete item.isEdit
          return true
        }
      })

      //如果空数据 直接不发送请求
      if (this.attrListItem.attrValueList.length === 0) {
        this.$message('无法发送空数据!')
        return
      }

      // console.log(this.attrListItem);

      //发送请求
      const {code, data} = await this.$API.attr.addOrUpdateAttr(this.attrListItem)
      if (code === 200) {
        this.$message(data)
        //跳转到非编辑页面
        this.isShowEdit = false
        //重新发送请求
        await this.getAttr()
      }else{
        this.$message('保存失败!')
      }
    },

    //根据attrId删除
    async deleteAttrConfirm(id){
      const {code,data} = await this.$API.attr.deleteAttr(id)
      if (code === 200){
        this.$message.success('删除成功')
        //重新刷新
        await this.getAttr()
      }else {
        this.$message(data)
      }

    }
  },

};
</script>

<style scoped></style>
