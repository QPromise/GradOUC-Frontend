// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var http = require("http");
  var cheerio = require("cheerio");
  //准备抓取的网站链接
  var dataUrl = "http://www.mcake.com/shop/110/index.html#mainer_top";
  http.get(dataUrl, function (res) {
    var str = "";
    //绑定方法，获取网页数据
    res.on("data", function (chunk) {
      str += chunk;
    })
    //数据获取完毕
    res.on("end", function () {
      //调用下方的函数，得到返回值，即是我们想要的img的src
      var data = getData(str);
      console.log(data);
    })
  })
  //根据得到的数据，处理得到自己想要的
  function getData(str) {
    //沿用JQuery风格，定义$
    var $ = cheerio.load(str);
    //获取的数据数组
    var arr = $(".pro_box a:nth-child(1) img");
    var dataTemp = [];
    //遍历得到数据的src，并放入以上定义的数组中
    arr.each(function (k, v) {
      var src = $(V).attr("src");
      dataTemp.push(src);
    })
    //返回出去
    return dataTemp;
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}