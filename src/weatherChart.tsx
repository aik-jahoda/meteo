import * as React from "react";
import * as d3 from "d3";
import { Path, CurveFactory } from "d3";

interface WeatherChartProps {
    data: { temp: number, time: number }[];
}

const areaCurveFactory = (y: number, curveFactory: CurveFactory) => {
    return (context: CanvasRenderingContext2D | Path) => new AreaCurveGenerator(context, y, curveFactory);
}

class AreaCurveGenerator implements d3.CurveGenerator {

    private curve = this.curveFactory(this.context);
    private lastPoint = { x: 0, y: 0 }
    private firstPoint = { x: 0, y: 0 }
    private isFirstPoint = true;

    constructor(private context: CanvasRenderingContext2D | Path, private y: number, private curveFactory: CurveFactory) {

    }

    areaStart() {
        this.curve.areaStart();
    }

    areaEnd() {
        this.curve.areaEnd();
    }

    lineStart() {
        this.curve.lineStart();
    }

    lineEnd() {
        this.curve.lineEnd();
        this.context.lineTo(this.lastPoint.x, this.y);
        this.context.lineTo(this.firstPoint.x, this.y);
    }

    point(x: number, y: number) {
        if (this.isFirstPoint) {
            this.context.moveTo(x, this.y);
            this.context.lineTo(x, y);
            this.firstPoint = { x, y };
        }
        this.lastPoint = { x, y };
        this.curve.point(x, y);
        this.isFirstPoint = false;
    }
}

export class WeatherChart extends React.Component<WeatherChartProps, {}> {
    constructor(props: Readonly<WeatherChartProps>) {
        super(props);
    }

    private svgRef = React.createRef<SVGSVGElement>();



    componentDidMount() {
        //this.drawChart();
    }

    componentDidUpdate() {
        //this.drawChart();
    }

    componentWillUnmount() {

    };

    drawChart() {
        if (!this.svgRef.current) {
            return;
        }

        if (this.props.data.length === 0) {
            return;
        }


        const data = this.props.data.map<[number, number]>((x) => [x.time, x.temp])

        const temperatures = this.props.data.map(x => x.temp);

        const svg = d3.select(this.svgRef.current);

        var xScale = d3.scaleTime().domain([data[0][0], data[data.length - 1][0]]).range([100, 500]);
        var yScale = d3.scaleLinear().domain([d3.min(temperatures) || 0, d3.max(temperatures) || 0]).range([200, 0]);

        const lineGenerator = d3.line()
            .x(data => xScale(data[0]))
            .y(data => yScale(data[1]))
            .curve(d3.curveCatmullRom);


        const areaGenerator = d3.line()
            .x(data => xScale(data[0]))
            .y(data => yScale(data[1]))
            .curve(areaCurveFactory(yScale(0), d3.curveCatmullRom));

        svg.append("path")
            .attr("d", areaGenerator(data) || "")
            .attr("color", "lightblue")
            .attr("stroke-width", 0)
            .attr("fill", "lightblue");

        svg.append("path")
            .attr("d", lineGenerator(data) || "")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d[0]);
            })
            .attr('cy', function (d) {
                return yScale(d[1]);
            })
            .attr('r', 2);


        console.log(svg);
        // svg.selectAll("rect")
        //     .data(temperatures)
        //     .enter()
        //     .append("rect")
        //     .attr("x", (_d, i) => i * 1)
        //     .attr("y", 0)
        //     .attr("width", 1)
        //     .attr("height", (d, _i) => d)
        //     .attr("fill", "green");

    }

    render() {

        if (this.props.data.length === 0) {
            return null;
        }


        const data = this.props.data.map<[number, number]>((x) => [x.time, x.temp])

        const temperatures = this.props.data.map(x => x.temp);


        var xScale = d3.scaleTime().domain([data[0][0], data[data.length - 1][0]]).range([100, 500]);
        var temperatureScale = d3.scaleLinear().domain([d3.min(temperatures) || 0, d3.max(temperatures) || 0]).range([200, 0]);
        var temperatureGradientScale = d3.scaleLinear().domain([d3.min(temperatures) || 0, d3.max(temperatures) || 0]).range([100, 0]);

        const lineGenerator = d3.line()
            .x(data => xScale(data[0]))
            .y(data => temperatureScale(data[1]))
            .curve(d3.curveCatmullRom);


        const areaGenerator = d3.line()
            .x(data => xScale(data[0]))
            .y(data => temperatureScale(data[1]))
            .curve(areaCurveFactory(temperatureScale(0), d3.curveCatmullRom));

        const tempPoints = temperatures.map((x, i) => <circle key={i} className="tempPoint" r="2" cx={xScale(i)} cy={temperatureScale(x)}></circle>);
        const tempLabels = temperatures.map((x, i) => <text key={i} className="tempLabel" x={xScale(i)} y={temperatureScale(x)}>{x}</text>);

        // const peaks: typeof data = [];




        return <svg width="760" height="200" id="waveform" ref={this.svgRef}>
            <linearGradient id="my-cool-gradient" x2="0" y2="100%" gradientUnits="userSpaceOnUse" x1="0" y1="0">
                <stop offset={`${temperatureGradientScale(10)}%`} stopColor="red"></stop>
                <stop offset={`${temperatureGradientScale(0)}%`} stopColor="white"></stop>
                <stop offset={`${temperatureGradientScale(-10)}%`} stopColor="blue"></stop>
            </linearGradient>

            <path className="plus" d={areaGenerator(data) || ""}></path>
            <path className="temerature" d={lineGenerator(data) || ""} ></path>
            <line className="zero" y1={temperatureScale(0)} x1={xScale(0)} y2={temperatureScale(0)} x2={xScale(data.length - 1)}></line>
            {tempPoints}
            {tempLabels}
        </svg>
    }
}