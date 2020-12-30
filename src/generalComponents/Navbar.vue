<template>
    <el-row class="nav">
        <el-col :span="24">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import {
    defineComponent
} from 'vue'

export default defineComponent({
    name: 'Navbar'
})
</script>

<style lang="scss" scope src="./styles/Navbar.scss"></style>
