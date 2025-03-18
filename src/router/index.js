import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/pages/index/index.vue';
import Dynasties from '@/pages/dynasties/dynasties.vue';
import Poets from '@/pages/poets/poets.vue';
import PoetDetail from '@/pages/poetDetail/poetDetail.vue';
import Photos from '@/pages/photos/photos.vue';
import Ideas from '@/pages/ideas/ideas.vue';
import OfficialAccount from '@/pages/officialAccount/officialAccount.vue';
import Tools from '@/pages/tools/tools.vue';
import Games from '@/pages/games/games.vue';
import Poetry from '@/pages/poetry/poetry.vue';
import aboutUs from '@/pages/aboutUs/aboutUs.vue';
import contactUs from '@/pages/contactUs/contactUs.vue';
const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/dynasties',
        name: 'Dynasties',
        component: Dynasties
    },
    {
        path: '/dynasties/:dynasty',
        name: 'Poets',
        component: Poets
    },
    {
        path: '/dynasties/:dynasty/:poetName',
        name: 'PoetDetail',
        component: PoetDetail
    },
    {
        path: '/photos',
        name: 'Photos',
        component: Photos
    },
    {
        path: '/ideas',
        name: 'Ideas',
        component: Ideas
    },
    {
        path: '/officialAccount',
        name: 'OfficialAccount',
        component: OfficialAccount
    },
    {
        path: '/tools',
        name: 'Tools',
        component: Tools
    },
    {
        path: '/games',
        name: 'Games',
        component: Games
    },
    {
        path: '/poetry',
        name: 'Poetry',
        component: Poetry
    }
    ,
    {
        path: '/contactUs',
        name: 'contactUs',
        component: contactUs
    }
    ,
    {
        path: '/aboutUs',
        name: 'aboutUs',
        component: aboutUs
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;