<template>
    <div class="modal" v-if="isModalOpen">
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