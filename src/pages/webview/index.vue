<template>
    <div>
		<web-view :src="url" class="web_tyle"></web-view>
	</div>
</template>
<script>
	export default {
	  	data () {
			return {
				url: ''
			}
		},
		onLoad(options) {
			this.url = options.url
			console.log(options)
		},
		methods: {
		}
	}
</script>
<style scoped>
	.web_tyle {
		width: 100% !important;
		height: 100% !important;
	}
</style>