import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#f3b5a3', '#f7d1a7', '#87c6f2', '#b4b2f9', '#d9cfc3', '#51cc7c'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  d3.select('#africa').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Africa') {
        return '#e77a5c'
      } else {
        return '#f9f4f2'
      }
    })
  })

  d3.select('#asia').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Asia') {
        return '#f09f67'
      } else {
        return '#f9f4f2'
      }
    })
  })

  d3.select('#north-america').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return '#56a8e2'
      } else {
        return '#f9f4f2'
      }
    })
  })

  d3.select('#low-gdp').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 1000) {
        return '#f69c42'
      } else {
        return '#f9f4f2'
      }
    })
  })

  d3.select('#color-by-continent').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', '#f9f4f2')
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('fill', '#eff0e6')
    .attr('y', function(d) {
      return yPositionScale(d.life_expectancy)
    })
    .attr('height', function(d) {
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('x', function(d) {
      return xPositionScale(d.country)
    })
    .on('mouseover', function(d) {
      // Make the circle black
      d3.select(this)
        .transition()
        .duration(200)
      d3.select('#name').text(d.country)
      d3.select('#life').text(d.life_expectancy)
      d3.select('#gdp').text(d.gdp_per_capita)
      d3.select('#info').style('display', 'block')

    })
    .on('mouseout', function(d) {
      // Change the color to the correct color
      d3.select(this)
        .transition()
        .duration(200)
      d3.select('#info').style('display', 'none')
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}