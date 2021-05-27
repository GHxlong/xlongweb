<template>
  <el-form>
    <div class="drop-upload-container">
      <el-form-item :label-width="formLabelWidth">
        <el-upload multiple
                   drag
                   ref="uploadFiles"
                   :action="action"
                   :limit="limit"
                   :auto-upload="autoUpload"
                   :accept="accept"
                   :before-upload="beforeUploadFile"
                   :on-remove="handleRemove"
                   :on-change="fileChange"
                   :on-exceed="exceedFile"
                   :http-request="handleUpload"
                   :file-list="fileList">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            上传：
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip"
               slot="tip">上传文件类型</div>
        </el-upload>
      </el-form-item>
      <el-form-item class="item-container">
        <el-button size="small"
                   type="primary"
                   @click.native="submitUpload">Ok</el-button>
        <el-button size="small"
                   @click.native="uploadCancle">Cancel</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Upload',
  props: {
    action: {
      required: true,
      type: String,
    },
    limit: {
      required: true,
      type: Number,
    },
    autoUpload: {
      type: Boolean,
      default: false,
    },
    accept: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      formLabelWidth: '80px',
      userIds: sessionStorage.getItem('userid'),
      fileList: [],
      files: [],
    }
  },
  methods: {
    ...mapActions(['uploadFilesReq']),
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      console.log('===exceed===')
      let limit_num = `${this.limit}`
      let total_num = `${files.length + fileList.length}`
      this.$notify.warning({
        title: "Selected files limit number",
        message: `${total_num} > ${limit_num}`,
      })
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log('===change===')
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log('before upload')
      console.log(file)
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isAcceptFiles = this.accept.indexOf(extension) > -1
      if (!isAcceptFiles) {
        this.$notify.warning({
          title: "Dont't support upload",
          message: `${extension} is not accept file type.`,
        })
      }
      let size = file.size / 1024 / 1024
      const isAcceptSize = size < 10
      if (!isAcceptSize) {
        this.$notify.warning({
          title: "Dont't support upload",
          message: `${size} is too big.`,
        })
      }
      return isAcceptFiles && isAcceptSize
    },
    // 点击x时执行的钩子函数
    handleRemove(file, fileList) {
      console.log('===remove===')
    },
    handleUpload(raw) {
      this.files.push(raw.file)
    },
    submitUpload() {
      this.$refs.uploadFiles.submit()
      let fd = new FormData()
      fd.append('userIds', this.userIds)
      this.files.forEach((file) => {
        fd.append('Files', file, file.name)
      })
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      this.uploadFilesReq(fd, config)
        .then(
          (res) => {
            console.log('===upload rep===')
            console.log(res)
            if (res.data.status === 'success') {
              this.files = []
              this.$refs.uploadFiles.clearFiles()
              this.$notify.success({
                title: 'upload error.',
                message: `${JSON.stringify(res)}`,
              })
            }
          },
          (err) => {
            this.$notify.error({
              title: 'upload error.',
              message: `${err}`,
            })
          }
        )
        .catch((err) => {
          console.log('===upload error===')
          console.log(err)
          this.$notify.error({
            title: 'upload error.',
            message: `${err}`,
          })
        })
    },
    uploadCancle() {
      console.log('===Cancle===')
      this.$refs.uploadFiles.clearFiles()
    },
  },
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  /* height: 160px; */
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.drop-upload-container {
  width: 450px;
}
.item-container {
  margin: 0 auto;
  /* text-align: center; */
  padding-left: 80px;
}
</style>