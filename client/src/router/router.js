import Vue from 'vue'
import Router from 'vue-router'

/** front */
const Dashboard = resolve => require(['@/layout/front/index'], resolve)
const CreaterCenter = resolve => require(['@/page/CreaterCenter'], resolve)
const Home = resolve => require(['@/page/Home'], resolve)
const Articles = resolve => require(['@/page/Articles'], resolve)
const article = resolve => require(['@/page/article'], resolve)
const SearchResult = resolve => require(['@/page/SearchResult'], resolve)
const contact = resolve => require(['@/page/contact'], resolve)
const Documents = resolve => require(['@/page/Documents'], resolve)
const document = resolve => require(['@/page/document'], resolve)
/** back */
const Blogadmin = resolve => require(['@/layout/back/admin'], resolve)
const Bloglogin = resolve => require(['@/page/blog-manage/login'], resolve)
const Blogposts = resolve => require(['@/page/blog-manage/posts'], resolve)
const Blogeditor = resolve => require(['@/page/blog-manage/editor'], resolve)
const Blogdrafts = resolve => require(['@/page/blog-manage/drafts'], resolve)
const Blogsearch = resolve => require(['@/page/blog-manage/search'], resolve)
const Blogaccount = resolve => require(['@/page/blog-manage/account'], resolve)

/** music app */
const CloudMusic = resolve => require(['@/page/CloudMusic'], resolve)
const Discovery = () => import(/* webpackChunkName: "Discovery" */ '@/page/discovery')
const PlaylistDetail = () => import(/* webpackChunkName: "PlaylistDetail" */ '@/page/playlist-detail')
const Playlists = () => import(/* webpackChunkName: "Playlists" */ '@/page/playlists')
const Songs = () => import(/* webpackChunkName: "Songs" */ '@/page/songs')
const Search = () => import(/* webpackChunkName: "Search" */ '@/page/search')
const SearchSongs = () => import(/* webpackChunkName: "SearchSongs" */ '@/page/search/songs')
const SearchPlaylists = () => import(/* webpackChunkName: "SearchPlaylists" */ '@/page/search/playlists')
const SearchMvs = () => import(/* webpackChunkName: "SearchMvs" */ '@/page/search/mvs')
const Mvs = () => import(/* webpackChunkName: "Mvs" */ '@/page/mvs')
const Mv = () => import(/* webpackChunkName: "Mv" */ '@/page/mv')

///////////////////// test ///////////////

// 内容需要居中的页面
export const layoutCenterNames = ['discovery', 'playlists', 'songs', 'mvs']

// 需要显示在侧边栏菜单的页面
export const menuRoutes = [
    {
        path: '/discovery',
        name: 'discovery',
        component: Discovery,
        meta: {
            title: '发现音乐',
            icon: 'music',
        },
    },
    {
        path: '/playlists',
        name: 'playlists',
        component: Playlists,
        meta: {
            title: '推荐歌单',
            icon: 'playlist-menu',
        }
    },
    {
        path: '/songs',
        name: 'songs',
        component: Songs,
        meta: {
            title: '最新音乐',
            icon: 'yinyue',
        },
    },
    {
        path: '/mvs',
        name: 'mvs',
        component: Mvs,
        meta: {
            title: '最新MV',
            icon: 'mv',
        },
    },
]

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        redirect: 'home',
        component: Dashboard,
        children: [
            { path: 'home', name: 'home', component: Home, meta: { title: '博客首页' } },
            { path: 'creaters', name: 'CreaterCenter', component: CreaterCenter, meta: { title: '创作中心' } },
            { path: 'articles', name: 'articles', component: Articles, meta: { title: '博客中心' } },
            { path: 'articles/:id', name: 'article', component: article },
            { path: 'contact', name: 'contact', component: contact, meta: { title: '联系站长' } },
            { path: 'searcharticles/:text', name: 'SearchResult', component: SearchResult, meta: { title: '搜索结果' } },
            { path: 'documents', name: 'documents', component: Documents, meta: { title: '文档中心' } }
        ]
    },
    {
        path: '/cloudmusic',
        redirect: 'discovery',
        component: CloudMusic,
        meta: {
            title: '云音乐'
        },
        children: [
            ...menuRoutes,
            {
                path: '/playlist/:id',
                name: 'playlist',
                component: PlaylistDetail,
            },
            {
                path: '/mv/:id',
                name: 'mv',
                component: Mv,
                props: (route) => ({ id: +route.params.id }),
            },
            {
                path: '/search/:keywords',
                name: 'search',
                component: Search,
                props: true,
                children: [
                    {
                        path: '/',
                        redirect: 'songs',
                    },
                    {
                        path: 'songs',
                        name: 'searchSongs',
                        component: SearchSongs,
                    },
                    {
                        path: 'playlists',
                        name: 'searchPlaylists',
                        component: SearchPlaylists,
                    },
                    {
                        path: 'mvs',
                        name: 'searchMvs',
                        component: SearchMvs,
                    },
                ],
            }
        ]
    },
    {
        path: '/document',
        name: 'document',
        component: document,
        meta: { title: '文档预览' }
    },
    {
        path: '/login',
        name: 'login',
        component: Bloglogin,
        meta: { title: '登录页面' }
    },
    {
        path: '/admin',
        redirect: '/admin/posts',
        component: Blogadmin,
        children: [
            { path: 'posts', name: 'posts', component: Blogposts, meta: { requireAuth: true, title: '博客文章' } },
            { path: 'editor', name: 'editor', component: Blogeditor, meta: { requireAuth: true, title: '编辑文章' } },
            { path: 'drafts', name: 'drafts', component: Blogdrafts, meta: { requireAuth: true, title: '博客草稿' } },
            { path: 'blogsearch', name: 'blogsearch', component: Blogsearch, meta: { requireAuth: true, title: '搜索结果' } },
            { path: 'account', name: 'account', component: Blogaccount, meta: { requireAuth: true, title: '修改账户' } }
        ]
    }
    ],
})
