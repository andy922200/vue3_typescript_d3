import * as d3 from 'd3'

interface Layout{
    width: number;
    height: number;
    padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

interface BarChartSettings extends Layout{
    minValue?: number;
    maxValue: number;
    rect: {
        color: string;
        width: number;
        columnWidth: number;
    };
    text: {
        color: string;
        fontSize: string;
        textAnchor: string;
        dx?: string | number;
        dy: string | number;
    };
}

export class BarChart {
    protected width: BarChartSettings['width'];
    protected height: BarChartSettings['height'];
    protected padding: Layout['padding'];
    protected rect: BarChartSettings['rect'];
    protected text: BarChartSettings['text'];
    protected minValue?: BarChartSettings['minValue'];
    protected maxValue: BarChartSettings['maxValue'];
    protected graphicHeight: number;
    protected gutterWidth: number;

    constructor (settings: BarChartSettings) {
        this.width = settings.width
        this.height = settings.height
        this.padding = settings.padding
        this.rect = settings.rect
        this.text = settings.text
        this.minValue = settings.minValue
        this.maxValue = settings.maxValue ? settings.maxValue : 1
        this.graphicHeight = settings.height - settings.padding.top - settings.padding.bottom
        this.gutterWidth = settings.rect.columnWidth - settings.rect.width
    }

    defaultDraw (dataSet: (Array<number>), dom: string) {
        const _this = this
        const svg = d3.select(dom)
            .append('svg')
            .attr('width', _this.width)
            .attr('height', _this.height)
        svg.selectAll('rect')
            .data(dataSet)
            .enter()
            .append('rect')
            .attr('fill', _this.rect.color)
            .attr('x', function (d, i) {
                return _this.padding.left + i * _this.rect.columnWidth
            })
            .attr('y', function (d) {
                return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue) // 畫面高度扣掉長條圖高度作為繪製長條圖的起點
            })
            .attr('width', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth))
            .attr('height', function (d) {
                return _this.graphicHeight * (Number(d) / _this.maxValue) // 使用maxValue最大值作為畫面高度100%計算該筆資料佔畫面的百分比
            })
        svg.selectAll('text')
            .data(dataSet)
            .enter()
            .append('text')
            .attr('fill', _this.text.color)
            .attr('font-size', _this.text.fontSize)
            .attr('text-anchor', _this.text.textAnchor)
            .attr('x', function (d, i) {
                return _this.padding.left + i * _this.rect.columnWidth
            })
            .attr('y', function (d) {
                return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
            })
            .attr('dx', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth) / 2)
            .attr('dy', _this.text.dy)
            .text(function (d) {
                return d.toString()
            })
    }
}
