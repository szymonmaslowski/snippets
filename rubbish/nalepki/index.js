const factor = 2;
const height = 297;
const width = 210;
const mmInPx = 11.8114478114;

const getScaled = size => size * factor;
const mmToPx = mm => getScaled(mm * mmInPx);

const c = document.querySelector("canvas");
c.height = mmToPx(height);
c.width = mmToPx(width);

const ctx = c.getContext("2d");
ctx.font = `${mmToPx(6)}px Dancing Script`;
ctx.fillStyle = "$000";
ctx.textBaseline = "middle";
ctx.lineWidth = 2;
ctx.strokeStyle = "#a9a9a9";

const drawLine = (from, to) => {
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0], to[1]);
  ctx.stroke();
};

const itemHeight = mmToPx(10);
const itemMargins = mmToPx(3);

const getItemWidth = text => 2260.45856514305; //itemMargins * 2 + ctx.measureText(text).width;

const drawItem = (text, point) => {
  // drawLine(
  //   [point[0] + itemMargins, point[1]],
  //   [point[0] + itemMargins / 2 + mmToPx(10), point[1]],
  // );
  drawLine(
    [point[0] + itemMargins, point[1] + itemHeight],
    [point[0] + itemMargins / 2 + mmToPx(10), point[1] + itemHeight],
  );
  drawLine(
    [point[0] + getItemWidth(text), point[1]],
    [point[0] + getItemWidth(text), point[1] + itemHeight / 2],
  );
  drawLine(
    [point[0], point[1]],
    [point[0], point[1] + itemHeight / 2],
  );
  const factorCentringTextInTheItem = 0; //mmToPx(0.3);
  ctx.fillText(
    text,
    point[0] + itemMargins,
    point[1] + itemHeight / 2 + factorCentringTextInTheItem,
  );
};

const texts = [
  'Rodzice',
  'Rodzice',
  'Anna Masłowska, Rafał Okaz',
  'Babcia Anastazja',
  'Babcia Stefania',
  'Lucyna i Stanisław Szatko',
  'Barbara i Andrzej Masłowscy',
  'Małgorzata i Leopold Mikuła',
  'Sabina i Paweł Drozd',
  'Renata Makuch, Kamil Tomaszek',
  'Michał Czapkowicz z osobą towarzyszącą',
  'Magdalena, Mikołaj i Jowita Pacura',
  'Tomasz Pacura z osobą towarzyszącą',
  'Iza Pacura z osobą towarzyszącą',
  'Anna, Daniel, Wiktoria i Wioletta Pagos',
  'Beata i Jacek Kiełbasa',
  'Mariola Król, Kamil Kiełbasa',
  'Karolina Król, Radosław Wojtuła',
  'Ewa i Jan Król',
  'Lucyna i Mariusz Madej',
  'Maria i Antoni Król',
  'Żaneta i Łukasz Drypczak',
  'Patrycja i Mateusz Dziura',
  'Sylwia Sereda i Maciej Gusiew',
  'Dorota Samek i Marcin Jopek',
  'Aleksandra Słomska z osobą towarzyszącą',
  'Jadwiga i Tomasz Bogacz',
  'Justyna i Adrian Taraszka',
];

const offset = mmToPx(2);
let nextPoint = [null, null];
let maxWidth = 0;

const getCurrentPoint = (text, [x, y]) => {
  const enoughSpace = x + getItemWidth(text) < mmToPx(width);
  maxWidth = getItemWidth(text) > maxWidth ? getItemWidth(text) : maxWidth;
  return x === null && y === null ? [offset, offset] : [
    enoughSpace ? x : offset,
    enoughSpace ? y : y + itemHeight,
  ];
};

const getNextPoint = (text, [x, y]) => [x + getItemWidth(text), y];

setTimeout(() => {
  texts.forEach((text, index) => {
    console.log(index, text);
    const currentPoint = getCurrentPoint(text, nextPoint);
    drawItem(text, currentPoint);
    nextPoint = getNextPoint(text, currentPoint);
  });

  document.querySelector("img").src = c.toDataURL("image/png");

  console.log(maxWidth);
}, 3000);
