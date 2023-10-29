import * as Athena from '@AthenaServer/api';
import * as alt from 'alt-server';
import vehicleShop from '../../shared/config';
import { VehicleShopEvents } from '@AthenaPlugins/vehicle-shop/shared/events';
import { getRandomBoolean, getRandomDiscount } from './utils';
import BankUtils from '@AthenaPlugins/core-bank/server/src/utils';

declare global {
    namespace AthenaSession {
        export interface Player {
            currentVehicleShop: number;
        }
    }
}

class VehicleShop {
    static init() {
        vehicleShop.shopList.forEach((shop) => {
            Athena.controllers.blip.append({
                sprite: 523,
                pos: shop.position,
                text: shop.name,
                scale: 1,
                shortRange: true,
                color: 44,
            });

            Athena.controllers.marker.append({
                pos: shop.position,
                type: 1,
                scale: new alt.Vector3(1, 1, 1),
                dimension: 0,
                color: new alt.RGBA(255, 255, 255, 150),
            });

            Athena.controllers.interaction.append({
                position: shop.position,
                callback: VehicleShop.enterShop,
                data: [shop.id],
                range: 2,
                description: 'Press shift + enter to open menu',
            });
        });

        VehicleShop.setDiscounts();
    }

    static async enterShop(player, id) {
        const shop = vehicleShop.shopList.find((el) => el.id === id);
        if (!shop) return;

        const playerCards = await BankUtils.getPlayerCards(player);

        if (!playerCards) {
            Athena.player.emit.notify(player, 'You have no cards', 'error');
            return;
        }

        alt.emitClient(player, VehicleShopEvents.open, shop, playerCards);

        Athena.session.player.set(player, 'currentVehicleShop', id);
    }

    static async buyVehicle(player: alt.Player, vehicleId: number, bankCard?: number) {
        const currentShop = Athena.session.player.get(player, 'currentVehicleShop');

        if (currentShop === undefined) {
            return;
        }

        const shopData = vehicleShop.shopList.find((el) => el.id === currentShop);

        if (!shopData) {
            return;
        }

        const vehicleData = shopData.vehicleList.find((el) => el.id === vehicleId);

        if (!vehicleData) {
            return;
        }

        const bank = await BankUtils.getAccount(bankCard);

        if (!bank) return;

        if (bank.balance < vehicleData.price) {
            Athena.player.emit.notify(player, 'You have no money', 'error');
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        try {
            await BankUtils.updateAccountBalance(bank.accountNumber, bank.balance - vehicleData.price);

            alt.emitClient(player, VehicleShopEvents.close);

            Athena.player.emit.notify(player, 'You successfully buyed vehicle', 'success');
            Athena.vehicle.add.toPlayer(player, vehicleData.model, shopData.vehiclePositionAfterBuy);
            Athena.player.emit.soundFrontend(player, 'BASE_JUMP_PASSED', 'HUD_AWARDS');
        } catch (e) {
            console.log(e);
        }
    }

    static setDiscounts() {
        vehicleShop.shopList.forEach((shop) => {
            const vehicleCount = shop.vehicleList.length;
            const vehiclesWithDiscount = new Set();

            while (vehiclesWithDiscount.size < shop.maxDiscounts) {
                const randomVehicleIndex = Math.floor(Math.random() * vehicleCount);
                vehiclesWithDiscount.add(randomVehicleIndex);
            }

            shop.vehicleList.forEach((vehicle, index) => {
                if (vehiclesWithDiscount.has(index)) {
                    const discount = getRandomDiscount();
                    const discountAmount = Math.floor(vehicle.price * (discount / 100));
                    vehicle.discount = discount;
                    vehicle.discountPrice = vehicle.price - discountAmount;
                }
            });
        });
    }
}

alt.onClient(VehicleShopEvents.buy, VehicleShop.buyVehicle);

export default VehicleShop;
