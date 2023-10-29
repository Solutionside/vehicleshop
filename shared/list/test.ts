import { IShop } from '../interfaces/IShop';

export const testShop: IShop = {
    name: 'Test',
    id: 1,
    position: { x: -31.997644424438477, y: -1112.3255615234375, z: 25.42236328125 },
    vehiclePosition: { x: -42.918338775634766, y: -1099.4906005859375, z: 26.42234230041504 },
    vehiclePositionAfterBuy: { x: -50.98923873901367, y: -1116.516845703125, z: 26.434432983398438 },
    maxDiscounts: 3,
    player: {
        pos: { x: -41.39889144897461, y: -1099.4068603515625, z: 26.42233657836914 },
        heading: 270,
    },
    vehicleList: [
        {
            id: 0,
            name: 'Premier',
            model: 'premier',
            price: 6000,
            player: {
                pos: { x: -41.39889144897461, y: -1099.4068603515625, z: 26.42233657836914 },
                heading: 270,
            },
        },
        {
            id: 1,
            name: 'Infernus',
            model: 'infernus',
            price: 7000,
        },
        {
            id: 2,
            name: 'Felon GT',
            model: 'felon2',
            price: 7500,
        },
        {
            id: 3,
            name: 'Vacca',
            model: 'vacca',
            price: 8000,
        },
        {
            id: 5,
            name: 'Avarus',
            model: 'avarus',
            price: 9000,
        },
        {
            id: 7,
            name: 'Kamacho',
            model: 'kamacho',
            price: 10000,
        },
        {
            id: 8,
            name: 'Apocalypse Infernus',
            model: 'infernus2',
            price: 12000,
        },
        {
            id: 9,
            name: 'Jackal',
            model: 'jackal',
            price: 6500,
        },
        {
            id: 10,
            name: 'Sandking XL',
            model: 'sandking',
            price: 8500,
        },
        {
            id: 12,
            name: 'Sabre Turbo',
            model: 'sabregt2',
            price: 9800,
        },
        {
            id: 13,
            name: 'Nightshade',
            model: 'nightshade',
            price: 11000,
        },
        {
            id: 14,
            name: 'Zion Classic',
            model: 'zion3',
            price: 10500,
        },
        {
            id: 15,
            name: 'Schlagen GT',
            model: 'schlagen',
            price: 11500,
        },
        {
            id: 16,
            name: 'Penumbra FF',
            model: 'penumbra2',
            price: 9500,
        },
        {
            id: 17,
            name: 'Tyrant',
            model: 'tyrant',
            price: 19000,
        },
        {
            id: 19,
            name: 'Эмерус',
            model: 'emerus',
            price: 20000,
        },
    ],
};
