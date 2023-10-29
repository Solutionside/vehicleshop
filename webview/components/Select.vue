<template>
    <div class="custom-select">
        <div class="selected-option" @click="toggleDropdown">
            {{ selected || 'Select one' }}
            <svg
                v-if="!dropdownOpen"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-arrow-down"
                width="16"
                height="16"
            >
                <path d="M6 9l6 6 6-6" />
            </svg>
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-arrow-up"
                width="16"
                height="16"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </div>
        <div class="dropdown" :class="{ open: dropdownOpen }">
            <div class="option" v-for="(item, index) in options" :key="index" @click="selectOption(item)">
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dropdownOpen: false,
        };
    },
    computed: {
        selected() {
            return this.modelValue || '';
        },
    },
    methods: {
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        selectOption(option) {
            this.$emit('update:modelValue', option);
            this.dropdownOpen = false;
        },
    },
};
</script>

<style scoped>
.custom-select {
    width: 35%;
    flex-shrink: 0;
    position: relative;
}

.selected-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.459);
    font-size: 1.4vmin;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 1.5vmin;
    height: 5.1vmin;
    box-sizing: border-box;
    background-color: #ffffff0d;
    cursor: pointer;
    z-index: 1;
    border-radius: 0.5vmin;
}

.dropdown {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #1f1d1d;
    display: none;
    z-index: 1;
    border-radius: 0.5vmin;
}

.dropdown.open {
    display: block;
}

.option {
    color: #fff;
    padding: 1vmin;
    cursor: pointer;
    font-size: 1.6vmin;
}

.option:hover {
    background-color: #333;
}
</style>
