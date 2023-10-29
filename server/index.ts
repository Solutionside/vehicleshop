import * as Athena from '@AthenaServer/api';
import VehicleShop from './src/vehicleShop';

const PLUGIN_NAME = 'vehicle-shop';

function onLoad() {
    VehicleShop.init();
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, onLoad);