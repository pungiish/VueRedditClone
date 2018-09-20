<template>
    <div class="container">
        <h1>Reddit Clone</h1>
        <Posts/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Posts from '@/components/Posts.vue'; // @ is an alias to /src
@Component({
	components: {
		Posts,
	},
})
export default class Home extends Vue {}
</script>
