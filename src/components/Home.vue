<template>
    <section class="page">
        <div style="position: relative" class="flex">
            <div class="search-box center">
                <div class="bg"></div>
                <div class="search">
                    <el-input
                            @keyup.enter.native="searchMusic"
                            @focus="getKey"
                            v-model="key"
                            @input="getKey"
                            @blur="showSearch=false"
                            style="width: 725px;height: 55px"
                            placeholder="搜索音乐/MV/歌单/歌手"
                            size="large">
                        <el-button slot="append" icon="el-icon-search" @click="searchMusic"/>
                    </el-input>
                </div>
            </div>
            <div :class="showSearch?'search-card-show':'search-card-hidden'"
                 style="position: absolute;top: 160px;left: 50%;transform: translate(-50%, 0);z-index: 999">
                <search-card @keySearch="keySearch" :isRank="key===''" :keys="keys"/>
            </div>
        </div>
        <div class="container">
            <div class="tabs">
                <span class="result-text">搜索结果</span>
                <div class="tabs-title">
                    <ul>
                        <li class="active">单曲</li>
                        <li>专辑</li>
                        <li>MV</li>
                        <li>歌单</li>
                        <li>歌手</li>
                    </ul>
                </div>
            </div>
            <div class="musics">
                <el-table
                        v-loading="loading"
                        :data="dataList"
                        style="width: 100%">
                    <el-table-column
                            label="序号"
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            label="歌曲"
                            width="400">
                        <template slot-scope="scope">
                            <div class="flex-vertical-center">
                                <el-image
                                        style="width: 55px; height: 55px;margin-right: 30px"
                                        :src="scope.row.pic"
                                        fit="fit"></el-image>
                                <div class="center" style="height: 55px">
                                    <span class="music-title">{{scope.row.name}}</span>
                                    <img style="width: 30px;height: 16px;margin-left: 5px" src="/assets/wusun.png">
                                    <img style="width: 30px;height: 30px;margin-left: 5px" src="/assets/mv.png">
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="artist"
                            label="歌手"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="album"
                            width="200"
                            label="专辑">
                    </el-table-column>
                    <el-table-column
                            prop="songTimeMinutes"
                            label="时长">
                    </el-table-column>
                    <el-table-column
                            label="操作">

                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false"
                                     style="margin-right: 5px"
                                     @click="fastDownloadMusic(scope.row.rid,scope.row.name)">播放
                            </el-link>

                            <el-link type="primary" :underline="false"
                                     @click="downloadMusic(scope.row)">下载
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="page.total>0" class="flex-reverse" style="margin-top: 20px">
                <m-pagination @refresh="searchMusic" v-model="page"></m-pagination>
            </div>
        </div>
        <div style="height: 30px;width: 100%"></div>
    </section>
</template>

<script>

    import {download} from "../common/util/download";
    import config from "../common/util/config";
    import SearchCard from "./SearchCard";
    import MPagination from "./mPagination";

    export default {
        name: 'HelloWorld',
        components: {MPagination, SearchCard},
        props: {
            msg: String
        },
        created() {
            this.searchMusic()
        },

        methods: {
            keySearch(key) {
                this.key = key;
                this.searchMusic();
            },
            getKey() {
                this.showSearch = true;
                this.musicService.getKey({
                    key: this.key
                }).then(res => {

                    this.keys = res.data
                })
            },
            searchMusic() {
                this.loading = true;
                this.musicService.getMusicList({
                    key: this.key,
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                }).then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data.list
                        this.page.total = parseInt(res.data.total)
                    }
                }).finally(() => this.loading = false)
            },
            fastDownloadMusic(rid, name) {
                //获取外链
                this.musicService.getLink({
                    rid: rid
                }).then(res => {
                    window.open(res.data)
                })
            },
            downloadMusic(info) {
                delete info.mvpayinfo
                delete info.payInfo
                let loading = this.$loading({
                    lock: true,
                    text: '服务器正在合成资源'
                });
                this.musicService.save(info).then(res => {
                    if (res.code === 0) {
                        window.open(config.baseUrl + "/music/download?artist=" + info.artist + "&name=" + info.name)
                    } else {
                        this.$message.error("服务器准备资源失败")
                    }
                }).finally(() => loading.close())
            }
        },
        data() {
            return {
                showSearch: false,
                loading: false,
                key: '',
                keys: [],
                dataList: [],
                page: {
                    total: 0,
                    pageNo: 1,
                    pageSize: 20
                }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .music-title {
        color: #333;
    }

    .musics {
        z-index: -1;
        margin-top: 30px;
    }

    .search-card-show {
        opacity: 1;
    }

    .search-card-hidden {
        opacity: 0;
    }

    .page {
        font-family: Microsoft YaHei, Helvetica Neue, Helvetica, STHeiTi, sans-serif;
    }

    .search {
        position: relative;
        overflow: visible !important;
    }

    .search .el-input__inner {
        height: 55px !important;
    }

    .container {
        padding: 40px 120px 0 120px;

        .el-table {
            z-index: 10;
        }

    }

    .search-box {
        overflow: hidden;
        position: relative;
        height: 245px;
        width: 100%;
    }

    .bg {
        top: 49%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        position: absolute;
        width: 1926px;
        height: 100%;
        background-image: url("../assets/bg.png");
    }

    .result-text {
        font-size: 22px;
        font-weight: 600;
        line-height: 30px;
        margin-right: 40px;
        color: #333;
    }

    .tabs-title {
        display: inline-block;

        ul {
            list-style: none;
            display: flex;
        }

        li {
            z-index: -1;
            height: 20px;
            line-height: 20px;
            margin-right: 34px;
            position: relative;
            font-weight: 300;
            color: #333;

        }

        li:hover {
            color: #000;
            font-weight: 400;
        }

        .active {
            font-weight: 600;
            color: #000;
        }

        .active:after {
            position: absolute;
            content: "";
            left: 0;
            bottom: 1px;
            width: 100%;
            height: 6px;
            background: #ffe443;
            z-index: -22;
        }
    }
</style>
