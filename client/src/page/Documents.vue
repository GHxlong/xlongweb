<template>
  <el-card>
    <el-row>
      <el-table :data="documentList"
                border
                default-expand-all
                row-key="Id"
                highlight-current-row>
        <el-table-column type="index"
                         prop="id"
                         label="Id"
                         width="80" />
        <el-table-column prop="name"
                         label="Name"
                         width="250" />
        <el-table-column prop="type"
                         label="Type"
                         width="100">
        </el-table-column>
        <el-table-column prop="desc"
                         label="Description"
                         width="500" />
        <el-table-column prop="Operater"
                         label="">
          <template slot-scope="scope">
            <el-button size="mini"
                       icon="el-icon-view"
                       @click="onViewDocument(scope.row, scope.$index)">

            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-card>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data: function () {
    return {}
  },
  created() {
    this.set_headline({
      content: '文档中心',
      animation: 'animated rotateIn',
    })
    this.getDocumentList({})
  },
  computed: {
    ...mapState(['doucments']),
    documentList() {
      return this.doucments
    },
  },
  methods: {
    ...mapActions(['getDocumentList']),
    ...mapMutations(['set_headline', 'set_dialog']),
    onViewDocument(row) {
      let routerJump = this.$router.resolve({
        path: '/document',
        query: {
          name: row.name,
          src: row.src,
        },
      })
      window.open(routerJump.href, '_blank')
    },
  },
}
</script>>