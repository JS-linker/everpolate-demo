const { linear } = require("everpolate");

const getRandomNum = (min, max) =>
  Math.ceil(Math.random() * (max - min + 1) + min - 1);

const getXYByUnNull = (array) => {
  // reutrn [xArray, yArray]
  return array
    .map((y, x) => y !== null && [y, x])
    .filter((y) => y !== false)
    .reduce(
      (o, [y, x]) => {
        o[0].push(x);
        o[1].push(y);
        return o;
      },
      [[], []]
    );
};

const getXofUnknowY = (array) => {
  return array.map((y, x) => y === null && x).filter((y) => y !== false);
};

const slice = (array, start, end) => {
  let rs = array.slice(start, end);
  if (rs[0] === null) {
    start--;
    while (start > -1) {
      const i = array[start];
      rs.unshift(i);
      if (i !== null) {
        break;
      }
      start--;
    }
  }
  if (rs[rs.length - 1] === null) {
    while (end < array.length) {
      const i = array[end];
      rs.push(i);
      if (i !== null) {
        break;
      }
      end++;
    }
  }
  return [start, end, rs];
};

// ========= full start ====================================================================
// const originalXY = Array.from({ length: 100 }).map((_) => getRandomNum(30, 200));
const originalXY = [
  66,
  null,
  157,
  null,
  81,
  null,
  131,
  80,
  null,
  null,
  null,
  49,
  null,
  75,
  87,
  179,
  90,
  175,
  73,
  185,
  null,
  63,
  null,
  91,
  null,
  null,
  38,
  null,
  191,
  null,
  37,
  78,
  31,
  135,
  142,
  187,
  80,
  100,
  null,
  117,
  198,
  null,
  null,
  148,
  null,
  null,
  71,
  41,
  null,
  null,
  null,
  null,
  null,
  179,
  null,
  137,
  null,
  null,
  185,
  null,
  null,
  null,
  null,
  39,
  30,
  135,
  null,
  35,
  60,
  40,
  157,
  null,
  41,
  184,
  131,
  119,
  170,
  109,
  null,
  null,
  194,
  105,
  45,
  139,
  null,
  150,
  200,
  null,
  174,
  47,
  null,
  null,
  77,
  null,
  null,
  null,
  195,
  144,
  177,
  null,
];
const xOfUnkonwY = getXofUnknowY(originalXY);
const [xs, ys] = getXYByUnNull(originalXY);

const mockY = linear(xOfUnkonwY, xs, ys);
/**
[
               111.5,                119,                106,
               72.25,               64.5,              56.75,
                  62,                124,                 77,
   73.33333333333337, 55.666666666666686,              114.5,
                 114,              108.5, 181.33333333333337,
  164.66666666666674, 122.33333333333326,  96.66666666666674,
                  64,                 87,                110,
                 133,                156,                158,
                 153,                169, 155.79999999999995,
  126.59999999999991,  97.39999999999986,  68.20000000000005,
                  85,                 99, 137.33333333333348,
  165.66666666666652,              144.5,                187,
                  57,                 67,              106.5,
                 136,              165.5,                210
]
 */
const mergeMockY = (waitMergeArray, xOfUnkonwY, mockY) => {
  xOfUnkonwY.forEach((xi, yi) => (waitMergeArray[xi] = Math.round(mockY[yi])));
  return waitMergeArray;
};
const mergeY = mergeMockY([...originalXY], xOfUnkonwY, mockY);
console.log(originalXY);
// ========= full end ====================================================================

// ========= part 1 ======================================================================
let p1Start = 10,
  p1End = 25;
const [_s, _e, originalXYP1] = slice(originalXY, p1Start, p1End);

p1Start = _s;
p1End = _e;

const unknowXofP1 = getXofUnknowY(originalXYP1);
const [xsOfP1, ysOfP1] = getXYByUnNull(originalXYP1);

const mockYofP1 = linear(unknowXofP1, xsOfP1, ysOfP1);
const mergeYofP1 = mergeMockY([...originalXYP1], unknowXofP1, mockYofP1);
console.log(originalXYP1);
console.log("real full y slice part", mergeY.slice(p1Start, p1End + 1));
console.log("mock y part", mergeYofP1);
// ========= part 1 ======================================================================

// ======== draw chart ???

const xyToLineSet = (array, offsetX = 0, offsetY = 0) => {
  return array.map((y, x) => [x + offsetX, y + offsetY]);
};

const fs = require("fs");
const JSDOM = require("jsdom").JSDOM;
const jsdom = new JSDOM('<body><div id="container"></div></body>', {
  runScripts: "dangerously",
});
const window = jsdom.window;

// require anychart and anychart export modules
const anychart = require("anychart")(window);
const anychartExport = require("anychart-nodejs")(anychart);

// create and a chart to the jsdom window.
// chart creating should be called only right after anychart-nodejs module requiring
const chart = anychart.line();

const seriesY = chart.line(xyToLineSet(mergeY.slice(p1Start, p1End + 1)));
const seriesYofP1 = chart.line(xyToLineSet(mergeYofP1));

seriesY.name("original xy mock part");

seriesY.markers(true);
seriesY.stroke({ color: "#64b5f6", thickness: 8 });
seriesY.labels().enabled(true);

seriesYofP1.name("split xy mock part");
seriesYofP1.labels().enabled(true);
seriesYofP1.stroke({ color: "#000", thickness: 2 });
seriesYofP1.markers(true);

chart.legend().enabled(true);

chart.bounds(0, 0, 800, 600);
chart.container("container");
chart.draw();

// generate and save it to a file
anychartExport.exportTo(chart, "pdf").then(
  function (image) {
    fs.writeFile(`preview.pdf`, image, function (fsWriteError) {
      if (fsWriteError) {
        console.log(fsWriteError);
      } else {
        console.log("Complete");
      }
    });
  },
  function (generationError) {
    console.log(generationError);
  }
);
