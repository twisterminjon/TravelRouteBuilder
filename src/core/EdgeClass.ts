export class EdgeClass {
    public id: string;
    public source: string;
    public target: string;
    public type: string;
  
    constructor(source: string, target: string, type: string = 'smoothstep') {
      this.id = `edge-${source}-${target}`;
      this.source = source;
      this.target = target;
      this.type = type;
    }

    toReactFlowEdge() {
      return {
        id: this.id,
        source: this.source,
        target: this.target,
        type: this.type,
        animated: false,
        style: { stroke: '#ccc', strokeWidth: 1 }
      };
    }

    serialize(): any {
      return {
        id: this.id,
        source: this.source,
        target: this.target,
        type: this.type
      };
    }

    static deserialize(data: any): EdgeClass {
      return new EdgeClass(data.source, data.target, data.type);
    }
  }