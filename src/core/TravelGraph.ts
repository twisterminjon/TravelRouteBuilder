import { CountryNodeClass } from './CountryNodeClass';
import { EdgeClass } from './EdgeClass';
import { Country, Position } from '../types';
import { RouteBlockingService } from '../services/RouteBlockingService';

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
  async connectCountries(sourceId: string, targetId: string): Promise<{ success: boolean; reason?: string }> {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      console.warn('One or both nodes do not exist');
      return { success: false, reason: 'One or both countries do not exist' };
    }

    const existingEdge = Array.from(this.edges.values()).find(
      edge => edge.source === sourceId && edge.target === targetId
    );
    
    if (existingEdge) {
      console.warn('Connection exists');
      return { success: false, reason: 'Connection already exists' };
    }

    if (this.isCycle(sourceId, targetId)) {
        console.warn(`Cannot create cycle! Connection ${sourceId} → ${targetId} would allow infinite travel.`);
        return { success: false, reason: 'Cannot create cycle - would allow infinite travel' };
    }

    // check if route is blocked
    const sourceNode = this.nodes.get(sourceId);
    const targetNode = this.nodes.get(targetId);
    
    if (sourceNode && targetNode) {
        const isBlocked = RouteBlockingService.isRouteBlocked(
        sourceNode.countryData.code, 
        targetNode.countryData.code
        );
        
        if (isBlocked) {
        console.warn(`Route blocked: ${sourceNode.countryData.name} → ${targetNode.countryData.name}`);
        return { success: false, reason: `Route ${sourceNode.countryData.name} → ${targetNode.countryData.name} is blocked by travel restrictions` };
        }
    }

    const newEdge = new EdgeClass(sourceId, targetId);
    this.edges.set(newEdge.id, newEdge);

    console.log(`Route created: ${sourceId} → ${targetId}`);
    return { success: true };
  }

  private isCycle(sourceId: string, targetId: string): boolean {
    return this.hasPath(targetId, sourceId);
  }

  private hasPath(fromId: string, toId: string, visited: Set<string> = new Set()): boolean {
    // if reached the destination - path found
    if (fromId === toId) {
      return true;
    }
  
    // if already visited - avoid infinite recursion
    if (visited.has(fromId)) {
      return false;
    }
  
    visited.add(fromId);
    
    // check all edges recursively
    for (const edge of this.edges.values()) {
      if (edge.source === fromId) {
        if (this.hasPath(edge.target, toId, visited)) {
          return true;
        }
      }
    }
  
    return false;
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

  // serialize to json
  serialize(): any {
    return {
      nodes: Array.from(this.nodes.values()).map(node => node.serialize()),
      edges: Array.from(this.edges.values()).map(edge => edge.serialize()),
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
        nodeCount: this.nodes.size,
        edgeCount: this.edges.size
      }
    };
  }

  // deserialize from json
  static deserialize(data: any): TravelGraph {
    const graph = new TravelGraph();

    if (data.nodes) {
      data.nodes.forEach((nodeData: any) => {
        const node = CountryNodeClass.deserialize(nodeData);
        graph.nodes.set(node.id, node);
      });
    }

    if (data.edges) {
      data.edges.forEach((edgeData: any) => {
        const edge = EdgeClass.deserialize(edgeData);
        graph.edges.set(edge.id, edge);
      });
    }

    console.log(`Graph loaded: ${graph.nodes.size} nodes, ${graph.edges.size} edges`);
    return graph;
  }

  // load data
  loadFromData(data: any): void {
    this.clear();

    if (data.nodes) {
      data.nodes.forEach((nodeData: any) => {
        const node = CountryNodeClass.deserialize(nodeData);
        this.nodes.set(node.id, node);
      });
    }

    if (data.edges) {
      data.edges.forEach((edgeData: any) => {
        const edge = EdgeClass.deserialize(edgeData);
        this.edges.set(edge.id, edge);
      });
    }

    console.log(`Graph reloaded: ${this.nodes.size} nodes, ${this.edges.size} edges`);
  }

  clear(): void {
    this.nodes.clear();
    this.edges.clear();
    console.log('Graph cleared');
  }
}