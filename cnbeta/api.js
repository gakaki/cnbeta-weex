/**
 * Created by baidu on 16/6/8.
 */

var md5    	= require('./md5');
var stream 	= require('@weex-module/stream');
var modal 	= require('@weex-module/modal');
var md52    = require('./md52');

var API_PARAMS = {
	
	APP_KEY                     : "10000",
	FORMAT                      : "json",
	V                           : "1.0",
	EXTRA                       : "mpuffgvbvbttn3Rc",
                                
	KEY_METHOD                  : "method",
	KEY_END_SID                 : "end_sid",
	KEY_TOPICID                 : "topicid",
	KEY_RANK_TYPE               : "type",
	KEY_SID                     : "sid",
	KEY_PAGE                    : "page",
	KEY_PAGE_SIZE               : "pageSize",
	KEY_OP                      : "op",
	KEY_TID                     : "tid",
	KEY_PID                     : "pid",
                               	
	VALUE_PAGE_SIZE             : "20"

};

var API_URLS 	= {
	 ENDPOINT                  : "http://api.cnbeta.com/capi",
   METHOD_NEWS_LISTS           : "Article.Lists",
   METHOD_NEWS_CONTENT         : "Article.NewsContent",
   METHOD_TOP_TEN              : "Article.Top10",
   METHOD_NEWS_COMMENT         : "Article.Comment",
   METHOD_RECOMMEND_COMMENT    : "Article.RecommendComment",
   METHOD_DO_COMMENT           : "Article.DoCmt",
   METHOD_DAY_RANK             : "Article.TodayRank",
   METHOD_NEWS_LISTS           : "Article.Lists",
   METHOD_NEWS_CONTENT         : "Article.NewsContent",
   METHOD_TOP_TEN              : "Article.Top10"

};


var ApiReq = {

  assembleParam:function(params){

      var s                     = [];
      for(var k in params){
          var v                 = params[k]
          s.push(k)
          s.push('=')
          s.push(v)
          s.push('&')
      }
      s                         = s.join("")
      s                         = s + API_PARAMS.EXTRA;
      return s
  },

  buildUrl:function(params){

      var paramString           = this.assembleParam(params);
      var sign                  = md52.MD5(paramString);
      var last_url              = API_URLS.ENDPOINT + "?" + paramString + "&sign=" + sign;
      // modal.toast({'message': last_url, 'duration': 1});
      return last_url;
  },

  // sortByAlphaKey(o) {
  //     return o.sort(function(a, b){
  //         if( a.toLowerCase() < b.toLowerCase() ) return -1;
  //         if( a.toLowerCase() > b.toLowerCase() ) return 1;
  //         return 0;
  //     })
  // },

  getData:function(url, callback) {
    stream.sendHttp({
        method: 'GET',
        url: url
    }, function (ret) {
        
        var retdata = JSON.parse(ret);
        callback(retdata);
    });
  },
  sortByAlphaKey:function(o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
  },
    apiURL:function(method_name,other_params){
        var timestamp             = new Date().getTime();
        var params                = {

            "app_key"             : API_PARAMS.APP_KEY,
            "format"              : API_PARAMS.FORMAT,
            "timestamp"           : timestamp,
            "v"                   : API_PARAMS.V,
            "method"              : method_name,
        };
        for (var i in other_params) {
            params[i] = other_params[i];
        }
        params                    = this.sortByAlphaKey(params);
        var urlString             = this.buildUrl(params);
        return urlString;
    },
    apiBaseReq:function( url, params , callback ){
        var  url =  this.apiURL( url , params);
        ApiReq.getData( url  , callback);
    }
}

exports.getNewsList = function (callback) {
    ApiReq.apiBaseReq( API_URLS.METHOD_NEWS_LISTS,{ page:12 } ,callback );
};
exports.getNewsContent = function (sid,callback) {
    ApiReq.apiBaseReq( API_URLS.METHOD_NEWS_CONTENT,{ "sid" : sid } ,callback );
};