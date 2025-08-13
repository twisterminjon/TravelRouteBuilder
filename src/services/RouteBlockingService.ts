export class RouteBlockingService {
    private static blockedRoutes: Set<string> = new Set();
    private static loaded = false;
  
    // load blocked routes from json
    static async loadBlockedRoutes(): Promise<void> {
      if (this.loaded) return;
  
      try {
        const response = await fetch('/blocked-routes.json');
        const data = await response.json();
        
        this.blockedRoutes.clear();
        data.blockedRoutes.forEach((route: string) => {
          this.blockedRoutes.add(route);
        });
  
        this.loaded = true;
        console.log(`Loaded ${data.blockedRoutes.length} blocked routes`);
      } catch (error) {
        console.error('Failed to load blocked routes:', error);
      }
    }
  
    // check if route is blocked (bidirectional)
    static isRouteBlocked(fromCode: string, toCode: string): boolean {
      const key1 = `${fromCode}-${toCode}`;
      const key2 = `${toCode}-${fromCode}`;
      return this.blockedRoutes.has(key1) || this.blockedRoutes.has(key2);
    }
  }