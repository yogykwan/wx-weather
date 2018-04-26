const dayMap = [
  "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六",
]

Page({
  data: {
    weekWeather: [],
    city: "",
  },
  onLoad(options) {
    this.setData({
      city: options.city
    });
    this.getWeekWeather();
  },
  onPullDownRefresh() {
    this.getWeekWeather(()=>{
      wx.stopPullDownRefresh();
    });
  },
  getWeekWeather(callback) {
    wx.request({
      url: "https://test-miniprogram.com/api/weather/future",
      data: {
        city: "beijing",
        time: new Date().getTime()
      },
      success: res => {
        const result = res.data.result;
        console.log(result);

        this.setWeekWeather(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setWeekWeather(result) {
    let weekWeather = []
    for (let key in result) {
      const item = result[key];
      let date = new Date();
      date.setDate(date.getDate() + item.id);
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${item.minTemp}° - ${item.maxTemp}°`,
        iconPath: "/images/" + item.weather + "-icon.png",
      });
    };
    weekWeather[0].day = "今天";
    this.setData({
      weekWeather: weekWeather,
    });
  }
})