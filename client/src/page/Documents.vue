<template>
  <el-card>
    <el-row>
      <v-uploadDoc :action="action"
                   :limit="limitNum"
                   :accept="accept"
                   :auto-upload="autoUpload" />
    </el-row>
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
        <el-table-column prop="uploadDate"
                         label="Date"
                         width="150">
        </el-table-column>
        <el-table-column prop="createdBy"
                         label="created by"
                         width="150">
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
            <el-button size="mini"
                       icon="el-icon-delete"
                       @click="onDelDocument(scope.row, scope.$index)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-card>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import uploadDoc from '@/components/blog/UploadDoc'

export default {
  components: { 'v-uploadDoc': uploadDoc },
  data: function () {
    return {
      action: '/api/document/upload',
      limitNum: 3,
      accept: '.xlsx,.vue,.png,PNG,.pdf,.PDF',
      autoUpload: false,
    }
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
    ...mapActions(['getDocumentList', 'delDocument']),
    ...mapMutations(['set_headline', 'set_dialog']),
    onViewDocument(row) {
      window.open(row.src, '_blank')
    },
    onDelDocument(row) {
      this.delDocument({ id: row.id })
    },
  },
}
</script>>