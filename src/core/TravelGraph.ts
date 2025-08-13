import { CountryNodeClass } from './CountryNodeClass';
import { EdgeClass } from './EdgeClass';
import { Country, Position } from '../types';

export class TravelGraph {
  private nodes: Map<string, CountryNodeClass> = new Map();
  private edges: Map<string, EdgeClass> = new Map();

  // add country
  addCountry(country: Country, position?: Position): CountryNodeClass {
    const nodeId = `country-${Date.now()}`;
    const nodePosition = position || { 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 400 + 100 
    };

    const newNode = new CountryNodeClass(nodeId, nodePosition, country);
    this.nodes.set(nodeId, newNode);

    console.log(`Country added: ${country.name}`);
    return newNode;
  }

  // add edge
  connectCountries(sourceId: string, targetId: string): boolean {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      console.warn('One or both nodes do not exist');
      return false;
    }

    const existingEdge = Array.from(this.edges.values()).find(
      edge => edge.source === sourceId && edge.target === targetId
    );
    
    if (existingEdge) {
      console.warn('Connection exists');
      return false;
    }

    const newEdge = new EdgeClass(sourceId, targetId);
    this.edges.set(newEdge.id, newEdge);

    console.log(`Route created: ${sourceId} → ${targetId}`);
    return true;
  }

  // del node
  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);

    const edgesToDelete = Array.from(this.edges.entries()).filter(
      ([_, edge]) => edge.source === nodeId || edge.target === nodeId
    );

    edgesToDelete.forEach(([edgeId, _]) => {
      this.edges.delete(edgeId);
    });

    console.log(`Node removed: ${nodeId}`);
  }

  // del edge
  removeEdge(edgeId: string): void {
    this.edges.delete(edgeId);
    console.log(`Edge removed: ${edgeId}`);
  }

  // update position
  updateNodePosition(nodeId: string, position: Position): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.updatePosition(position);
    }
  }

  // get all nodes
  getReactFlowNodes(): any[] {
    return Array.from(this.nodes.values()).map(node => node.toReactFlowNode());
  }

  // get all edges
  getReactFlowEdges(): any[] {
    return Array.from(this.edges.values()).map(edge => edge.toReactFlowEdge());
  }

  clear(): void {
    this.nodes.clear();
    this.edges.clear();
    console.log('Graph cleared');
  }
}