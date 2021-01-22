<template>
    <el-row class="BarChartView">
        <el-col :span="24">
            <el-switch
                v-model="barChartTypeSwitch"
                class="custom-switch"
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
    name: 'BarChartView',
    setup () {
        const dataSet = reactive([
            {
                name: 'A',
                value: 70
            },
            {
                name: 'B',
                value: 130
            },
            {
                name: 'C',
                value: 120
            },
            {
                name: 'D',
                value: 95
            },
            {
                name: 'E',
                value: 170
            },
            {
                name: 'F',
                value: 200
            },
            {
                name: 'G',
                value: 300
            }
        ])
        const barChartTypeSwitch = ref(true)
        const barChartSettings = {
            width: 400,
            height: 400,
            padding: {
                top: 25,
                right: 25,
                bottom: 25,
                left: 25
            },
            rect: {
                color: 'steelblue',
                width: 45,
                columnWidth: 50
            },
            text: {
                color: 'white',
                fontSize: '14px',
                textAnchor: 'middle',
                xAxisFontSize: 9,
                yAxisFontSize: 9,
                dy: '1em'
            },
            tooltip: {
                left: '45%',
                top: '25%'
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

<style lang="scss" src="./styles/BarChartView.scss" scoped></style>
