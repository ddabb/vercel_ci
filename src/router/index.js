import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/pages/index/index.vue';
import Dynasties from '@/pages/dynasties/dynasties.vue';
import Poets from '@/pages/poets/poets.vue';
import PoetDetail from '@/pages/poetDetail/poetDetail.vue';

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;