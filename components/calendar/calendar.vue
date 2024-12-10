<template>
  <view>
    <view class="calendar">
      <!-- 	<view class="detail">
				<view class="datedetail">{{ datedetail }}</view>
				<view class="festival">{{ festival }}</view>
			</view> -->
      <view class="calendarhead">
        <view class="tr">
          <text>日</text>
          <text>一</text>
          <text>二</text>
          <text>三</text>
          <text>四</text>
          <text>五</text>
          <text>六</text>
        </view>
      </view>
      <swiper
        class="swiper"
        :current="current"
        @change="change"
        circular="true"
        :style="'height:' + sheight + 'px'"
      >
        <swiper-item v-for="(sitem, sindex) in swiper" :key="sindex">
          <view class="week" v-for="i in allDateLong" :key="i">
            <view class="tr">
              <block v-for="(noritem, idx) in normalDateList[i]" :key="idx">
                <text
                  style="position: relative;"
                  :class="{
                    aorange: idx == 0 || idx == 6,
                    agreen: noritem.isToday
                  }"
                  @tap="choose(noritem.text, i)"
                >
                  {{ noritem.text }}
				  
				  <image
				    @tap="choose(noritem.text, i)"
				    v-if="showMark(noritem.text)"
				    class="mark"
				    src="../../static/images/dark-calendar/mark2.png"
				  ></image>
                </text>
             
              </block>
            </view>
            <view class="tr tr2">
              <block v-for="(lunitem, idx) in lunarDateList[i]" :key="idx">
                <text
                  :class="{
                    aorange: idx == 0 || idx == 6,
                    agreen: lunitem.isToday
                  }"
                  @tap="choose(lunitem.days, i)"
                  >{{ lunitem.text }}</text
                >
              </block>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <view class="show" v-if="show" @tap="toggle"
        ><image
          src="../../static/images/dark-calendar/ico-arrow-up.png"
          mode=""
        ></image
      ></view>
      <view class="show close" v-else @tap="toggle"
        ><image
          src="../../static/images/dark-calendar/ico-arrow-up.png"
          mode=""
        ></image
      ></view>
    </view>
    <!-- 
		<view class="panel">
			<view @tap="changeDate('YU')">上一年↑</view>
			<view @tap="changeDate('YD')">下一年↓</view>
			<view @tap="changeDate('MU')">上一月↑</view>
			<view @tap="changeDate('MD')">下一月↓</view>
			<view @tap="changeDate('')">当前月</view>
		</view> -->
  </view>
</template>

<script>
import Calendar from "./calendar.js";
export default {
  props: {
    marks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sheight: 250,
      Calendar: {},
      normalDateList: [],
      lunarDateList: [],
      flag: true,
      init: false,
      datedetail: "",
      festival: "",
      swiper: [1, 2, 2],
      current: 1,
      show: true,
      allDateLong: [0, 1, 2, 3, 4, 5],
      showItemIndex: 0
    };
  },
  created() {
    Calendar.initial();
    this.changeDateStatus();
    this.$emit("created");
  },
  watch: {
    init(val) {
      this.normalDateList = Calendar.normalDateList;
      this.lunarDateList = Calendar.lunarDateList;
      this.datedetail = Calendar.datedetail;
      this.festival = Calendar.festival;
      this.showItemIndex = Calendar.showItemIndex;
      this.doToggle();
    }
  },
  methods: {
    toggle() {
      if (this.show) {
        this.show = false;
        this.normalDateList = [this.normalDateList[this.showItemIndex]];
        this.lunarDateList = [this.lunarDateList[this.showItemIndex]];
        this.sheight = 60;
      } else {
        this.show = true;
        this.sheight = 280;
        this.changeDateStatus();
      }
    },
    doToggle() {
      if (!this.show) {
        this.normalDateList = [this.normalDateList[this.showItemIndex]];
        this.lunarDateList = [this.lunarDateList[this.showItemIndex]];
        this.sheight = 60;
      }
    },
    change(e) {
      let Bt = this.current;
      let Nt = e.detail.current;
      if (Bt == 0) {
        if (Nt == 2) {
          this.resMonth();
          this.current = Nt;
          return;
        }
      }
      if (Bt == 2) {
        if (Nt == 0) {
          this.addMonth();
          this.current = Nt;
          return;
        }
      }
      if (Nt > Bt) {
        this.addMonth();
      } else {
        this.resMonth();
      }
      this.current = Nt;

      this.$emit("switch");
    },
    addMonth() {
      if (!this.show) {
        this.changeDate("WD");
      } else {
        this.changeDate("MD");
      }
    },
    resMonth() {
      if (!this.show) {
        this.changeDate("WU");
      } else {
        this.changeDate("MU");
      }
    },
    choose(item, index) {
      //console.log(item);
      if (item !== undefined && item !== " ") {
        this.changeDateStatus();
        Calendar.setToday(item);
        this.showItemNum = index;
        this.$emit("change", item);
      }
    },
    changeDateStatus() {
      if (this.init) {
        this.init = false;
      } else {
        this.init = true;
      }
    },

    changeDate(type) {
      this.changeDateStatus();

      Calendar.pushBtm(type);
    },
    getCalendar() {
      return Calendar;
    },
    showMark(d) {
      return this.marks.indexOf(d) > -1;
    }
  }
};
</script>

<style lang="scss" scoped>
.aorange {
  color: #ff5f07;
  font-weight: bold;
}
.agreen {
  background-color: $uni-color-info !important;
  color: #fff !important;
}

.one {
  color: #000;
  font-weight: normal;
}

.spc {
  color: #ff5f07;
}

.calendar {
  float: left;
  text-align: center;
  width: 100%;
  border-bottom: 1rpx solid $border-color-dark;
  border-top: 0;
  height: auto;
  box-sizing: border-box;
  background-color: #fff;
}
.calendarhead {
  color: #fafbfb;
  border: 0;
  padding: 0;
  margin: 0;
  background-color: $uni-color-primary;
  width: 100%;
  flex-direction: column;
}
.calendarhead .tr {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.calendarhead text {
  flex: 1;
  font-size: 40rpx;
  padding: 1rpx;
  text-align: center;
}

.week {
  width: 100%;
  display: flex;
  background-color: #fff;
  border: 0;
  padding: 0;
  margin: 0;
  flex-direction: column;
  padding: 10rpx 0;
}
.week .tr {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.week text {
  flex: 1;
  padding: 1px;
  margin: 0;
  // border-bottom: 1px solid #efefef;
  // border-left: 1px solid #efefef;
  height: 20px;
  overflow: hidden;
}

.tr2 text {
  // background-color: #e8f5f9;
  font-size: 24upx;
}
.show {
  image {
    width: 80rpx;
    height: 40rpx;
  }
  &.close {
    image {
      transform: rotate(180deg);
    }
  }
}

.mark {
  position: absolute;
  height: 40rpx !important;
  width: 40rpx;
  display: inline-block;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
}
</style>
