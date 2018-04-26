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

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
  data: {
    nowTemp: "",
    nowWeather: "",
    nowWeatherBackground: "",
    forecast: [],
    todayDate: "",
    todayTemp: "",
    city: "HOME",
    locationAuthType: UNPROMPTED
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: "BESBZ-M3B34-VYXUJ-D33PM-ODLIE-FTBXT"
    });

    wx.getSetting({
      success: res => {
        const auth = res.authSetting["scope.userLocation"];
        this.setData({
          locationAuthType: auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED,
        });
        if (auth) {
          this.getCityAndWeather();
        } else {
          this.getNow();
        }
      }
    });
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  getNow(callback) {
    wx.request({
      url: "https://test-miniprogram.com/api/weather/now",
      data: {
        city: this.data.city
      },
      success: res => {
        const result = res.data.result;
        console.log(result);

        this.setNow(result.now);
        this.setForecast(result.forecast);
        this.setToday(result.today);
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
        time: `${(nowHour + item.id * 3) % 24} 时`,
        iconPath: "/images/" + item.weather + "-icon.png",
        temp: item.temp + "°",
      });
    };
    forecast[0].time = "现在";

    this.setData({
      forecast: forecast,
    });
  },
  setToday(today) {
    const date = new Date();
    this.setData({
      todayTemp: `${today.minTemp}° - ${today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    });
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: "/pages/list/list?city=" + this.data.city,
    })
  },
  onTapLocation() {
    if (this.data.locationAuthType === UNAUTHORIZED) {
      wx.openSetting({
        success: res => {
          if (res.authSetting["scope.userLocation"]) {
            this.getCityAndWeather();
          }
        }
      });
    } else {
      this.getCityAndWeather();
    }
  },
  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED
        });

        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            this.setData({
              city: res.result.address_component.city,
            });
            this.getNow();
          },
        });
      },
      fail: res => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        });
      },
    });
  }
})
