<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="middle" class="title">
        <div class="title-item" 
          v-for="(item,index) in titles" 
          :key="index"
          :class="{active : index === currentIndex}"
          @click="titleClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavTab'

export default {
  name:'DetailNavBar',
  components:{
    NavBar
  },
  data(){
    return {
      titles:['商品','参数','评论','推荐'],
      currentIndex:0
    }
  },
  methods: {
    titleClick(index){
      this.currentIndex = index
      this.$emit('titleClick',index)
    },
    backClick() {
      this.$router.back()
    }
  }

}
</script>

<style>
  .title{
    display: flex;
  }
  .title-item{
    flex: 1;
    font-size: 13px;
  }
  .active{
    color: var(--color-high-text);
  }
  .back img{
    /* margin-top: 12px; */
    vertical-align: middle;
    height: 20px;
    width: 20px;
  }
</style>