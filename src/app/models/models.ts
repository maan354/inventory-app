import { Guid } from 'guid-typescript';

export interface item {
    addedDate: Date;
    lastEditedDate: Date;
    id: Guid;
    name: string;
    description: string;
    price: number;
    number: number;
    barcode: string;
    serialNumber: string;
    filePath: string;
    categories: string[];
    documents: document[];
}

export interface document {
    id: Guid;
    itemId: Guid,
    filePath: string;
    name: string;
    description: string;
}

export interface category {
    id: Guid;
    name: string;
    description: string;
    icon: string;
    image: string;
};

export interface tag {
    display: string,
    value: string
}