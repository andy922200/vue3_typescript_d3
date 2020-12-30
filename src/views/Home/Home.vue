<template>
    <el-row class="home">
        <el-col :span="24" class="logos">
            <img alt="D3 logo" class="logo" src="../../assets/D3Logo.svg">
            <img alt="Vue logo" class="logo" src="../../assets/VueLogo.svg">
            <img alt="TypeScript logo" class="logo" src="../../assets/TypeScriptLogo.svg">
        </el-col>
        <el-col :span="24">
            <div class="barChart"></div>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import {
    reactive,
    onMounted,
    defineComponent
} from 'vue'
import {
    BarChart
} from '../../utils/d3Chart'

export default defineComponent({
    name: 'Home',
    setup () {
        const dataSet = reactive([70, 130, 120, 95, 170, 143])
        const barChartSettings = {
            width: 400,
            height: 400,
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            rect: {
                color: 'steelblue',
                width: 50,
                columnWidth: 60
            },
            text: {
                color: 'white',
                fontSize: '14px',
                textAnchor: 'middle',
                dy: '1em'
            },
            maxValue: 300
        }
        const barChartSettingsRWD = {
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            rect: {
                color: 'steelblue'
            },
            text: {
                color: 'white',
                fontSize: '14px',
                textAnchor: 'middle',
                dy: '1em'
            },
            maxValue: 300
        }
        onMounted(() => {
            const barChartDiv = document.querySelector('.barChart')
            const testBarChart = new BarChart(barChartSettingsRWD)
            testBarChart.rwdDraw(dataSet, '.barChart', barChartDiv)
        })
    }
})
</script>

<style lang="scss" src="./styles/Home.scss"></style>
