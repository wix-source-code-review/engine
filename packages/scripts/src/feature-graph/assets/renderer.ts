export default function template(data: any) {
    return `<!DOCTYPE html><html>
<head>
    <script>
        data = ${JSON.stringify(data)};
    </script>
    <meta charset="utf-8" />

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v4.js"></script>
    <style>
        /* set the CSS */

        body {
            font: 12px Arial;
        }

        path {
            stroke: steelblue;
            stroke-width: 2;
            fill: none;
        }

        .axis path,
        .axis line {
            fill: none;
            stroke: grey;
            stroke-width: 1;
            shape-rendering: crispEdges;
        }

        div.tooltip {
            position: absolute;
            text-align: center;
            width: 60px;
            height: 28px;
            padding: 2px;
            font: 12px sans-serif;
            background: lightsteelblue;
            border: 0px;
            border-radius: 8px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <!-- Create a div where the graph will take place -->
    <div id="my_dataviz"></div>
    <script>
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 40 },
            width = 1000 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3
            .select('#my_dataviz')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        d3.select('svg')
            .insert('defs', 'g')
            .append('marker')
            .attr('id', 'triangle')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', '1')
            .attr('refY', '5')
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', '10')
            .attr('markerHeight', '10')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 z')
            .attr('fill', '#aaa');

        var div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        const color = (d) => scale(d.group);

        // Initialize the links
            var link = svg
                .selectAll('line')
                .data(data.links)
                .enter()
                .append('line')
                .style('stroke', '#aaa')
                .attr('marker-end', 'url(#triangle)');

            // Initialize the nodes
            var node = svg
                .selectAll('circle')
                .data(data.nodes)
                .enter()
                .append('circle')
                .attr('r', 20)
                .style('fill', (d) => d.group === 0 ? 'white' : color(d))
                .style('stroke', (d) => (d.group === 0 ? 'black' : 'transparent'))
                .on('mouseover', function (d) {
                    div.transition().duration(200).style('opacity', 0.9);
                    div.html(d.name)
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY - 28 + 'px');
                })
                .on('mouseout', function (d) {
                    div.transition().duration(500).style('opacity', 0);
                });
            // Let's list the force we wanna apply on the network
            var simulation = d3
                .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
                .force(
                    'link',
                    d3
                        .forceLink() // This force provides links between nodes
                        .id(function (d) {
                            return d.id;
                        }) // This provide  the id of a node
                        .links(data.links) // and this the list of links
                )
                .force('charge', d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
                .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
                .on('end', ticked);

            // This function is run at each iteration of the force algorithm, updating the nodes position.
            function ticked() {
                link.attr('x1', function (d) {
                    return d.source.x;
                })
                    .attr('y1', function (d) {
                        return d.source.y;
                    })
                    .attr('x2', function (d) {
                        return d.target.x;
                    })
                    .attr('y2', function (d) {
                        return d.target.y;
                    });

                node.attr('cx', function (d) {
                    return d.x + 6;
                }).attr('cy', function (d) {
                    return d.y - 6;
                });
            }
    </script>
</body></html>`;
}
