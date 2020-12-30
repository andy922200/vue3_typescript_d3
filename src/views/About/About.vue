<template>
    <div class="about">
        <h1>This is an about page</h1>
        <el-switch
            v-model="value2"
            active-color="#13ce66"
            inactive-color="#ff4949"
        >
        </el-switch>
    </div>
</template>

<script lang="ts">
import {
    ref,
    defineComponent
} from 'vue'

export default defineComponent({
    name: 'About',
    setup () {
        const value2 = ref(true)
        return {
            value2
        }
    }
})
</script>
