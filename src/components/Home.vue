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
              @blur="blur"
              style="width: 725px;height: 55px"
              placeholder="搜索音乐/MV/歌单/歌手"
              size="large">
            <el-button slot="append" icon="el-icon-search" @click="searchMusic"/>
          </el-input>
        </div>
      </div>
      <div v-if="showSearch"
           style="position: absolute;top: 160px;left: 50%;transform: translate(-50%, 0);z-index: 999">
        <search-card @keySearch="keySearch" :isRank="key===''" :keys="keys"/>
      </div>
    </div>
    <div class="container">
      <div class="tabs">
        <span class="result-text">搜索结果</span>
        <div class="tabs-title">
          <ul>
            <li :class="tabs===0?'active':''" @click="clickTabs(0)">单曲</li>
            <li>专辑</li>
            <li :class="tabs===2?'active':''" @click="clickTabs(2)">MV</li>
            <li>歌单</li>
            <li>歌手</li>
          </ul>
        </div>
      </div>
      <div v-if="tabs===0">
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
                    <span class="music-title">{{ scope.row.name }}</span>
                    <img style="width: 30px;height: 16px;margin-left: 5px" src="/assets/wusun.png">
                    <a style="display: inherit;" v-if="scope.row.hasmv"
                       :href="'http://www.kuwo.cn/mvplay/'+scope.row.rid"
                       target="_blank">
                      <img style="width: 30px;height: 30px;margin-left: 5px" src="/assets/mv.png">
                    </a>
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
      <div v-else-if="tabs===2">
        mv
      </div>
    </div>
    <div class="player" v-if="songSrc">
      <audio :src="songSrc" id="musicMp3" autoplay="" controls=""></audio>
    </div>

    <div>
      <friendly-link/>
    </div>

    <div class="footer">
      本站内容音乐下载器根据您的指令搜索各音乐平台得到的链接列表，不代表本站赞成被搜索网站的内容或立场
      如果版权人认为在本站放置您的作品有损您的利益，请<a style="text-underline: none;color: #333333"
                                 href="mailto:1355473748@qq.com">联系</a>管理人员，本站确认后将会立即删除。<span style="color: red">本站所有资源仅供学习使用，请勿用于商业用途,下载后请二十四小时内删除</span>
    </div>
  </section>
</template>

<script>

import config from "../common/util/config";
import SearchCard from "./SearchCard";
import MPagination from "./mPagination";
import Player from "./Player";
import FriendlyLink from "./FriendlyLink";

export default {
  name: 'HelloWorld',
  components: {FriendlyLink, Player, MPagination, SearchCard},
  props: {
    msg: String
  },
  created() {
    this.key = '周杰伦';
    this.searchMusic();
  },

  methods: {
    clickTabs(tab) {
      this.tabs = tab;
    },

    blur() {
      setTimeout(() => {
        this.showSearch = false
      }, 300);
    },
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
        this.songSrc = res.data
        const musicMp3 = document.getElementById('musicMp3')
        if (!this.isStore) {
          musicMp3.play()
        } else {
          musicMp3.pause()
        }
        //window.open(res.data)
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
          let url = res.data;
          if (url && url.length > 0) {
            window.open(url);
          } else {
            window.open(config.baseUrl + "music/download?artist=" + info.artist + "&name=" + info.name);
          }

        } else {
          if (res.msg && res.msg.length > 0) {
            this.$message.warning(res.msg);
            return;
          }
          this.$message.error("服务器准备资源失败");
        }
      }).finally(() => loading.close())
    }
  },
  data() {
    return {
      tabs: 0,
      progress: 0,
      isStore: true,
      songSrc: '',
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
.footer {
  padding: 10px 180px;
  text-align: center;
  margin-top: 0;
  color: #bdbdbd;
}

.music-title {
  color: #333;
}

.player {
  position: fixed;
  bottom: 0;
  z-index: 999;
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
  min-height: 380px;
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
