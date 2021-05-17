import Vue from 'vue'
import Vuex from 'vuex'
import musicModule from './modules/music'
import userModule from './modules/user'
import globalModule from './modules/global'
import createLogger from 'vuex/dist/logger'
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state: {
        user: {},
        headline: {},
        isLoading: false,
        moreArticle: true,
        loadMore: false,
        isSaving: false,
        noMore: false,
        dialog: {
            show: false,
            hasTwoBtn: false,
            info: 'hey',
            resolveFn: () => { },
            rejectFn: () => { }
        },
        tags: [],
        curTag: '',
        article: {},
        articles: [],
        totalArticles: 20,
        draft: {},
        drafts: {},
        comments: [],
        doucments: []
    },
    getters,
    actions,
    mutations,
    modules: {
        music: musicModule,
        user: userModule,
        global: globalModule,
    },
    plugins: debug ? [createLogger()] : []
})
