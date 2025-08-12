import { Position, Country } from '../types';

export class CountryNodeClass {
  public id: string;
  public position: Position;
  public countryData: Country;

  constructor(id: string, position: Position, countryData: Country) {
    this.id = id;
    this.position = position;
    this.countryData = countryData;
  }

  toReactFlowNode() {
    return {
      id: this.id,
      type: 'countryNode',
      position: this.position,
      data: this.countryData
    };
  }

  //  ( drag & drop)
  updatePosition(newPosition: Position) {
    this.position = newPosition;
  }
}
