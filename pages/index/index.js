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
    forecast: [],
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

        this.setNow(result.now);
        this.setForecast(result.forecast);
      },
      complete: () => {
        callback && callback();
      },
    })
  },
  setNow(now) {
    const weather = now.weather;

    this.setData({
      nowTemp: now.temp + "°",
      nowWeather: weatherMap[weather],
      nowWeatherBackground: "/images/" + weather + "-bg.png",
    });

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    });
  },
  setForecast(forecastRes) {
    const nowHour = new Date().getHours();
    let forecast = []
    for (let key in forecastRes) {
      const item = forecastRes[key];
      forecast.push({
        time: (nowHour + item.id * 3) % 24 + "时",
        iconPath: "/images/" + item.weather + "-icon.png",
        temp: item.temp + "°",
      });
    };
    forecast[0].time = "现在";

    this.setData({
      forecast: forecast,
    });
  }
})
