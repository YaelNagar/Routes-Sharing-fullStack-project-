import { isPointInsidePolygon } from '../src/app/functions/areaChoosingFunctions';

describe('isPointInsidePolygon', () => {
  it('should return true for a point inside the polygon', () => {
    const point = { lat: 3, lng: 3 };
    const polygon = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 5 },
      { lat: 5, lng: 5 },
      { lat: 5, lng: 0 },
    ];
    expect(isPointInsidePolygon(point, polygon)).toBe(true);
  });

  it('should return false for a point outside the polygon', () => {
    const point = { lat: 6, lng: 6 };
    const polygon = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 5 },
      { lat: 5, lng: 5 },
      { lat: 5, lng: 0 },
    ];
    expect(isPointInsidePolygon(point, polygon)).toBe(false);
  });

  it('should return false for a point on the edge of the polygon', () => {
    const point = { lat: 0, lng: 2.5 };
    const polygon = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 5 },
      { lat: 5, lng: 5 },
      { lat: 5, lng: 0 },
    ];
    expect(isPointInsidePolygon(point, polygon)).toBe(false); // תלוי אם מחשיבים נקודה על הקצה כ"פנימית"
  });

  it('should handle complex polygons correctly', () => {
    const point = { lat: 2, lng: 2 };
    const polygon = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 5 },
      { lat: 2.5, lng: 2.5 },
      { lat: 5, lng: 5 },
      { lat: 5, lng: 0 },
    ];
    expect(isPointInsidePolygon(point, polygon)).toBe(true);
  });
}); 