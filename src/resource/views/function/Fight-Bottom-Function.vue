<template>
    <section class="position-absolute" style="z-index: 100; bottom: 10%; right: 10%;">
        <router-link @click.prevent="$router.back()" class="text-light btn btn-secondary d-inline-flex flex-column align-items-center text-decoration-none" style="opacity: 0.8;" to="">
            Thoát
        </router-link>
    </section>
</template>

<script>
export default {}
</script>
