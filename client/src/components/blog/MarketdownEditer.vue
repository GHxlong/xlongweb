<template>
  <el-card>
    <mavon-editor
      ref="md"
      v-model="edit_content"
      :ishljs="true"
      style="min-height: 700px; "
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
      @change="change"
      @save="save"
    />
  </el-card>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
    name: 'MarkDownEditer',
    components: { 'mavon-editor': mavonEditor },
    data: function () {
        return {
            edit_content: ''
        }
    },
    // 增加计算属性
    computed: {},
    watch: {},
    methods: {
        $imgAdd (pos, $file, isinsert) {
            const _this = this
            // 第一步.将图片上传到服务器.
            var formdata = new FormData()
            formdata.append('image', $file)
            _this.$Api.UploadDoc.MdImagAdd(formdata, { 'Content-Type': 'multipart/form-data' }).then(
        (res) => {
            const url = res.data.url
          // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
          /**
          * $vm 指为mavonEditor实例，可以通过如下两种方式获取
          * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
          * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
          */
            this.$refs.md.$img2Url(pos, url)
        })
        },
        $imgDel (pos) {

        },
        change (value, render) {
            this.edit_content = render
            this.$emit('save-data', this.edit_content)
        },
        save (value, render) {
            this.edit_content = render
            this.$emit('save-data', this.edit_content)
        }
    }
}
</script>

<style scoped>
</style>>
