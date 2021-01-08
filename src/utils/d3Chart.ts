import * as d3 from 'd3'

interface RawData{
    name: string;
    value: number;
}

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
        xAxisFontSize?: number;
        yAxisFontSize?: number;
    };
}

interface CleanMethods {
    clear: (dom: Element | null) => void;
    clearRwdListener: () => void;
}

export class BarChart implements CleanMethods {
    protected width: number;
    protected height: number;
    protected padding: Layout['padding'];
    protected rect: BarChartSettings['rect'];
    protected text: BarChartSettings['text'];
    protected minValue?: BarChartSettings['minValue'];
    protected maxValue: BarChartSettings['maxValue'];
    protected graphicWidth: number;
    protected graphicHeight: number;
    protected gutterWidth: number;
    protected xAxisFontSize: number
    protected yAxisFontSize: number

    constructor (settings: BarChartSettings) {
        this.width = settings.width ? settings.width : 400
        this.height = settings.height ? settings.height : 400
        this.padding = settings.padding
        this.rect = settings.rect
        this.text = settings.text
        this.minValue = settings.minValue
        this.maxValue = settings.maxValue ? settings.maxValue : 300
        this.graphicWidth = settings.width
            ? settings.width - settings.padding.left - settings.padding.right
            : 400 - settings.padding.left - settings.padding.right
        this.graphicHeight = settings.height
            ? settings.height - settings.padding.top - settings.padding.bottom
            : 400 - settings.padding.top - settings.padding.bottom
        this.gutterWidth = settings.rect.columnWidth && settings.rect.width
            ? settings.rect.columnWidth - settings.rect.width
            : 10
        this.xAxisFontSize = settings.text.xAxisFontSize ? settings.text.xAxisFontSize : 10
        this.yAxisFontSize = settings.text.yAxisFontSize ? settings.text.yAxisFontSize : 10
    }

    defaultDraw (dataSet: (Array<RawData>), dom: string) {
        const _this = this
        const domSelector = d3.select(dom)
        const svg = domSelector.append('svg')
            .attr('width', _this.width)
            .attr('height', _this.height)

        this.generateBars(dataSet, svg)
        this.generateTexts(dataSet, svg)
        this.generateXAxis(dataSet, svg)
        this.generateYAxis(svg)
    }

    rwdDraw (dataSet: (Array<RawData>), dom: string, rwdBarChartDiv: Element | null) {
        const svg = d3.select(dom)
        const width = parseInt(svg.style('width'), 10)
        const height = parseInt(svg.style('height'), 10)
        this.rwdRendering(dom, dataSet, width, height)

        d3.select(window).on('resize', () => {
            const rwdChartWidth = rwdBarChartDiv ? rwdBarChartDiv.getBoundingClientRect().width : 0
            const rwdChartHeight = rwdBarChartDiv ? rwdBarChartDiv.getBoundingClientRect().height : 0

            if (rwdBarChartDiv) {
                if ([...rwdBarChartDiv.childNodes].length !== 0) {
                    this.clear(rwdBarChartDiv)
                    height < rwdChartHeight
                        ? this.rwdRendering(dom, dataSet, rwdChartWidth, height)
                        : this.rwdRendering(dom, dataSet, rwdChartWidth, rwdChartHeight)
                }
            }
        })
    }

    clear (dom: Element | null) {
        if (dom) {
            dom.innerHTML = ''
        }
    }

    clearRwdListener () {
        d3.select(window).on('resize', null)
    }

    private rwdRendering (dom: string, dataSet: (Array<RawData>), width: number, height: number) {
        const domSelector = d3.select(dom)
        const svg = domSelector.append('svg')
            .attr('width', width)
            .attr('height', height)
        this.generateBars(dataSet, svg, width, height)
        this.generateTexts(dataSet, svg, width, height)
        this.generateXAxis(dataSet, svg, width, height)
        this.generateYAxis(svg, width, height)
    }

    private generateBars (dataSet: (Array<RawData>), svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width?: number, height?: number) {
        const _this = this
        const values = dataSet.map(d => d.value)
        const bars = svg.selectAll('rect')
            .data(values)
            .enter()
            .append('rect')
            .attr('fill', _this.rect.color)

        if (width && height) {
            const newGraphicHeight = height - this.padding.bottom - this.padding.top
            bars
                .attr('x', function (d, i) {
                    return _this.padding.left + i * Math.floor((width - _this.padding.left - _this.padding.right) / values.length)
                })
                .attr('y', function (d) {
                    return height - _this.padding.bottom - newGraphicHeight * (Number(d) / _this.maxValue)
                })
                .attr('width', Math.floor((width - (_this.padding.left + _this.padding.right)) * (1 / values.length) - _this.gutterWidth))
                .attr('height', function (d) {
                    return newGraphicHeight * (Number(d) / _this.maxValue)
                })
        } else {
            bars
                .attr('x', function (d, i) {
                    return _this.rect.columnWidth
                        ? _this.padding.left + i * _this.rect.columnWidth
                        : _this.padding.left + i * 60
                })
                .attr('y', function (d) {
                    return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
                })
                .attr('width', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / values.length) - _this.gutterWidth))
                .attr('height', function (d) {
                    return _this.graphicHeight * (Number(d) / _this.maxValue)
                })
        }

        return bars
    }

    private generateTexts (dataSet: (Array<RawData>), svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width?: number, height?: number) {
        const _this = this
        const values = dataSet.map(d => d.value)
        const texts = svg.selectAll('text')
            .data(values)
            .enter()
            .append('text')
            .attr('fill', _this.text.color)
            .attr('font-size', _this.text.fontSize)
            .attr('text-anchor', _this.text.textAnchor)

        if (width && height) {
            const newGraphicHeight = height - this.padding.bottom - this.padding.top
            texts
                .attr('x', function (d, i) {
                    return _this.padding.left + i * Math.floor((width - _this.padding.left - _this.padding.right) / values.length)
                })
                .attr('y', function (d) {
                    return height - _this.padding.bottom - newGraphicHeight * (Number(d) / _this.maxValue)
                })
                .attr('dx', Math.floor((width - (_this.padding.left + _this.padding.right)) * (1 / values.length) - _this.gutterWidth) / 2)
                .attr('dy', _this.text.dy)
                .text(function (d) {
                    return d.toString()
                })
        } else {
            texts
                .attr('x', function (d, i) {
                    return _this.rect.columnWidth
                        ? _this.padding.left + i * _this.rect.columnWidth
                        : _this.padding.left + i * 60
                })
                .attr('y', function (d) {
                    return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
                })
                .attr('dx', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / values.length) - _this.gutterWidth) / 2)
                .attr('dy', _this.text.dy)
                .text(function (d) {
                    return d.toString()
                })
        }

        return texts
    }

    private generateXAxis (dataSet: (Array<RawData>), svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width?: number, height?: number) {
        const names = dataSet.map(d => d.name)
        const xAxis = d3.scaleBand()
            .domain(names)

        width && height
            ? xAxis.range([0, width - this.padding.left - this.padding.right])
            : xAxis.range([0, this.graphicWidth])

        if (width && height) {
            svg.append('g')
                .call(d3.axisBottom(xAxis))
                .attr('transform', `translate(${this.padding.left - 1},${height - this.padding.bottom})`)
                .attr('class', 'x-axis')
                .attr('font-size', this.xAxisFontSize)
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end')
        } else {
            svg.append('g')
                .call(d3.axisBottom(xAxis))
                .attr('transform', `translate(${this.padding.left - 1},${this.height - this.padding.bottom})`)
                .attr('class', 'x-axis')
                .attr('font-size', this.xAxisFontSize)
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end')
        }
    }

    private generateYAxis (svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width?: number, height?: number) {
        const yAxis = d3.scaleLinear()
            .domain([0, this.maxValue])

        width && height
            ? yAxis.range([height - this.padding.bottom - this.padding.top, 0])
            : yAxis.range([this.graphicHeight, 0])

        if (width && height) {
            svg.append('g')
                .call(d3.axisLeft(yAxis))
                .attr('class', 'y-axis')
                .attr('font-size', this.yAxisFontSize)
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('transform', `translate(${this.padding.left - 1},${this.padding.top})`)
        } else {
            svg.append('g')
                .call(d3.axisLeft(yAxis))
                .attr('class', 'y-axis')
                .attr('font-size', this.yAxisFontSize)
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('transform', `translate(${this.padding.left - 1},${this.padding.top})`)
        }
    }
}
