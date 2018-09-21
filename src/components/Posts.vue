<template>
    <div>
        <form @submit.prevent="search">
            <div class="form-group">
                <label for="subreddit">
                    <h2>Search for a subreddit!</h2>
                </label>
                <input id="subreddit" :value="subreddit" type="text" class="form-control" aria-describedby="subreddit" placeholder="Enter subreddit" style="width: 50%; margin: 0 auto;" @input="updateValue($event)">
            </div>
            <div class="form-group">
                <select id="exampleFormControlSelect2" v-model="query" class="form-control" style="width: 50%; margin: 0 auto;">
                    <option value="new">new</option>
                    <option value="top">top</option>
                    <option value="hot">hot</option>
                    <option value="rising">rising</option>
                </select>
            </div>
        </form>
        <div v-for="(item, index) in posts " :key="index " class="media border-top border-right border-left border-info p-3 ">
            <img :src="item.data.thumbnail " class="d-inline-block border " style="height:80px;width:90px " alt="No thumbnail available! ">
            <div class="media-body text-info ">
                <div class="row ">
                    <div class="col-sm-12 ">
                        <div v-if="item.data.title.length<50 ">
                            <a :href=" 'https://www.reddit.com/' + item.data.permalink " class="float-left ml-3 d-block ">
                                {{item.data.title}}
                                <span v-if="computedTime(index) <= 4" class="badge badge-default text-warning ">New</span>
                            </a>
                        </div>
                        <div v-else>
                            <a :href=" 'https://www.reddit.com/' + item.data.permalink " class="float-left ml-3 d-block ">{{ item.data.title.substring(0,50) + '..'}}</a>
                            <span v-if="computedTime(index) <= 4" class="badge badge-default text-warning float-left">New</span>
                        </div>
                    </div>
                    <div class="col-sm-12 ">
                        <div v-if="item.data.selftext.length<50 ">
                            <p class="float-left ml-3 d-block ">{{ item.data.selftext }}</p>
                            <p class="float-left inline mb-1">{{computedTime(index)}} hours ago by
                                <a :href=" 'https://www.reddit.com/user/' + item.data.author " class=" inline">[{{item.data.author}}]</a>
                            </p>
                        </div>
                        <div v-else>
                            <p class="float-left ml-3 d-block ">{{ item.data.selftext.substring(0,50) + '..'}}</p>
                            <p class="float-left inline mb-1">{{computedTime(index)}} hours ago by
                                <a :href=" 'https://www.reddit.com/user/' + item.data.author " class=" inline">[{{item.data.author}}]</a>
                            </p>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <p class="ml-3 float-left text-white">
                        <font-awesome-icon icon="thumbs-up" /> {{item.data.ups}}</p>
                    </div>
                </div>
            </div>
        </div>
        <!--  <button class="btn btn-info " style="width:200px; margin: 0 auto; " @click="getComments(index) ">get comments</button>
        <div v-if="!commentsNotWorking ">
            <div class="list-group " style="margin-top: 10px; ">
                <a v-for=" (comment, idx) in comments[index] " :key="idx " class="list-group-item list-group-item-action card text-white bg-primary mb-3 ">
                    {{comment.data.body}} - [{{comment.data.author}}]
                </a>
            </div>
        </div>
        <div v-else>No comments</div -->>
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
	query = 'new';
	posts = [];
	comments = [];
	@Watch('query')
	queryChanged(selectedQuery: string, old: string) {
		this.query = selectedQuery;
		this.search();
	}

	mounted() {
		this.load(`${this.url}${this.subreddit}/${this.query}/`);
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
		this.load(`${this.url}${this.subreddit}/${this.query}/`);
	}
	updateValue($event) {
		this.subreddit = $event.target.value;
		console.log(this.subreddit);
	}
	computedTime(idx) {
		const d = new Date(this.posts[idx].data.created_utc * 1000);

		const now = new Date();
		// Get 1 hour in milliseconds
		const hours = 1000 * 60 * 60;
		// Convert both dates to milliseconds
		const date1Ms = d.getTime();
		const date2Ms = now.getTime();
		// Calculate the difference in milliseconds
		const differenceMs = date2Ms - date1Ms;
		// Convert back to hours and return
		return Math.round(differenceMs / hours);
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only-->
<style scoped >
</style>
