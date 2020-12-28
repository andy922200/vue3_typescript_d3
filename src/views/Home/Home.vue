<template>
    <div class="home">
        <img alt="Vue logo" src="../../assets/logo.png">
        <div class="barChart"></div>
    </div>
</template>

<script lang="ts">
import {
    reactive,
    onMounted,
    defineComponent
} from 'vue'
import * as d3 from 'd3'

export default defineComponent({
    name: 'Home',
    setup () {
        const dataSet = reactive([70, 130, 120, 95, 80, 170, 143])
        const barChartSettings = {
            width: 400,
            height: 400,
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            rectStep: 35,
            rectWidth: 30,
            maxValue: 200
        }
        const graphicHeight = barChartSettings.height - barChartSettings.padding.top - barChartSettings.padding.bottom

        onMounted(() => {
            const svg = d3.select('.barChart')
                .append('svg')
                .attr('width', barChartSettings.width)
                .attr('height', barChartSettings.height)

            svg.selectAll('rect')
                .data(dataSet)
                .enter()
                .append('rect')
                .attr('fill', 'steelblue')
                .attr('x', function (d, i) {
                    return barChartSettings.padding.left + i * barChartSettings.rectStep
                })
                .attr('y', function (d) {
                    return barChartSettings.height - barChartSettings.padding.bottom - graphicHeight * (d / barChartSettings.maxValue) // 畫面高度扣掉長條圖高度作為繪製長條圖的起點
                })
                .attr('width', barChartSettings.rectWidth)
                .attr('height', function (d) {
                    return graphicHeight * (d / barChartSettings.maxValue) // 使用maxValue最大值作為畫面高度100%計算該筆資料佔畫面的百分比
                })
            svg.selectAll('text')
                .data(dataSet)
                .enter()
                .append('text')
                .attr('fill', 'white')
                .attr('font-size', '14px')
                .attr('text-anchor', 'middle')
                .attr('x', function (d, i) {
                    return barChartSettings.padding.left + i * barChartSettings.rectStep
                })
                .attr('y', function (d) {
                    // return height - padding.bottom - d
                    return barChartSettings.height - barChartSettings.padding.bottom - graphicHeight * (d / barChartSettings.maxValue)
                })
                .attr('dx', barChartSettings.rectWidth / 2)
                .attr('dy', '1em')
                .text(function (d) {
                    return d
                })
        })
    }
})
</script>
