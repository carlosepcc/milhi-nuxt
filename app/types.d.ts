// Define interfaces for our data structures
interface DataToImport{version?:1,records:InventoryRecord[],locations:InventoryLocation[],products:Product[]}

interface Product {
    id: string;
    name: string;
    description: string;
    emoji: string;
}

interface InventoryRecord {
    id: string;
    productId: string;
    location: string;
    type?: 'buy' | 'sell';
    units: number;
    price: number;
    date: string;
    details?: string;
}

interface InventoryLocation {
    id: string;
    name: string;
    emoji: string;
}

// Define the state structure
interface InventoryState {
    products: Product[];
    records: InventoryRecord[];
    locations: InventoryLocation[];
    isHydrating: boolean;
}
interface CreateInventoryRecord extends Omit<InventoryRecord,"id">{}