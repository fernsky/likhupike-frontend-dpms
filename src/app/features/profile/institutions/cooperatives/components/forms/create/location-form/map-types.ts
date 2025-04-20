import { Coordinate } from 'ol/coordinate';

export interface MapClickEvent {
  coordinate: Coordinate;
  dragging: boolean;
  frameState: object;
  mapBrowserEvent: {
    map: object;
    originalEvent: MouseEvent;
    pixel: [number, number];
    target: object;
    type: string;
  };
  pixel: [number, number];
  type: 'click';
}
