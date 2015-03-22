var width = 960,
    height = 1160;

//47.61,-122.33.
var projection = d3.geo.albers()
    .center([0, 47.6097])
    .rotate([122.3331, 0])
    //.parallels([47, 48])
    .scale(200000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", move);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .call(zoom);

svg = svg.append("g");

var g = svg;

var lastMove = (new Date).getTime();

function move() {
  var now = (new Date).getTime();
  //if(now - lastMove < 50) {
  //  return;
  //}
  lastMove = now;

  var t = d3.event.translate,
      s = d3.event.scale;
  t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
  t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
  zoom.translate(t);
  g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

var addPath = function(type, classes, name) {
  if(!name) {
    name = type + "s";
  }

d3.json("../data/" + name + ".topojson", function(error, data) {
  if (error) return console.error(error);

  console.log(type, data);

  //console.log(data.objects[type + "s"]);
  console.log(name, data.objects[name]);
  console.log(data.objects['contour.100']);

  data = topojson.feature(data, data.objects[name]);
  //var streets = data;
  var g = svg.append("g").attr("id", type);

  var paths = g.selectAll("." + type)
    .data(data.features)
    .enter().append("path")
    .attr("class", function(d) {
      var classList = [type];
      if(classes) {
        classes.forEach(function(c) {
          classList.push(d.properties[c]);
        })
      }
      return classList.join(" ");
    })
    .attr("d", path);

});
};

addPath("park");
addPath("street");
//addPath("contour-100", [], "contour-100");
addPath("stream");
//addPath("shoreline", ["type", "feature"]);
//addPath("tree");
