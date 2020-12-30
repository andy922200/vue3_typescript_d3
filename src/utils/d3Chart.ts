import * as d3 from 'd3'

interface Layout{
    width?: number;
    height?: number;
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
        width?: number;
        columnWidth?: number;
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
    protected width: number;
    protected height: number;
    protected padding: Layout['padding'];
    protected rect: BarChartSettings['rect'];
    protected text: BarChartSettings['text'];
    protected minValue?: BarChartSettings['minValue'];
    protected maxValue: BarChartSettings['maxValue'];
    protected graphicHeight: number;
    protected gutterWidth: number;

    constructor (settings: BarChartSettings) {
        this.width = settings.width ? settings.width : 400
        this.height = settings.height ? settings.height : 400
        this.padding = settings.padding
        this.rect = settings.rect
        this.text = settings.text
        this.minValue = settings.minValue
        this.maxValue = settings.maxValue ? settings.maxValue : 300
        this.graphicHeight = settings.height
            ? settings.height - settings.padding.top - settings.padding.bottom
            : 400 - settings.padding.top - settings.padding.bottom
        this.gutterWidth = settings.rect.columnWidth && settings.rect.width
            ? settings.rect.columnWidth - settings.rect.width
            : 10
    }

    defaultDraw (dataSet: (Array<number>), dom: string) {
        const _this = this // 取得 constructor 生成的預設資料
        const svg = d3.select(dom) // select 來選取 dom
            .append('svg') // 在選取的 dom 位置後，加上 <svg>
            .attr('width', _this.width) // 給定 svg 的寬度
            .attr('height', _this.height) // 給定 svg 的高度
        svg.selectAll('rect') // 預先設定 selectAll 選取所有生成的 <rect>
            .data(dataSet) // 給予 <rect> 資料
            .enter() // 放置到畫面上
            .append('rect') // 每個標籤為 <rect>
            .attr('fill', _this.rect.color) // 給長條圖上色
            .attr('x', function (d, i) { // 每個長條圖的水平位置
                return _this.rect.columnWidth
                    ? _this.padding.left + i * _this.rect.columnWidth
                    : _this.padding.left + i * 60
            })
            .attr('y', function (d) { // 每個長條圖的高度，用 畫面高度扣掉長條圖高度 as 長條圖的起點
                return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
            })
            .attr('width', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth))
            .attr('height', function (d) {
                return _this.graphicHeight * (Number(d) / _this.maxValue) // 使用 maxValue 作為畫面高度 100%，從而計算高度百分比
            })
        svg.selectAll('text')
            .data(dataSet)
            .enter()
            .append('text')
            .attr('fill', _this.text.color)
            .attr('font-size', _this.text.fontSize) // 設定字體大小
            .attr('text-anchor', _this.text.textAnchor) // 設定字的對齊模式
            .attr('x', function (d, i) {
                return _this.rect.columnWidth
                    ? _this.padding.left + i * _this.rect.columnWidth
                    : _this.padding.left + i * 60
            })
            .attr('y', function (d) {
                return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
            })
            .attr('dx', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth) / 2) // 第二個字和第一個字的相對水平位置
            .attr('dy', _this.text.dy) // 第二個字和第一個字的相對垂直位置
            .text(function (d) {
                return d.toString()
            })
    }

    rwdDraw (dataSet: (Array<number>), dom: string, rwdBarChartDiv: Element | null) {
        // 初始值
        const svg = d3.select(dom)
        const width = parseInt(svg.style('width'), 10)
        const height = parseInt(svg.style('height'), 10)
        this.rwdRendering(dom, dataSet, width, height)

        // 監聽畫面，由畫面傳回 dom 的資訊
        d3.select(window).on('resize', () => {
            const rwdChartWidth = rwdBarChartDiv ? rwdBarChartDiv.getBoundingClientRect().width : 0
            const rwdChartHeight = rwdBarChartDiv ? rwdBarChartDiv.getBoundingClientRect().height : 0

            if (rwdBarChartDiv) {
                // 如果渲染的 dom 內已經有其他節點了，那就先將其清除
                if ([...rwdBarChartDiv.childNodes].length !== 0) {
                    rwdBarChartDiv.innerHTML = ''
                    // 如果初始的高度小於目前 dom 的高度，那就用初始的畫面高度就好
                    height < rwdChartHeight
                        ? this.rwdRendering(dom, dataSet, rwdChartWidth, height)
                        : this.rwdRendering(dom, dataSet, rwdChartWidth, rwdChartHeight)
                }
            }
        })
    }

    private rwdRendering (dom: string, dataSet: (Array<number>), width: number, height: number) {
        const _this = this
        const domSelector = d3.select(dom)
        const svg = domSelector.append('svg')
            .attr('width', width)
            .attr('height', height)
        svg.selectAll('rect')
            .data(dataSet)
            .enter()
            .append('rect')
            .attr('fill', _this.rect.color)
            .attr('x', function (d, i) {
                return _this.padding.left + i * Math.floor((width - _this.padding.left - _this.padding.right) / dataSet.length)
            })
            .attr('y', function (d) {
                return height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
            })
            .attr('width', Math.floor((width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth))
            .attr('height', function (d) {
                return _this.graphicHeight * (Number(d) / _this.maxValue)
            })
        svg.selectAll('text')
            .data(dataSet)
            .enter()
            .append('text')
            .attr('fill', _this.text.color)
            .attr('font-size', _this.text.fontSize)
            .attr('text-anchor', _this.text.textAnchor)
            .attr('x', function (d, i) {
                return _this.padding.left + i * Math.floor((width - _this.padding.left - _this.padding.right) / dataSet.length)
            })
            .attr('y', function (d) {
                return height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
            })
            .attr('dx', Math.floor((width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth) / 2)
            .attr('dy', _this.text.dy)
            .text(function (d) {
                return d.toString()
            })
    }
}
