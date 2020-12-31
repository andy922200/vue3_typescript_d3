<template>
    <el-row class="home">
        <el-col :span="24" class="logos">
            <img alt="D3 logo" class="logo" src="../../assets/D3Logo.svg">
            <img alt="Vue logo" class="logo" src="../../assets/VueLogo.svg">
            <img alt="TypeScript logo" class="logo" src="../../assets/TypeScriptLogo.svg">
        </el-col>
        <el-col :span="24">
            <el-switch
                v-model="barChartTypeSwitch"
                active-text="Normal Version"
                inactive-text="RWD Version"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeBarChartType"
            >
            </el-switch>
        </el-col>
        <el-col :span="24">
            <div class="barChart"></div>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import {
    ref,
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
        const dataSet = reactive([70, 130, 120, 95, 170, 143, 200, 300])
        const barChartTypeSwitch = ref(true)
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
                width: 40,
                columnWidth: 45
            },
            text: {
                color: 'white',
                fontSize: '14px',
                textAnchor: 'middle',
                dy: '1em'
            },
            maxValue: 500
        }
        const testBarChart = new BarChart(barChartSettings)

        onMounted(() => {
            const barChartDiv = document.querySelector('.barChart')
            testBarChart.clear(barChartDiv)
            testBarChart.defaultDraw(dataSet, '.barChart')
        })

        function changeBarChartType (status: boolean) {
            const barChartDiv = document.querySelector('.barChart')
            testBarChart.clear(barChartDiv)
            if (status) {
                testBarChart.clearRwdListener()
                testBarChart.defaultDraw(dataSet, '.barChart')
            } else {
                testBarChart.rwdDraw(dataSet, '.barChart', barChartDiv)
            }
        }

        return {
            barChartTypeSwitch,
            changeBarChartType
        }
    }
})
</script>

<style lang="scss" src="./styles/Home.scss"></style>
