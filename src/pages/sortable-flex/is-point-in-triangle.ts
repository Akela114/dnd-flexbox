type Dot = {
  x: number;
  y: number;
};

const getTriangleArea = (vertex1: Dot, vertex2: Dot, vertex3: Dot) => {
  return Math.abs((
    vertex1.x * (vertex2.y - vertex3.y) + 
    vertex2.x * (vertex3.y - vertex1.y) + 
    vertex3.x * (vertex1.y - vertex2.y)
  ) / 2);
}

export const isPointInTriangle = (point: Dot, vertex1: Dot, vertex2: Dot, vertex3: Dot) => {
  const areaOrig = getTriangleArea(vertex1, vertex2, vertex3);
  const area1 = getTriangleArea(point, vertex1, vertex2);
  const area2 = getTriangleArea(vertex1, point, vertex3);
  const area3 = getTriangleArea(vertex2, vertex3, point);

  return area1 + area2 + area3 === areaOrig;
}