export interface IShop {
    id: number;
    name: string;
    maxDiscounts: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    vehiclePosition: {
        x: number;
        y: number;
        z: number;
    };
    vehiclePositionAfterBuy: {
        x: number;
        y: number;
        z: number;
    };
    vehicleList: IVehicle[];
    player?: {
        pos: {
            x: number;
            y: number;
            z: number;
        };
        heading: number;
    };
}

export interface IVehicle {
    id: number;
    name: string;
    model: string;
    price: number;
    discount?: number;
    discountPrice?: number;
    class?: string;
    player?: {
        pos: {
            x: number;
            y: number;
            z: number;
        };
        heading: number;
    };
}
