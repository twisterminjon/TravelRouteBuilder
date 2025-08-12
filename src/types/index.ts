export interface Country {
    name: string;
    code: string;
    flag: string;
  }
  
  export interface Position {
    x: number;
    y: number;
  }
  
  export interface RouteNode {
    id: string;
    type: string;
    position: Position;
    data: any;
  }