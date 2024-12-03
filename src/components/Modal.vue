<template>
    <div class="modal-overlay" v-if="isModalOpen">
        <div class="modal-content">
            <slot></slot>
            <button @click="closeModal">Close</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['isModalOpen'],
    methods: {
        closeModal() {
            this.$emit('close')
        }
    }
}
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure modal is on top */
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1001; /* Ensure content is above overlay */
}
</style>