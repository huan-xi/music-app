<template>
    <div class="x-footer">
        <div class="x-meida">
            <div class="x-meida-img">
                <img :src="footer.imgUrl"/>
            </div>
            <div class="x-media-name">
                <h3>{{footer.title}}</h3>
                <h5>{{footer.subTitle}}</h5>
            </div>
        </div>
        <div class="x-media-btn" @click="changeStart">
            <audio :src="footer.songs" id="musicMp3" autoplay="" controls=""></audio>
            <img :src="isStore ? footer.startIcon : footer.stopIcon"/>
        </div>
        <div class="x-media-menu">

        </div>
        <div class="x-mp3-progress">
            <div class="x-now-progress" :style="{width: progress}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['link'],
        data() {
            return {
                isStore: true,
                progress: '0%',
                footer: {
                    title: '一个旅行者和贵宾狗的故事',
                    subTitle: '俗事杂谈论坛直播',
                    startIcon: './static/img/start.svg',
                    stopIcon: './static/img/stop.svg',
                    imgUrl: './static/img/header1.jpg',
                    songs: './static/music/aixiangsui.mp3'
                }
            }
        },
        mounted: function () {
            document.getElementById('musicMp3').pause()
            this.changeProgress()
        },
        methods: {
            changeStart: function () {
                this.isStore = !this.isStore
                const musicMp3 = document.getElementById('musicMp3')
                if (!this.isStore) {
                    musicMp3.play()
                } else {
                    musicMp3.pause()
                }
            },
        }
    }
</script>

