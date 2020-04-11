<template>
 <div>
   <el-pagination
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="value.pageNo"
     :page-sizes="[10, 20,50,100, 200]"
     :page-size="value.pageSize"
     :pager-count="5"
     layout="total, sizes, prev, pager, next, jumper"
     :total="value.total">
   </el-pagination>
 </div>
</template>

<script>
  export default {
    name: 'mPagination',
    props: {
      value: Object
    },
    methods: {
      handleSizeChange(val) {
        this.value.pageSize = val
        this.value.pageNo = 1
        this.$emit('refresh')
      },
      handleCurrentChange(val) {
        this.value.pageNo = val
        this.$emit('refresh')
      }
    }
  }
</script>

<style scoped>

</style>
