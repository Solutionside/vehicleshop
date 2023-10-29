import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';
import * as native from 'natives';
import { VehicleShopEvents } from '../shared/events';
import { IShop } from '../shared/interfaces/IShop';
import { vehicleClasses } from '../shared/vehicleTypes';
import { playAnimation } from '@AthenaClient/systems/animations';
import './command';

let currentShop: IShop;
let spawnedVehicle: number;
let camera: AthenaClient.camera.rotateCamera;
let isPlayingAnim = false;

const animDist = 'amb@world_human_cop_idles@male@idle_b';
const animName = 'idle_d';

class VehicleShop {
    static async openMenu(data: IShop, playerCards) {
        await AthenaClient.webview.openPages(['VehicleShop'], true, VehicleShop.close);
        await AthenaClient.webview.focus();
        await AthenaClient.webview.showCursor(true);
        alt.Player.local.isMenuOpen = true;

        data.vehicleList = data.vehicleList.map((vehicle) => {
            const classId = native.getVehicleClassFromName(alt.hash(vehicle.model));

            return { ...vehicle, class: vehicleClasses[classId] };
        });

        currentShop = data;

        VehicleShop.createCamera();

        AthenaClient.webview.emit(VehicleShopEvents.open, data, playerCards);
    }

    static async close() {
        await AthenaClient.webview.closePages(['VehicleShop'], true);
        await AthenaClient.webview.unfocus();
        await AthenaClient.webview.showCursor(false);
        // alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;

        if (spawnedVehicle && native.doesEntityExist(spawnedVehicle)) {
            native.deleteVehicle(spawnedVehicle);
        }

        spawnedVehicle = null;
        currentShop = null;

        camera.destroy();
        native.stopAnimTask(alt.Player.local, animDist, animName, 1);
        isPlayingAnim = false;
    }

    static async createPreviewVehicle(id: number) {
        const vehicleData = currentShop.vehicleList.find((el) => el.id === id);
        await AthenaClient.utility.model.load(vehicleData.model);

        if (spawnedVehicle && native.doesEntityExist(spawnedVehicle)) {
            native.deleteVehicle(spawnedVehicle);
        }

        native.setEntityCoordsNoOffset(
            alt.Player.local,
            currentShop.player.pos.x,
            currentShop.player.pos.y,
            currentShop.player.pos.z,
            false,
            false,
            false,
        );

        native.setEntityHeading(alt.Player.local, currentShop.player.heading);

        if (vehicleData.player) {
            native.setEntityCoordsNoOffset(
                alt.Player.local,
                vehicleData.player.pos.x,
                vehicleData.player.pos.y,
                vehicleData.player.pos.z,
                false,
                false,
                false,
            );

            native.setEntityHeading(alt.Player.local, vehicleData.player.heading);
        }

        playAnimation(animDist, animName, 1, -1);

        isPlayingAnim = true;

        spawnedVehicle = native.createVehicle(
            alt.hash(vehicleData.model),
            currentShop.vehiclePosition.x,
            currentShop.vehiclePosition.y,
            currentShop.vehiclePosition.z,
            0,
            false,
            false,
            false,
        );
    }

    static async createCamera() {
        const { x, y, z } = currentShop.vehiclePosition;
        camera = new AthenaClient.camera.rotateCamera({ x, y, z }, 50, 0, {
            x: 0,
            y: 6,
            z: 0,
        });

        camera.setActive(true);
    }
}

AthenaClient.webview.on(VehicleShopEvents.selectVehicle, VehicleShop.createPreviewVehicle);

alt.onServer(VehicleShopEvents.open, VehicleShop.openMenu);
alt.onServer(VehicleShopEvents.close, VehicleShop.close);

export default VehicleShop;
