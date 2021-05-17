<template>
  <div class="wrapper">
    <el-card>
      <input type="text"
             placeholder="文章标题"
             onfocus="this.placeholder=''"
             onblur="this.placeholder='文章标题'"
             v-model="title" />
      <div id="tags">
        <tag-input v-for="(item, index) in tags"
                   :tags="tags"
                   :index="index"
                   :key="index"></tag-input>
      </div>
      <el-button class="publish"
                 @click="onSaveArticle()">发布文章</el-button>
      <el-button class="draft"
                 @click="onSaveDraft()">存为草稿</el-button>
      <markdown-editor @save-data="onSaveData" @change-data="onChangeData" />
    </el-card>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import MarkdownEdit from '@/components/blog/MarketdownEditer'
import TagInput from '@/components/blog/TagInput'

export default {
    name: 'CreaterCenter',
    components: { 'markdown-editor': MarkdownEdit, TagInput },
    data () {
        return {
            ruleForm: {
                id: '',
                title: '',
                description: '',
                content: ''
            }
        }
    },
    created () {
        this.set_headline({
            content: '创作中心',
            animation: 'animated rotateIn'
        })
        this.set_article({
            content: '',
            title: '',
            tags: ['']
        })
    },
    methods: {
        ...mapMutations([
            'set_headline',
            'set_article',
            'update_post_content',
            'update_post_title',
            'update_post_tags',
            'isSaving_toggle',
            'set_dialog'
        ]),
        ...mapActions(['createArticle', 'saveDraft']),
        onSaveArticle () {
            if (this.title === '') {
                return
            }
            this.update_post_content(this.ruleForm.content)
            this.createArticle()
        },
        onSaveDraft () {
            if (this.title === '') {
                return
            }
            this.update_post_content(this.ruleForm.content)
            this.saveDraft()
        },
        onSaveData (mdContent) {
            const _this = this
            _this.ruleForm.content = mdContent
        },
        onChangeData (mdContent) {
            const _this = this
            _this.ruleForm.content = mdContent
        }
    },
    computed: {
        ...mapState(['article', 'isSaving', 'dialog']),
        title: {
            get () {
                return this.article.title || ''
            },
            set (value) {
                this.update_post_title(value)
            }
        },
        tags () {
            return this.article.tags
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
  position: relative;
  padding: 0 3.125rem 0;
  input {
    border: none;
    border-bottom: 0.125rem solid rgb(129, 216, 208);
    outline: none;
    background: transparent;
    color: #0f0f0f;
    margin-top: 1.525rem;
    margin-bottom: 0.625rem;
    text-align: left;
  }
  .title input {
    width: 100%;
    height: 3.125rem;
    font-size: 1.875rem;
  }
  #tags {
    input {
      width: 6.25rem;
      height: 1.875rem;
      font-size: 1rem;
      margin-right: 0.125rem;
      color: #0f0f0f;
    }
  }
}
.publish {
  width: 6.25rem;
  //position: fixed;
  left: 1rem;
  bottom: 32.5rem;
  background: rgb(129, 216, 208);
  margin-bottom: 0.625rem;
  color: #000;
}
.draft {
  width: 6.25rem;
  left: 1rem;
  bottom: 2.5rem;
  background: rgb(129, 216, 208);
  color: #000;
  margin-bottom: 0.625rem;
}
.active {
  background: rgb(129, 216, 208);
  color: #111111;
}
@media screen and (max-width: 440px) {
  .wrapper {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    margin-bottom: 5rem;
  }
  .publish {
    position: absolute !important;
    bottom: -3rem !important;
    left: 1rem !important;
  }
  .draft {
    position: absolute !important;
    left: calc(100% - 7.25rem) !important;
    bottom: -3rem !important;
  }
  #tags {
    width: 13.7rem !important;
  }
}
</style>

