<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav" ref="nav"  @titleClick="titleClick"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
        <detail-swiper :topImages="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-params-info ref="params" :paramInfo="paramInfo"></detail-params-info>
        <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
        <goods-list ref="recommends" :goods="recommends"></goods-list>

    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-botton-bar @addCart="addToCart"></detail-botton-bar>
    <toast :message="message" :show="show"></toast>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamsInfo from './childComps/DetailParamsInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottonBar from './childComps/DetailBottonBar'
import scroll from '@/components/common/scroll/Scroll'
import GoodsList from '@/components/content/goods/GoodsList'
import Toast from '@/components/common/toast/Toast'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from '@/network/detail'
import { debounce } from '@/common/utils'
import {itemListenerMixin,backTopMixin} from '@/common/mixin'

export default {
    name:'Detail',
    components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        scroll,
        DetailGoodsInfo,
        DetailCommentInfo,
        DetailParamsInfo,
        DetailBottonBar,
        GoodsList,
        Toast
    },
    mixins: [itemListenerMixin,backTopMixin],
    data(){
        return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs:[],
            getThemeTopY: null,
            message: '' , //toast??????
            show: false  //????????????toast
        }
    },
    created() {
        console.log(this.$route.params)
        // 1. ???????????????id
        this.iid = this.$route.params.iid
        console.log(this.iid)

        // 2. ??????iid??????????????????
        getDetail(this.iid).then(res => {
            // 1. ?????????????????????
            console.log(res)
            const data = res.result
            this.topImages = data.itemInfo.topImages
            console.log(this.topImages)

            // 2. ??????????????????
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            console.log(this.goods)

            // 3. ??????????????????
            this.shop = new Shop(data.shopInfo)

            // 4. ???????????????????????????
            this.detailInfo = data.detailInfo
            console.log(this.detailInfo)

            // 5. ??????????????????
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
            console.log(this.paramInfo)

            // 6. ??????????????????
            if(data.rate.cRate !== 0) {
                this.commentInfo = data.rate.list[0]
            }
            // console.log(this.commentInfo)
            // console.log(Object.keys(this.commentInfo).length !== 0)

            // 1. ?????????this.$refs.params.$el????????????
            // this.themeTopYs = []
            //     this.themeTopYs.push(0)
            //     this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
            //     console.log(this.themeTopYs)

            // this.$nextTick(() => {
            //     // 2. ????????????????????????????????????????????????????????????
            //     // dom???????????????????????????????????????????????????,offsetTop????????????
                
            //     this.themeTopYs = []
            //     this.themeTopYs.push(0)
            //     this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
            //     console.log(this.themeTopYs)
            // })
        })
    
        // 3.??????????????????
        getRecommend().then (res => {
            console.log(res)
            this.recommends = res.data.list
        })
        //  4. ???getThemeTop??????
        this.getThemeTopY = debounce(() => {
            this.themeTopYs = []
            this.themeTopYs.push(0)
            this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
            // hack??????????????????????????????????????????
            this.themeTopYs.push(Number.MAX_VALUE)
            console.log(this.themeTopYs)
        })
    },
    mounted() {
        
        // console.log('????????????')
    },
    // updated() {
    //     this.themeTopYs = []
    //     this.themeTopYs.push(0)
    //     this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    //     this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
    //     console.log(this.themeTopYs)
    // },
    destroyed() {
        console.log("??????")
        this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    methods:{
        imageLoad(){
            // console.log(this.$refs.scroll)
            this.$refs.scroll.refresh()
            this.getThemeTopY()
        },
        titleClick(index) {
            console.log(index)
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],100)
        },
        contentScroll(position) {
            const positionY = -position.y
            let length = this.themeTopYs.length
            for(let i = 0;i < length;i++){
                // i??????????????????????????????
                // parseInt(i)
                // 1. ????????????
                // if(this.currentIndex !== i && ((i < length-1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY > this.themeTopYs[i]))) {
                //     this.currentIndex = i;
                //     this.$refs.nav.currentIndex = this.currentIndex
                //     console.log(i)
                // }

                // 2. hack???????????????????????????????????????????????????????????????????????????????????????
                if(this.currentIndex !== i && i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
                    this.currentIndex = i;
                    this.$refs.nav.currentIndex = this.currentIndex
                    console.log(i)
                }

                // ????????????
                // 1.backTop????????????
                this.isShowBackTop = (-position.y) > 1000
            }
        },
        // backClick(){
        //     // x,y,??????
        //     // ?????????this.$refs.scroll.message
        //     this.$refs.scroll.scrollTo(0,0,500)
        // }
        addToCart() {
            console.log("------")
            // ????????????????????????????????????
            const product = {}
            product.image = this.topImages[0]
            product.title = this.goods.title
            product.desc = this.goods.desc
            product.price = this.goods.realPrice
            product.iid = this.iid

            // ??????????????????????????????
            // dispatch????????????promise
            this.$store.dispatch('addCart',product).then(res => {
                // 1. ??????????????????
                // this.show = true
                // this.message = res
                // setTimeout(() => {
                //     this.show = false
                //     this.message = ''
                // },1500)

                // 2. ??????
                this.$toast.show(res,2000)
                console.log(res)
            })
        }
    }
}
</script>

<style scoped>
    .detail{
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }
    .content{
        height: calc(100% - 44px - 49px);
        overflow: hidden;
    }
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
</style>