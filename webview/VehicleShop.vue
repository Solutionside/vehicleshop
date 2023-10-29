<template>
    <div class="vehicle-shop">
        <h1 class="title">Vehicle shop <span>{{ name }}</span></h1>
        <div class="inputs">
            <div class="search-input">
                <img src="./icons/search.svg" class="search-icon" />
                <input type="text" placeholder="Search vehicle by name" v-model="searchQuery" />
            </div>
            <Select :options="vehicleClasses" v-model="vehicleType" />
        </div>
        <div class="vehicle-list">
            <div
                class="vehicle"
                v-for="(vehicle, i) in filteredVehicleListByClass"
                :class="{ 'vehicle-selected': currentVehicle === vehicle.id }"
                @click="selectVehicle(vehicle.id)"
            >
                <p>{{ vehicle.name }}</p>
                <div class="price-block">
                    <span class="discount" v-if="vehicle.discount">{{ vehicle.discount }}%</span>
                    <p>${{ vehicle.price }}</p>
                </div>
            </div>
        </div>
        <div class="selected-vehicle">
            <div class="left-block">
                <h1>{{ selectedVehicle.name }}</h1>
                <p>${{ selectedVehicle.price }}</p>
            </div>
            <div class="buy" @click="buyVehicle">
                <p>Buy</p>
            </div>
        </div>
    </div>
    <CardPicker :data="playerCards" v-if="openCardPicker" @select="buySelectedCard" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Select from './components/Select.vue';
// import { vehicleClasses } from '../shared/vehicleTypes';
import WebViewEvents from '@utility/webViewEvents';
import { VehicleShopEvents } from '../shared/events';
import { IShop, IVehicle } from '../shared/interfaces/IShop';
import CardPicker from '../../core-bank/webview/pages/cardPicker.vue';
import { play } from '@AthenaClient/camera/cinematic';

const name = ref('');
const vehicleType = ref();
const currentVehicle = ref(0);
const searchQuery = ref('');
const playerCards = ref([]);
const openCardPicker = ref(false);

const vehicleList = ref<IVehicle[]>([
    {
        id: 0,
        name: 'Infernus',
        model: 'infernus',
        price: 15000,
        discount: 15,
        class: 'Sedan',
    },
    {
        id: 1,
        name: 'Calico',
        model: 'calico',
        price: 5000,
        class: 'Sedan',
    },
]);
const vehicleClasses = ref();

function selectVehicle(index) {
    currentVehicle.value = index;
    WebViewEvents.emitClient(VehicleShopEvents.selectVehicle, index);
}

function buyVehicle() {
    if (playerCards.value.length > 1) {
        openCardPicker.value = true;
    } else {
        const card = playerCards.value[0].account.accountNumber;
        openCardPicker.value = false;
        WebViewEvents.emitServer(VehicleShopEvents.buy, selectedVehicle.value.id, card);
    }
}

function buySelectedCard(card) {
    const { account } = playerCards.value[card];
    WebViewEvents.emitServer(VehicleShopEvents.buy, selectedVehicle.value.id, account.accountNumber);
}

const selectedVehicle = computed(() => {
    return vehicleList.value[currentVehicle.value];
});

const filteredVehicleList = computed(() => {
    return vehicleList.value.filter((vehicle) => vehicle.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const filteredVehicleListByClass = computed(() => {
    if (!vehicleType.value || vehicleType.value === 'None') {
        return filteredVehicleList.value;
    }

    return filteredVehicleList.value.filter((vehicle) => vehicle.class === vehicleType.value);
});

onMounted(() => {
    WebViewEvents.on(VehicleShopEvents.open, (data: IShop, _playerCards) => {
        vehicleList.value = data.vehicleList;
        name.value = data.name
        playerCards.value = _playerCards;

        vehicleClasses.value = ['None', ...new Set(vehicleList.value.map((vehicle) => vehicle.class))];

        if (data.vehicleList[0]) {
            selectVehicle(data.vehicleList[0].id);
        }
    });
});
</script>

<style lang="scss" scoped>
.vehicle-shop {
    position: absolute;
    left: 0;
    background: var(--bg, linear-gradient(144deg, rgba(18, 17, 17, 0.98) 0%, rgba(0, 0, 0, 0.96) 100%));
    height: 100%;
    width: 50vmin;
    padding: 2vmin;
    box-sizing: border-box;

    .title {
        color: #fff;
        font-family: Montserrat;
        font-size: 2.4vmon;
        font-style: normal;
        font-weight: 600;
        line-height: normal;

        span {
            color: #f2994a;
        }
    }

    .inputs {
        display: flex;
        gap: 1vmin;

        .search-input {
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;

            input {
                width: 100%;
                height: 5.1vmin;
                border-radius: 0.5vmin;
                background: rgba(255, 255, 255, 0.05);
                border: 0;
                outline: 0;

                color: rgba(255, 255, 255, 0.5);
                font-family: Montserrat;
                font-size: 1.2vmin;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                color: white;
                padding-left: 4vmin;

                &::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
            }

            .search-icon {
                position: absolute;
                margin-left: 1vmin;
                height: 1.9vmin;
            }
        }
    }

    .vehicle-list {
        display: flex;
        flex-direction: column;
        gap: 1vmin;
        margin-top: 2vmin;
        height: 78%;
        overflow: auto;
        padding-right: 1vmin;
        box-sizing: border-box;

        .vehicle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 7vmin;
            border-radius: 0.5vmin;
            background: rgba(255, 255, 255, 0.05);
            box-sizing: border-box;
            padding: 2.5vmin;
            transition: all 0.5s;
            cursor: pointer;

            p {
                color: #fff;
                font-family: Montserrat;
                font-size: 1.6vmin;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

            .price-block {
                display: flex;
                align-items: center;
                gap: 1vmin;

                p {
                    color: #219653;
                }

                .discount {
                    display: inline-flex;
                    padding: 0.4vmin 2vmin;
                    justify-content: center;
                    align-items: center;
                    gap: 1vmin;
                    border-radius: 0.5vmin;
                    background: #eb5757;

                    color: #000;
                    font-family: Montserrat;
                    font-size: 1.4vmin;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }
            }

            &:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        }

        .vehicle-selected {
            background: rgba(242, 153, 74, 0.15);
        }
    }

    .selected-vehicle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-block {
            h1 {
                color: #fff;
                font-family: Montserrat;
                font-size: 3.2vmin;
                font-style: normal;
                font-weight: 600;
                line-height: 0.5;
            }

            p {
                color: #219653;
                font-family: Montserrat;
                font-size: 2vmin;
                font-style: normal;
                font-weight: 600;
                line-height: 0.5;
            }
        }

        .buy {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 13.7vmin;
            height: 5.5vmin;
            border-radius: 0.5vmin;
            background: #f2994a;
            cursor: pointer;

            p {
                color: #000;
                font-family: Montserrat;
                font-size: 1.6vmin;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
    }
}
</style>
