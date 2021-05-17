<template>
  <v-pdfview :filesrc="doc.src"
             :filename="doc.name" />
</template>

<script>
import PdfView from '@/components/share/PdfView'

export default {
  components: {
    'v-pdfview': PdfView,
  },
  mounted() {
    this.doc = this.$route.query
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          document.title = `文档预览 ${this.doc.name}`
        } else {
          document.title = '文档预览'
        }
      },
      false
    )
  },
  data: function () {
    return {
      doc: null,
    }
  },
}
</script>>