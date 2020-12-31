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
        const _this = this
        const domSelector = d3.select(dom)
        const svg = domSelector.append('svg')
            .attr('width', _this.width)
            .attr('height', _this.height)

        this.generateBars(dataSet, svg)
        this.generateTexts(dataSet, svg)
    }

    rwdDraw (dataSet: (Array<number>), dom: string, rwdBarChartDiv: Element | null) {
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

    private rwdRendering (dom: string, dataSet: (Array<number>), width: number, height: number) {
        const domSelector = d3.select(dom)
        const svg = domSelector.append('svg')
            .attr('width', width)
            .attr('height', height)
        this.generateBars(dataSet, svg, width, height)
        this.generateTexts(dataSet, svg, width, height)
    }

    private generateBars (dataSet: (Array<number>), svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width?: number, height?: number) {
        const _this = this

        if (width && height) {
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
        } else {
            svg.selectAll('rect')
                .data(dataSet)
                .enter()
                .append('rect')
                .attr('fill', _this.rect.color)
                .attr('x', function (d, i) {
                    return _this.rect.columnWidth
                        ? _this.padding.left + i * _this.rect.columnWidth
                        : _this.padding.left + i * 60
                })
                .attr('y', function (d) {
                    return _this.height - _this.padding.bottom - _this.graphicHeight * (Number(d) / _this.maxValue)
                })
                .attr('width', Math.floor((_this.width - (_this.padding.left + _this.padding.right)) * (1 / dataSet.length) - _this.gutterWidth))
                .attr('height', function (d) {
                    return _this.graphicHeight * (Number(d) / _this.maxValue)
                })
        }
    }

    private generateTexts (dataSet: (Array<number>), svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width?: number, height?: number) {
        const _this = this

        if (width && height) {
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
        } else {
            svg.selectAll('text')
                .data(dataSet)
                .enter()
                .append('text')
                .attr('fill', _this.text.color)
                .attr('font-size', _this.text.fontSize)
                .attr('text-anchor', _this.text.textAnchor)
                .attr('x', function (d, i) {
                    return _this.rect.columnWidth
                        ? _this.padding.left + i * _this.rect.columnWidth
                        : _this.padding.left + i * 60
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
}
