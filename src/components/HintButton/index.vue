<template>
  <!--<el-tooltip class="item" effect="dark" :content="content" :placement="placement">-->
  <!--  <el-button v-bind="$attrs" v-on="$listeners"></el-button>-->
  <!--</el-tooltip>-->

  <!--以上的hintbutton有bug-->
  <a  :title="content" class="hintButton">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "index",
  props:{
    content:{
      type:String,
      default:"使用content属性指定提示信息"
    },
    placement:{
      type:String,
      default: "top-start"  //默认值为上面
    }
  }
}
</script>

<style scoped>
.hintButton {
  margin:0 5px;
}
</style>
