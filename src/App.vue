<template>
    <el-container class="el-container-custom">
        <Navbar />
        <router-view />
    </el-container>
</template>

<script lang="ts">
import {
    defineComponent
} from 'vue'
import Navbar from './generalComponents/Navbar.vue'

export default defineComponent({
    name: 'App',
    components: {
        Navbar
    }
})
</script>

<style lang="scss" src="./styles/App.scss"></style>
