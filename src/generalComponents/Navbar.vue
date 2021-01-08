<template>
    <el-row class="nav">
        <el-col :span="24">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link> |
            <router-link to="/bar-chart-view">BarChartView</router-link>
        </el-col>
        <el-col :span="24" class="logos">
            <img alt="D3 logo" class="logo" src="../assets/D3Logo.svg">
            <img alt="Vue logo" class="logo" src="../assets/VueLogo.svg">
            <img alt="TypeScript logo" class="logo" src="../assets/TypeScriptLogo.svg">
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
