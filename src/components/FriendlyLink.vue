<template>
    <section class="friend-link center">
        <div>
            <div style="margin-left: 120px" class="flex">
                <div style="width: 80px">
                    <span>友情链接</span>
                </div>
                <ul class="flex">
                    <li v-for="item in links">
                        <a :href="item.link" target="_blank">{{item.name}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "FriendlyLink",
        created() {
            this.musicService.getInfo().then(res => {
                this.links = res.data.link;
            })
        },
        data() {
            return {
                links: []
            }
        }
    }
</script>

<style scoped lang="less">
    .friend-link {
        margin-top: 20px;
        ul {
            flex-wrap: wrap;
            padding: 0;
            list-style: none;
            margin: 0;
            a{
                color: #6C6C6C;
                text-underline: none;
            }
            li{
                margin-left: 10px;
                margin-bottom: 5px;
            }
        }
    }
</style>