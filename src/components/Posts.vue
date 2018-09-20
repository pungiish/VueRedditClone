<template>
    <div>
        <form @submit.prevent="search">
            <div class="form-group">
                <label for="subreddit">
                    <h2>Search for a subreddit</h2>
                </label>
                <input id="subreddit" v-model="subreddit" type="text" class="form-control" aria-describedby="subreddit" placeholder="Enter subreddit" style="width: 50%; margin: 0 auto;">
            </div>
        </form>
        <div v-for="(item, index) in posts" :key="index" class="card" style="width: 70%; margin: 0 auto;">
            <div class="card-body card text-white  mb-3" style="width:100%;margin: 0 !important;">
                <h6 class="card-subtitle mb-2 text-muted" style="margin: 0 auto;">Author: {{item.data.author}}</h6>
                <a :href="'http://www.reddit.com/r/' + item.data.subreddit + '/comments/' + item.data.id + '/' + item.data.title" class="card-title" style="display:inline-block;margin: 0 auto;"> {{item.data.title}}</a>
                <p class="card-text">{{item.data.selftext}}</p>
                <div v-if="item.data.preview" style="margin: 0 auto;">
                    <img :src="item.data.preview.images[0].source.url" style="height: 400px; width:100%;margin-bottom: 10px;" alt="Card image">
                </div>
                <button class="btn btn-info" style="width:200px; margin: 0 auto;" @click="getComments(index)">get comments</button>
                <div v-if="!commentsNotWorking">
                    <div class="list-group" style="margin-top: 10px;">
                        <a v-for=" (comment, idx) in comments[index] " :key="idx " class="list-group-item list-group-item-action card text-white bg-primary mb-3 ">
                            {{comment.data.body}}
                        </a>
                    </div>
                </div>
                <div v-else>No comments</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component
export default class Posts extends Vue {
	isLoading = true;
	commentsNotWorking = false;
	subreddit = 'pics';
	url = 'https://www.reddit.com/r/';
	posts = [];
	comments = [];
	mounted() {
		this.load(`${this.url}${this.subreddit}/`);
	}
	load(url?: string): Promise<any> {
		return fetch(`${url}.json`, {})
			.then(res => {
				const contentType = res.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					return res.json();
				}

				throw new TypeError("Ops, that's not JSON!");
			})
			.then(posts => posts.data.children)
			.then(returnedPosts => {
				this.posts = returnedPosts;
				console.log(this.posts);
			})
			.then(() => {
				this.isLoading = false;
			})
			.catch(err => {
				console.error(err);
			});
	}
	getComments(idx) {
		const [...posts] = this.posts;
		const [...id] = posts[idx].data.id;
		let [...title] = posts[idx].data.title;
		title = title.replace(/\//g, '_');
		this.loadComments(id, idx, title);
	}
	loadComments(id, idx, title) {
		// to hide other comments, avoid cluttering
		for (let i = 0; i < this.comments.length; i += 1) {
			if (i !== idx) {
				this.comments[i] = '';
			}
		}
		const url = `${this.url}${this.subreddit}/comments/${id}/${title}/.json`;
		if (!this.comments[idx]) {
			console.log('smth');
			fetch(url)
				.then(res => res.json())
				.then(res => {
					console.log(res);

					res[1].data.children.forEach(element => {
						this.comments[idx] = res[1].data.children;
					});
					if (this.comments[idx] === undefined || this.comments[idx] === '') {
						this.commentsNotWorking = true;
						console.log(this.commentsNotWorking);
						setTimeout(() => {
							console.log('setTomet');
							this.commentsNotWorking = false;
						}, 450);
						this.$forceUpdate();
					} else {
						this.commentsNotWorking = false;
						this.$forceUpdate();
					}
				})
				.catch(err => {
					this.commentsNotWorking = true;
					setTimeout(() => {
						this.commentsNotWorking = false;
					}, 450);
				});
		} else {
			console.log('else');
			this.comments[idx].forEach(element => {
				this.comments[idx] = '';
				this.$forceUpdate();
			});
		}
	}
	search() {
		this.posts = [];
		this.load(`${this.url}${this.subreddit}/`);
		this.$forceUpdate();
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only-->
<style scoped >
</style>
