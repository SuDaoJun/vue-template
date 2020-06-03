<template>
  <div class='project-index'>
    <div class="index-header">
      <el-row :gutter="24">
        <el-col :lg="6" style="marginBottom: 18px">
          <chart-card title="总销售额" :total="126560 | NumFormat('￥')">
            <el-tooltip content="指标说明" slot="action" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
            <div class='header-trend header-wrap'>
              <div class="trend-box">
                <p>周同比</p>
                <div class="box-num">
                  <i class="el-icon-caret-bottom" style='color: #52C41A'></i>
                  <span><countTo :startVal='0' :endVal='12' :duration='3000' />%</span>
                </div>
              </div>
              <div class="trend-box">
                <p>日同比</p>
                <div class="box-num">
                  <i class="el-icon-caret-top" style='color: #F5222D'></i>
                  <span><countTo :startVal='0' :endVal='10' :duration='3000' />%</span>
                </div>
              </div>
            </div>
            <template slot="footer">日均销售额 <span>{{8846 | NumFormat}}</span></template>
          </chart-card>
        </el-col>
        <el-col :lg="6" style="marginBottom: 18px">
          <chart-card title="访问量" :total="8846 | NumFormat">
            <el-tooltip content="指标说明" slot="action" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
            <div class='header-chart'>
              <MyEcharts :style="{width: '100%', height: '55px'}" :option="lineOption">
              </MyEcharts>
            </div>
            <template slot="footer">日访问量 <span>{{1234 | NumFormat}}</span></template>
          </chart-card>
        </el-col>
        <el-col :lg="6" style="marginBottom: 18px">
          <chart-card title="支付笔数" :total="6560 | NumFormat">
            <el-tooltip content="指标说明" slot="action" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
            <div class='header-chart'>
              <MyEcharts :style="{width: '100%', height: '55px'}" :option="barOption">
              </MyEcharts>
            </div>
            <template slot="footer">转化率 <span>60%</span></template>
          </chart-card>
        </el-col>
        <el-col :lg="6" style="marginBottom: 18px">
          <chart-card title="线上购物转化率" total="78%">
            <el-tooltip content="指标说明" slot="action" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
            <div class='header-chart'>
              <el-progress color='#13C2C2' :percentage="78" :stroke-width="8" :show-text='false'></el-progress>
            </div>
            <template slot="footer">
              <div class='header-trend'>
                <div class="trend-box">
                  <p>周同比</p>
                  <div class="box-num">
                    <i class="el-icon-caret-bottom" style='color: #52C41A'></i>
                    <span>12%</span>
                  </div>
                </div>
                <div class="trend-box">
                  <p>日同比</p>
                  <div class="box-num">
                    <i class="el-icon-caret-top" style='color: #F5222D'></i>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </template>
          </chart-card>
        </el-col>
      </el-row>
    </div>
    <div class="index-list">
      <div class="list-header">
        <div class="header-tab">
          <div :class="tabActive == index?'tab-box tab-active':'tab-box'" v-for='(item,index) in tabList' :key='item.id'
            @click='tabChange(index)'>{{item.name}}</div>
        </div>
        <div class="header-choose">
          <div class="choose-date">
            <div :class="dateActive == index?'date-box date-active':'date-box'" v-for='(item,index) in dateList'
              :key='item.id' @click='dateChange(index)'>{{item.name}}</div>
              <el-color-picker v-model="colorArr.color1" size="mini" @change='colorChange'></el-color-picker>
          </div>
          <el-date-picker v-model="dateRange" type="daterange" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div class="list-content">
        <el-row>
          <el-col :lg="18">
            <div class="content-charts">
              <h4>销售额排行</h4>
              <MyEcharts :style="{width: '100%', height: '270px'}" :option="barTabOption">
              </MyEcharts>
            </div>

          </el-col>
          <el-col :lg="6">
            <div class="content-list">
              <h4>门店销售额排名</h4>
              <ul>
                <li :key="index" v-for="(item, index) in rankList">
                  <div class="rank-box">
                    <div :class="index < 3 ? 'rank-active rank-index' : 'rank-index'">{{ index + 1 }}</div>
                    <span>{{ item.name }}</span>
                  </div>
                  <span>{{ item.totalNum | NumFormat}}</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="index-analysis">
      <el-row :gutter="24">
        <el-col :lg="14">
          <div class="analysis-line">
            <h3>销售额类别占比</h3>
            <MyEcharts :style="{width: '100%', height: '400px'}" :option="lineAnalysisOption">
            </MyEcharts>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="analysis-pie">
            <div class="pie-header">
              <div class="header-title">
                <h3>销售额类别占比</h3>
                <div class="title-icon">
                  <i class="el-icon-camera"></i>
                  <i class="el-icon-document"></i>
                  <i class="el-icon-more-outline"></i>
                </div>
              </div>
              <el-radio-group v-model="saleChoose" @change='saleChange'>
                <el-radio-button v-for="(item,index) in saleList" :label="item" :key="index">{{item}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="pie-chart">
              <h4>销售额</h4>
              <MyEcharts :style="{width: '100%', height: '300px'}" :option="barAnalysisOption">
              </MyEcharts>
              <!-- <div class="chart-info">
                <div class="info-list" v-for='item in pieData' :key='item.name'>
                  <div class="list-title">
                    <i :style='{background: item.color}'></i>
                    <p>{{item.name}}</p>
                    <span>{{item.value}}%</span>
                  </div>
                  <div class="list-total">
                    {{item.numTotal | NumFormat('￥')}}
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-index {
  .index-header {
    .header-trend {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .trend-box {
        display: flex;
        align-items: center;
        p {
          color: #707378;
          margin-right: 6px;
        }
        .box-num {
          span {
            color: #42464C;
          }
        }
      }
    }
    .header-wrap {
      flex-wrap: wrap;
    }
  }
  .index-list {
    border-radius: 4px;
    margin-bottom: 18px;
    background-color: #fff;
    overflow: hidden;
    color: #707378;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .list-header {
      height: 55px;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-tab {
        height: 100%;
        line-height: 55px;
        display: flex;
        align-items: center;
        .tab-box {
          height: 100%;
          padding: 0 30px;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: #207DC2;
          }
        }
        .tab-active {
          color: #207DC2;
          position: relative;
          &::after {
            content: "";
            width: 100%;
            height: 2px;
            position: absolute;
            left: 0;
            top: 54px;
            background-color: #207DC2;
          }
        }
      }
      .header-choose {
        display: flex;
        align-items: center;
        .choose-date {
          margin-right: 50px;
          display: flex;
          align-items: center;
          .date-box {
            padding: 0 15px;
            cursor: pointer;
            &:hover {
              color: #207DC2;
            }
          }
          .date-active {
            color: #207DC2;
          }
        }
      }
    }
    .list-content {
      padding: 0 24px 24px;
      .content-charts {
        h4 {
          margin-bottom: 24px;
        }
      }
      .content-list {
        h4 {
          margin-bottom: 24px;
        }
        li {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .rank-box {
            display: flex;
            align-items: center;
            .rank-index {
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              margin-right: 24px;
              border-radius: 50%;
              background-color: #F2F2F2;
            }
            .rank-active {
              color: #fff;
              background-color: #207DC2;
            }
          }
        }
      }
    }
  }
  .index-analysis {
    color: #42464C;
    margin-bottom: 24px;
    .analysis-line {
      padding: 16px 24px;
      border-radius: 4px;
      border: 1px solid #EBEEF5;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      h3 {
        color: #707378;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 24px;
      }
    }
    .analysis-pie {
      padding: 16px 0;
      border-radius: 4px;
      border: 1px solid #EBEEF5;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .pie-header {
        padding: 0 16px 16px;
        border-bottom: 1px solid #E2E3E3;
        .header-title {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          h3 {
            color: #707378;
            font-size: 16px;
            font-weight: 500;
          }
          .title-icon {
            color: #707378;
            display: flex;
            align-items: center;
            i {
              font-size: 16px;
              margin-left: 20px;
              cursor: pointer;
            }
          }
        }
      }
      .pie-chart {
        padding: 32px 32px 0;
        position: relative;
        h4 {
          color: #707378;
          font-size: 16px;
          font-weight: 500;
        }
        .chart-info{
          width: 30%;
          position: absolute;
          top: 27%;
          right: 5%;
          .info-list{
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .list-title{
              display: flex;
              align-items: center;
              i{
                width:8px;
                height:8px;
                border-radius: 50%;
              }
              p{
                margin: 0 8px;
                line-height:22px;
              }
              span{
                color: #707378;
                padding: 0 8px;
                border-left: 1px solid #D9D9D9;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import ChartCard from "@/components/ChartCard";
import MyEcharts from "@/components/MyEcharts";
import countTo from 'vue-count-to';
export default {
  data() {
    return {
      lineOption: {},
      barOption: {},
      colorArr: {
        color1: "#5C8EFF"
      },
      tabList: [
        {
          id: "1",
          name: "销售额"
        },
        {
          id: "2",
          name: "访问量"
        }
      ],
      tabActive: 0,
      dateList: [
        {
          id: "1",
          name: "今日"
        },
        {
          id: "2",
          name: "本周"
        },
        {
          id: "3",
          name: "本月"
        },
        {
          id: "4",
          name: "全年"
        }
      ],
      dateActive: 0,
      dateRange: "",
      barTabOption: {},
      rankList: [],
      lineAnalysisOption: {},
      saleList: ["全部渠道", "线上", "门店"],
      saleChoose: "全部渠道",
      barAnalysisOption: {},
      pieData: [
        {
          name: "家用电器",
          value: 36,
          color: '#5C8EFF',
          numTotal: 4544
        },
        {
          name: "食用酒水",
          value: 20,
          color: '#13C2C2',
          numTotal: 3321
        },
        {
          name: "个护健康",
          value: 16,
          color: '#43D05D',
          numTotal: 3113
        },
        {
          name: "服饰箱包",
          value: 10,
          color: '#FAD337',
          numTotal: 2341
        },
        {
          name: "母婴产品",
          value: 9,
          color: '#FF5252',
          numTotal: 1231
        },
        {
          name: "其他",
          value: 9,
          color: '#975FE4',
          numTotal: 1231
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.initCharts();
    this.getRinkList();
  },
  methods: {
    getRinkList() {
      this.$api.index.rankList().then(res => {
        this.rankList = res.rankList;
      });
    },
    initCharts() {
      let timeData = [];
      let seriesData = [];
      let dateXData = [];
      let dateYData = [];
      let analysisXData = [];
      let analysisPerData = [];
      let analysisPayData = [];
      for (let i = 0; i < 17; i++) {
        let dataTime = "2019-08-0" + i + 1;
        let numData = Math.floor(Math.random() * (100 - 20 + 1) + 20);
        timeData.push(dataTime);
        seriesData.push(numData);
      }
      for (let i = 0; i < 12; i++) {
        let dataTime = i + 1 + "月";
        let numData = Math.floor(Math.random() * (1000 - 20 + 1) + 20);
        dateXData.push(dataTime);
        dateYData.push(numData);
      }
      for (let i = 0; i < 24; i++) {
        let num = i < 10 ? `0${i}:00` : `${i}:00`;
        let numData = Math.floor(Math.random() * (75 - 10 + 1) + 10);
        let numDatas = Math.floor(Math.random() * (75 - 10 + 1) + 10);
        analysisXData.push(num);
        analysisPerData.push(numData);
        analysisPayData.push(numDatas);
      }
      this.lineOption = {
        grid: {
          left: 0,
          top: "5%",
          bottom: 0,
          right: 0
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          show: false,
          type: "category",
          boundaryGap: false,
          data: timeData
        },
        yAxis: {
          show: false
        },
        series: [
          {
            name: "访问量",
            type: "line",
            smooth: true,
            showSymbol: false,
            symbol: "circle",
            symbolSize: 2,
            lineStyle: {
              color: "transparent"
            },
            itemStyle: {
              color: "#8543E0",
              emphasis: {
                borderColor: "#fff",
                borderWidth: 2
              }
            },
            areaStyle: {
              color: "#8543E0"
            },
            data: seriesData
          }
        ]
      };
      this.barOption = {
        grid: {
          left: 0,
          top: "5%",
          bottom: 0,
          right: "5%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(150,150,150,.2)"
            }
          }
        },
        xAxis: {
          show: false,
          type: "category",
          boundaryGap: false,
          data: timeData
        },
        yAxis: {
          show: false
        },
        series: [
          {
            name: "支付笔数",
            type: "bar",
            itemStyle: {
              color: "#33ABFB"
            },
            data: seriesData
          }
        ]
      };
      this.barTabOption = {
        grid: {
          left: "0",
          top: "5%",
          bottom: "5%",
          right: "8%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(150,150,150,.2)"
            }
          }
        },
        xAxis: {
          show: true,
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#707378"
            }
          },
          axisLabel: {
            color: "#707378"
          },
          data: dateXData
        },
        yAxis: {
          show: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: "#707378"
          },
          splitLine: {
            lineStyle: {
              type: "dotted",
              color: "rgba(150,150,150,.2)"
            }
          }
        },
        series: [
          {
            name: "销售额",
            type: "bar",
            itemStyle: {
              color: this.colorArr.color1
            },
            data: dateYData
          }
        ]
      };
      this.lineAnalysisOption = {
        grid: {
          left: "0",
          top: "10%",
          bottom: "10%",
          right: "2%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          right: "2%",
          inactiveColor: 'rgba(112,115,120,.5)',
          textStyle: {
            color: 'rgba(112,115,120,1)'
          },
          icon: 'circle'
        },
        dataZoom: [
          {
            type: "slider",
            start: 20,
            end: 80,
            height: 24,
            bottom: 0,
            borderColor: 'rgba(255,255,255,.1)',
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        xAxis: {
          show: true,
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#707378"
            }
          },
          axisLabel: {
            color: "#707378"
          },
          data: analysisXData
        },
        yAxis: {
          show: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: "#707378"
          },
          splitLine: {
            lineStyle: {
              type: "dotted",
              color: "rgba(150,150,150,.2)"
            }
          }
        },
        series: [
          {
            name: "客流量",
            type: "line",
            symbol: "circle",
            symbolSize: 2,
            itemStyle: {
              normal: {
                color: "#1890FF"
              },
              emphasis: {
                borderColor: "#fff",
                borderWidth: 3
              }
            },
            data: analysisPerData
          },
          {
            name: "支付笔数",
            type: "line",
            symbol: "circle",
            symbolSize: 2,
            itemStyle: {
              normal: {
                color: "#2FC25B"
              },
              emphasis: {
                borderColor: "#fff",
                borderWidth: 3
              }
            },
            data: analysisPayData
          }
        ]
      };
      let colorList = [
        "#5C8EFF",
        "#13C2C2",
        "#43D05D",
        "#FAD337",
        "#FF5252",
        "#fca4bb",
        "#975FE4"
      ];
      let propTheme = localStorage.getItem('propTheme') && localStorage.getItem('propTheme') == 'custom-light'?true:false;
      let pieObj = {};
      if(propTheme){
        pieObj = {
          titleColor: 'rgba(0,0,0,0.45)',
          titleSubColor: 'rgba(0,0,0,0.85)',
          normalColor: '#ffffff'
        }
      }else{
        pieObj = {
          titleColor: 'rgba(255,255,255,0.6)',
          titleSubColor: 'rgba(255,255,255,0.9)',
          normalColor: '#242930'
        }
      }
      this.barAnalysisOption = {
        color: colorList,
        title: {
            text: '销售总额',
            textStyle: {
                color: pieObj.titleColor,
                fontSize: 14,
            },
            subtext: `￥ ${this.$options.filters.NumFormat(123224)}`,
            subtextStyle: {
                color: pieObj.titleSubColor,
                fontSize: 24,
            },
            textAlign: 'center',
            top: '30%',
            left: '49%',
        },
        legend: {
          left: "center",
          bottom: "0",
          itemWidth: 8,
          itemHeight: 8,
          itemGap : 12,
          inactiveColor: 'rgba(112,115,120,.5)',
          textStyle: {
            color: 'rgba(112,115,120,1)'
          },
          icon: 'circle',
          formatter: (name) => {
            // return name
            let pieData = this.pieData;
            for(let i = 0; i < pieData.length; i++){
              if(name === pieData[i].name){
                  let nameShow = `${pieData[i].name}-${pieData[i].value}%-${this.$options.filters.NumFormat(pieData[i].numTotal,'￥')}`;
                  return nameShow
                }
            }
          }
        },
        tooltip: {
            trigger: 'item',
            formatter: (parms) => {
              let str=  parms.marker+""+parms.data.name+"</br>"+
                "销售额："+ this.$options.filters.NumFormat(parms.data.numTotal)+"</br>"+
                "占比："+ parms.value+"%";
                return  str ;
            }
        },
        series: [
          {
            type: "pie",
            minAngle: 2, //最小的扇区角度（0 ~ 360）
            radius: ["50%", "70%"],
            center: ["50%", "40%"],
            avoidLabelOverlap: false,
            itemStyle: {
              //图形样式
              normal: {
                borderColor: pieObj.normalColor,
                borderWidth: 6
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: this.pieData
          }
        ]
      };
    },
    colorChange(color){
      this.barTabOption.series[0].itemStyle.color = color;
    },
    tabChange(index) {
      if (this.tabActive != index) {
        this.tabActive = index;
        this.echartChange();
      }
    },
    echartChange() {
      let dateYData = [];
      for (let i = 0; i < 12; i++) {
        let numData = Math.floor(Math.random() * (1000 - 20 + 1) + 20);
        dateYData.push(numData);
      }
      this.barTabOption.series[0].data = dateYData;
    },
    dateChange(index) {
      if (this.dateActive != index) {
        this.dateActive = index;
        this.echartChange();
      }
    },
    saleChange() {
      console.log(this.saleChoose);
    }
  },
  components: {
    ChartCard,
    MyEcharts,
    countTo
  },
  computed: {}
};
</script>
