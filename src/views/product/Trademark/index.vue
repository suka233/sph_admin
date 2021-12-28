<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>

    <el-table
      border
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
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" @click="showDialog(row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteTm(row)">删除</el-button>
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

    <!--    以下是dialog-->
    <el-dialog :title="tmForm.id?'编辑品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName" label-width="80%"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTm">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "Trademark",
  data() {
    return {
      trademarkList: [],
      currentPage: 1, //当前页码数
      limit: 3, //每页多少条
      total: 0, //远程拿回来的数据,总共多少条
      pages: 0, //远程拿回来的数据,总共多少页
      dialogFormVisible: false, //控制dialog的显示隐藏
      tmForm: {
        tmName:'',
        logoUrl:''
      },
      rules: {
        tmName: [
          {required: true, message: '请输入品牌名称!', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        logoUrl: [
          {required: true, message: '必须传入一张图片', trigger: 'change'}
        ],
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    //渲染列表数据
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
    },
    //显示dialog
    showDialog(row) {
      if (row.tmName) {
        // 如果传入了row,说明是修改数据,将row的数据转存到tmForm里面,避免直接修改row
        // bug警示!不能直接if(row),而必须if(row.tmName) 因为如果click自定义函数未显式传递参数的话
        // vue会默认传递$event进来,此时row就是$event,if(row)始终为true

        // console.log(row)
        this.tmForm = {
          ...row
        }
      }
      //显示dialog
      this.dialogFormVisible = true

    },
    //上传图片成功后的回调
    handleAvatarSuccess(res, file) {
      // 这里发现上传图片后要重新刷新一下tmForm,图片才显示,不知道为啥
      // this.tmForm.logoUrl = res.data;


      //使用vue的全局方法强制刷新数据,能一定程度的解决以上bug
      // this.$forceUpdate()

      // 已经完美解决:如果要让对象新增的属性具有响应式,那么要使用this.$set来设置属性,而非仅仅是直接设置属性值!!
      // this.$set(this.tmForm,"logoUrl",res.data)
      // 不过以上的做法我还是有疑惑:tmForm.logoUrl在data里面已经定义为空了,按理来说已经具备响应式的能力了,为啥这里还要再次使用$set才有效呢?
      // 以上问题已经完美解决:因为在showDialog中,点击添加按钮触发showDialog,虽然没有显式传递参数
      // 但是,vue会给第一个参数默认传递为$event,也就是说,如果未显式传递参数,那么这个row就是$event
      // 那么,其实this.tmForm={...row}是无论如何都会执行的,也就是在这里,this.tmForm失去了响应式能力
      // 所以,解决办法很简单,一是重新在这里赋予tmForm响应式能力,但是这样会让showDialog的if(row)失去意义
      // 所以,还是直接更改showDialog的判断即可
      this.tmForm.logoUrl = res.data;


      // console.log(this.tmForm.logoUrl);
    },
    //限定上传的图片格式与大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //根据tmForm是否存在id编辑或者增加品牌
    addOrUpdateTm() {
      //验证表单
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          //通过验证,发送请求
          //发送请求
          try {
            await this.$API.trademark.addOrUpdateTrademark(this.tmForm)
            //隐藏dialog
            this.dialogFormVisible = false
            //重新渲染列表,如果是新增,就跳到第一页,如果是修改,就在当前页即可
            await this.getTrademarkList(this.tmForm.id ? this.currentPage : 1)
          } catch (e) {
            this.$message.error(e.message)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除当前选中的品牌
    deleteTm(tm) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //把要删除的品牌传过来
        this.tmForm = {
          ...tm
        }
        //发送请求
        await this.$API.trademark.deleteTrademarkById(this.tmForm.id)
        //刷新列表,如果当前条目大于1,则留在当前页,否去往前一页
        await this.getTrademarkList(this.trademarkList.length > 1 ? this.currentPage : this.currentPage - 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }

  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
