export class StorageService {
    private static readonly ROUTE_KEY = 'travel-route-data';
  
    static saveRoute(data: any): boolean {
      try {
        const jsonString = JSON.stringify(data);
        localStorage.setItem(this.ROUTE_KEY, jsonString);
        console.log('Route saved to localStorage');
        return true;
      } catch (error) {
        console.error('Failed to save route:', error);
        return false;
      }
    }

    static loadRoute(): any | null {
      try {
        const jsonString = localStorage.getItem(this.ROUTE_KEY);
        if (jsonString) {
          const data = JSON.parse(jsonString);
          console.log('Route loaded from localStorage');
          return data;
        }
        return null;
      } catch (error) {
        console.error('Failed to load route:', error);
        return null;
      }
    }

    static hasSavedRoute(): boolean {
      return localStorage.getItem(this.ROUTE_KEY) !== null;
    }

    static exportToFile(data: any, filename: string = 'travel-route.json'): void {
      try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        console.log('Route exported to file');
      } catch (error) {
        console.error('Failed to export route:', error);
      }
    }

    static importFromFile(): Promise<any> {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event: any) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              try {
                const data = JSON.parse(e.target.result);
                console.log('Route imported from file');
                resolve(data);
              } catch (error) {
                console.error('Failed to parse JSON:', error);
                reject(error);
              }
            };
            reader.readAsText(file);
          } else {
            reject(new Error('No file selected'));
          }
        };
        
        input.click();
      });
    }
  }