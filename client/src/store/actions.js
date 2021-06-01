import Vue from 'vue'
import router from '../router/router'

const beginLoading = (commit, add) => {
    add ? commit('loadMore_toggle', true) : commit('isLoading_toggle', true)
    return Date.now()
}

const endLoading = (commit, startTime, toggle) => {
    const leftTime = 500 - (Date.now() - startTime)
    leftTime > 0 ? setTimeout(commit(toggle, false), leftTime) : commit(toggle, false)
}

export default {
    login ({ commit }, payload) {
        return Vue.http.post('/api/admin/login', payload).catch((err) => { console.log(err) })
    },
    resetUser ({ commit }, payload) {
        return Vue.http.post('/api/admin/user', payload)
            .then(() => {
                commit('unset_user')
                router.go({ name: 'login' })
            }).catch((err) => { console.log(err) })
    },
    createArticle ({ state, commit }) {
        commit('isSaving_toggle', false)
        return Vue.http.post('/api/content/create', state.article)
            .then(() => {
                commit('isSaving_toggle', true)
                router.push({ name: 'home' })
            }, () => { alert('创建失败') }).catch((err) => { console.log(err) })
    },
    getAllArticles ({ commit }, payload) {
        payload.status = "PUBLISHED"
        commit('moreArticle_toggle', true)
        const startTime = beginLoading(commit, payload.add)
        if (payload.value) {
            commit('isLoading_toggle', false)
        }
        return Vue.http.get('/api/content/posts', { params: { payload } })
            .then(response => response.json())
            .then(articles => {
                let data = articles.data
                if (data.content.length === 0) {
                    commit('moreArticle_toggle', false)
                    commit('noMore_toggle', true)
                } else {
                    commit('noMore_toggle', false)
                }
                if (payload.add) {
                    commit('add_articles', data.content)
                    endLoading(commit, startTime, 'loadMore_toggle')
                } else {
                    commit('set_all_articles', data.content)
                    commit('set_total_articles', data.total)
                    endLoading(commit, startTime, 'isLoading_toggle')
                }
            }).catch((err) => { console.log(err) })
    },
    getArticle ({ commit, state }, id) {
        const startTime = beginLoading(commit, false)
        if (router.currentRoute.hash) {
            commit('isLoading_toggle', false)
        }
        document.title = '加载中...'
        return Vue.http.get('/api/content/posts/' + id)
            .then(response => {
                let data = response.data
                commit('set_article', data.data)
                commit('set_headline', {
                    content: state.article.title,
                    animation: 'animated rotateIn'
                })
                document.title = state.article.title
                endLoading(commit, startTime, 'isLoading_toggle')
            }).catch((err) => { console.log(err) })
    },
    delArticle ({ dispatch }, payload) {
        return Vue.http.delete('/api/content/' + payload.id)
            .then(() => {
                if (payload.route.name === 'posts') dispatch('getAllArticles', { page: payload.page, limit: 8 })
                if (payload.route.name === 'drafts') dispatch('getAllDrafts', { page: payload.page, limit: 8 })
                if (payload.route.name === 'search') router.push({ name: 'posts' })
            }).catch((err) => { console.log(err) })
    },
    // update
    saveArticle ({ state, commit }, id) {
        commit('isSaving_toggle', false)
        return Vue.http.patch('/api/content/' + id, state.article)
            .then(() => {
                commit('isSaving_toggle', true)
                router.push({ name: 'posts' })
            }, () => { alert('保存失败') }).catch((err, cb) => {
                console.log(err)
                if (cb) cb()
            })
    },
    saveDraft ({ state, commit }, id) {
        if (id) {
            return Vue.http.patch('/api/content/' + id, state.article)
            .then(() => {
                commit('isSaving_toggle', true)
                router.push({ name: 'posts' })
            }, () => { alert('保存失败') }).catch((err, cb) => {
                console.log(err)
                if (cb) cb()
            })
        } else {
            commit('isSaving_toggle', false)
            state.article.status = "DRAFT"
            return Vue.http.post('/api/content/create', state.article)
                .then(() => {
                    commit('isSaving_toggle', true)
                    router.push({ name: 'home' })
                }, () => { alert('创建失败') }).catch((err) => { console.log(err) })
        }
    },
    getAllDrafts ({ commit }, payload) {
        payload.status = "DRAFT"
        return Vue.http.get('/api/content/posts', { params: { payload } })
            .then(response => response.json())
            .then(articles => {
                let data = articles.data
                if (data.content.length === 0) {
                    commit('moreArticle_toggle', false)
                    commit('noMore_toggle', true)
                } else {
                    commit('noMore_toggle', false)
                }
                if (payload.add) {
                    commit('add_articles', data.content)
                    endLoading(commit, startTime, 'loadMore_toggle')
                } else {
                    commit('set_all_articles', data.content)
                    commit('set_total_articles', data.total)
                    endLoading(commit, startTime, 'isLoading_toggle')
                }
            }).catch((err) => { console.log(err) })
    },
    searchArticles ({ commit }, payload) {
        document.title = '搜索中...'
        commit('moreArticle_toggle', true)
        const startTime = beginLoading(commit, payload.add)
        return Vue.http.get('/api/content/posts_search', { params: { payload } })
            .then(response => response.json())
            .then(articles => {
                let data = articles.data
                console.log(JSON.stringify(data))
                if (data.content.length === 0) {
                    commit('moreArticle_toggle', false)
                    commit('noMore_toggle', true)
                } else {
                    commit('noMore_toggle', false)
                }
                if (payload.add) {
                    commit('add_articles', data.content)
                    endLoading(commit, startTime, 'loadMore_toggle')
                } else {
                    commit('set_all_articles', data.content)
                    endLoading(commit, startTime, 'isLoading_toggle')
                }
                document.title = '搜索成功'
            }).catch((err) => { console.log(err) })
    },
    getAllTags ({ commit }) {
        return Vue.http.get('/api/content/tags')
            .then(response => {
                commit('set_tags', response.data)
            }).catch((err) => { console.log(err) })
    },
    sendMail ({ commit }, payload) {
        return Vue.http.post('/api/mail', payload).catch((err) => { console.log(err) })
    },
    contactMe ({ commit }, payload) {
        return Vue.http.post('/api/contact_me', payload).catch((err) => { console.log(err) })
    },
    summitComment ({ commit }, payload) {
        return Vue.http.post('/api/admin/content/posts/comments', payload)
    },
    getAllComments ({ commit }, payload) {
        return Vue.http.get('/api/content/posts/' + payload.id + '/comments/list_view', { params: { payload } })
            .then(response => response.json())
            .then(comments => {
                let data = comments.data;
                commit('set_comments', data.content)
            }).catch((err) => { console.log(err) })
    },
    updateLike ({ commit }, payload) {
        return Vue.http.patch('/api/content/comments/' + payload.id, { option: payload.option })
            .catch((err) => { console.log(err) })
    },
    getDocumentList ({ commit }, payload) {
        return Vue.http.get('/api/document/all', { params: { payload } })
            .then(response => {
                commit('set_documents', response.data.data.list)
            }).catch((err) => { console.log(err) })
    },
    uploadFilesReq({ commit }, fd, config){
        return Vue.http.post('/api/document/upload', fd, config).catch((err) => { console.log(err) })
    },
    delDocument({ dispatch }, payload) {
        return Vue.http.delete('/api/document/' + payload.id)
        .then(() => {
            dispatch('getDocumentList', { page: payload.page, limit: 8 })
        }).catch((err) => { console.log(err) })
    }
}
