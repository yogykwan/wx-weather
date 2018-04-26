const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data: {
    nowTemp: "",
    nowWeather: "",
    nowWeatherBackground: "",
  },
  onLoad() {
    this.getNow();
  },
  onPullDownRefresh() {
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  getNow(callback) {
    wx.request({
      url: "https://test-miniprogram.com/api/weather/now",
      data: {
        city: "beijing"
      },
      header: {
        "content-type": "application/json",
      },
      success: res => {
        const result = res.data.result;
        console.log(result);

        const temp = result.now.temp;
        const weather = result.now.weather;
        console.log(temp, weather);

        this.setData({
          nowTemp: temp + "°",
          nowWeather: weatherMap[weather],
          nowWeatherBackground: "/images/" + weather + "-bg.png",
        });

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete: () => {
        callback && callback();
      },
    })
  },
})
