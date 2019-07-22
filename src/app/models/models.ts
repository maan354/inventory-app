import { Guid } from 'guid-typescript';

export interface item {
    id:Guid;
    name:string;
    description:string;
    price:number;
    barcode:string;
    serialNumber:string;
    image:string;
    filePath:string;
    categories:string[];
    documents:document[];
}

export interface document {
    id:Guid;
    itemId:Guid,
    image:string;
    filePath:string;
    name:string;
    description:string;
}

export interface category { 
    id:Guid; 
    name: string; 
    description: string; 
    icon: string;
    image: string; 
};

export interface tag {
    display: string,
    value: string
}