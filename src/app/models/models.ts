export interface item {
    id:number;
    name:string;
    description:string;
    price:number;
    barcode:string;
    serialNumber:string;
    image:string;
    categories:string[];
    documents:string[];
}

export interface category { 
    id:number; 
    name: string; 
    description: string; 
    icon: string;
    image: string; 
};

export interface tag {
        display: string,
        value: string
}