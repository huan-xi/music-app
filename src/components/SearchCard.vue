<template>
    <section class="search-card">
        <el-card>
            <div v-if="isRank">
                <span style="font-size: 16px;">大家都在搜</span>
                <ul>
                    <li @click="click(key)" v-for="(key,index) in keys" :key="index"><span :class="textClass(index)">{{index+1}}</span>{{key}}
                    </li>
                </ul>
            </div>
            <ul v-else>
                <li v-for="(key,index) in keys" :key="index" @click="click(getKeyString(key))">{{getKeyString(key)}}
                </li>
            </ul>
        </el-card>
    </section>
</template>

<script>
    export default {
        name: "SearchCard",
        props: {
            keys: {
                type: Array,
                default: () => []
            },
            isRank: {
                type: Boolean,
                default: () => true
            },
        },
        computed: {
            getKeyString(value) {
                return function (value) {
                    let res = value.match(new RegExp(`RELWORD=(.*?)\\s`))
                    if (res && res.length > 1) {
                        return res[1]
                    }
                    return;
                }
            }
        },
        methods: {
            click(key) {
               this.$emit('keySearch',key)
            },
            textClass(index) {
                if (index === 0) {
                    return 'id id-0';
                } else if (index === 1) {
                    return 'id id-1';
                } else if (index === 2) {
                    return 'id id-2';
                } else {
                    return 'id id-gray';
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .search-card {
        width: 725px;
        transition-property: top;
        transition-duration: .2s;
        transition-timing-function: ease-in-out;
        box-shadow: 0 10px 30px 0 rgba(65, 67, 70, .08);

        ul {
            list-style: none;
            padding: 0;

            li {
                height: 38px;
                line-height: 38px;
                color: #333333;
            }

            li:hover {
                background: #f2f2f2;
            }
        }

        .id {
            width: 18px;
            height: 18px;
            display: inline-block;
            margin-right: 8px;
            text-align: center;
            line-height: 19px;
            border-radius: 2px;
            background: #b3b3b3;
            color: #fff;
            font-weight: 300;
        }

        .id-0 {
            background: #ea4343;
        }

        .id-1 {
            background: #ff6b21;
        }

        .id-2 {
            background: #ffb700;
        }
    }
</style>