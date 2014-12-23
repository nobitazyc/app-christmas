$(function(){
	$(".item").on("swipeleft",function(){
      $('.carousel').carousel('next');
    });
    $(".item").on("swiperight",function(){
      $('.carousel').carousel('prev');
    });

});

(function(){

	var jujuapp = angular.module("jujuapp",[]);
	var host = 'http://appwap.juju.la/';

	jujuapp.factory('mySharedService', function($rootScope) {
	    return {
	        broadcast: function() {
	            $rootScope.$broadcast('handleBroadcast');
	        }
	    };
	});



	jujuapp.controller("gameController",['$scope','$http','mySharedService',function($scope,$http, sharedService ){

		//这里是get请求接口的方法，其他的请求接口也按照这个方式
		$scope.data = []; // 这里需要获取接口1，获取用户基本资料
		$http.get(host + 'yj/me?userid=' + uid).success(function(data){
			//console.log(data);
			$scope.data = data;
		})
		$scope.result = 0;
		$scope.clickcheck = false;
		$scope.play = function(){
			$scope.clickcheck = true;
			$http.get(host + 'yj/randapi').success(function(data){
				$scope.result = data.result;
			})

			$scope.data.play_last_count--;
			$('.game-play').css('display',"none");
			$('.game-gif').attr('src','img/game-animation.gif');
			sharedService.broadcast();
			setTimeout(function(){
				switch($scope.result){
					case 0:{
						$('#comedy').modal('show');
						break;
					}
					case 1:{
						$('#friend').modal('show');
						break;
					}
					case 2:{
						$('#gift').modal('show');
						break;
					}
					case 3:{
						$('#extra-invite').modal('show');
						break;
					}
				}

			$('.game-gif').attr('src','img/gamestart.png');
			$('.game-play').css('display',"inline-block");
			$scope.clickcheck = false;
			}, 4500);

			//这里需要接口9储存抽奖信息， 参数为$scope.
		};
		$scope.changeimg = function(){
			if(!$scope.clickcheck)
			$('.game-gif').attr('src','img/gamestart-hover.png');
		}
		$scope.reverseimg = function(){
			if(!$scope.clickcheck)
			$('.game-gif').attr('src','img/gamestart.png');
		}
	}]);




	jujuapp.controller("inviteController",['$scope','$http',function($scope, $http){
		$scope.current_user = [];//这里调用接口1，获取用户基本资料
		$http.get(host + 'yj/me?userid=' + uid).success(function(data){
			$scope.current_user = data;
		});
		$http.get(host + 'yj/fans?userid=' + uid).success(function(data){
			$scope.data = data;
		});
		//$scope.data = followings.users; //这里调用接口8获得观众用户信息
		$scope.show_data = $scope.data;
		$scope.invite_user = "";
		$scope.filterInvite = function(){
			var i=0;
			var length =  $scope.data.length;
			if($scope.invite_user == ""){
				$scope.show_data = $scope.data;
			}
			else{
				$scope.show_data = [];
				for(i = 0;i<length; i++){
					if($scope.data[i].username.indexOf($scope.invite_user) > -1){
						$scope.show_data.push($scope.data[i]);
					}
				}
			}
			if($scope.show_data.length<7){
				//console.log('here');
				$(".invite_dropdown").css("top",(30*(6-$scope.show_data.length)-183)+"px");
			}
			else{
				$(".invite_dropdown").css("top","-187px");
			}

		};
		$scope.checkInvite = function(index){
			$scope.invite_user = $scope.show_data[index].username;
			$scope.invite_userid = $scope.show_data[index].userid;
		};
		$scope.inAnimation = function(){
			$('.graph-button').css("margin-top","-20px");
			$('.graph-button').css("margin-bottom","20px");
		};
		$scope.outAnimation = function(){
			$('.graph-button').css("margin-top","0px");
			$('.graph-button').css("margin-bottom","0px");
		};
		$scope.sendInvite = function(){
			$http.get(host + 'yj/invite?userid='+uid+'&invite_user:'+$scope.invite_userid
			).success(function(data){
				if (data.result == '-1') {
					alert('邀请失败！');
					return;
				}
				alert('邀请成功！');
			});
			//console.log($scope.invite_userid);
			//这里调用接口12发送邀请，参数$scope.current_user.username, $scope.invite_user
		};
	}]);


	jujuapp.controller("comedyController",['$scope','$http','mySharedService',function($scope, $http, sharedService){
		//$scope.data = comedy; //这里调用接口2获得吐槽信息
		$scope.$on('handleBroadcast', function(event) {
			$http.get(host + 'yj/gettucao?userid=' + uid).success(function(data){
				$scope.data = data;
				//$scope.data = comedy; //这里调用接口2获得新的吐槽信息
			});
	  });
	}]);


	jujuapp.controller("giftController",['$scope','$http',function($scope,$http){
		$scope.data = gift; //这里调用接口4获取奖品信息
		$scope.share = function(){
			//分享的function在这里
		}
		$scope.$on('handleBroadcast', function(event) {
	    //$scope.data = gift; //这里调用接口4获取新奖品信息
	    $http.get(host + 'yj/prize?userid=' + uid).success(function(data){
				$scope.data = data;
				//$scope.data = comedy; //这里调用接口2获得新的吐槽信息
			});
	  });
	}]);


	jujuapp.controller("friendController",['$scope','$http',function($scope,$http){
		$scope.current_user = [];
		$http.get(host + 'yj/me?userid=' + uid).success(function(data){
			$scope.current_user = data;
		});  //这里调用接口1，获取用户基本资料
		$scope.content = "";
		$scope.sendJujuFriends =function(){
			//console.log('sendJujuFriends');
			//这里需要调用接口11，发送juju friend,参数为 $scope.current_user.username, $scope.content
		};
	}]);


	//推荐用户部分 暂时不用
	jujuapp.controller("recommendController",['$scope','$http',function($scope,$http){
		//$scope.data = recommend; //这里需要调用接口3，获取推荐用户信息
		//
		$http.get(host + 'yj/recuser?userid=' + uid).success(function(data){
				$scope.data = data;
				//$scope.data = comedy; //这里调用接口2获得新的吐槽信息
		});
		$scope.togglefollow = function(){
			if($scope.data.followed)
			{
				$scope.data.followed=false;
				//这里需要调用接口10，储存关注信息，参数为current_user.username, $scope.data.username, $scope.data.followed
			}
			else
			{
				$scope.data.followed=true;
				//这里需要调用接口10，储存关注信息，参数为current_user.username, $scope.data.username, $scope.data.followed

			}
		};
		$scope.$on('handleBroadcast', function(event) {
	        $scope.data = recommend; //这里需要调用接口3，获取新推荐用户信息
	    });
	}]);



	jujuapp.controller("wishController",['$scope','$http',function($scope,$http){
		$scope.newWish = {};
		//$scope.myWish = mywish; //这里调取接口7获取个人许愿信息
		$http.get(host + 'yj/mydream?userid=' + uid).success(function(data){
			$scope.myWish = data;
		});
		$http.get(host + 'yj/getdreams?userid=' + uid).success(function(data){
			$scope.wishes = data.wishes;
		});
		//$scope.wishes = wishes.wishes; //这里调用接口6获取许愿信息
		$scope.current_user = [] //这里调用接口1，获取用户基本资料
		$http.get(host + 'yj/me?userid=' + uid).success(function(data){
			$scope.current_user = data;
		});
		$scope.share = function(){
			//分享function写这里
		}
		$scope.popMyWish = function(){
			$('#mywish').modal('show');
		}

		$scope.refresh = function(){
			$http.get(host + 'yj/getdreams?userid=' + uid).success(function(data){
				$scope.wishes = data.wishes;
			});
		}
		$scope.postWish = function(){

			$scope.newWish = {
				username: $scope.current_user.username,
				wished: true,
				content: $scope.newWish.content,
				like_count: $scope.myWish.like_count
			};
			$scope.myWish = $scope.newWish;
			$scope.newWish = {};
			$http.get(host + 'yj/dodream?userid=' + uid +"&content=" + $scope.myWish.content ).success(function(data){
				//console.log('已储存');
			});
			
			//这里调用接口14储存许愿信息， 参数为$scope.myWish.username, $scope.myWish.content,$scope.myWish.like_count
		};
		$scope.likeit = function(index){
			$scope.wishes[index].i_liked = true;
			$http.get(host + 'yj/favourdream?userid=' + uid +'&dreamid=' + $scope.wishes[index].dreamid).success(function(data){
				//
			});
			//这里调用接口13储存点赞信息，参数$scope.current_user.username, $scope.wishes[index].username, true
		};
		$scope.dislikeit = function(index){
			$scope.wishes[index].i_liked = false;
			//这里调用接口13储存点赞信息，参数$scope.current_user.username, $scope.wishes[index].username, false

		};
	}]);


	var me =
	{
		username:"nobitanobi",
		play_last_count:10,
		avarta:"img/avarta.jpg"
	};

	var followings = {
		users:[
			{
				username:"aaa"
			},
			{
				username:"bbb"
			},
			{
				username:"ccc"
			},
			{
				username:"ddd"
			},
			{
				username:"eee"
			},
			{
				username:"fff"
			},
			{
				username:"abb"
			}
		]
	};
	var comedy =
	{
		title:"这是标题",
		content:"吐槽吐槽吐槽吐槽吐槽"
	};
	var comedy2 ={
		title:"这是标题2",
		content:"吐槽吐槽吐槽吐槽吐槽2"
	};


	var recommend =
	{
		username:"nobitanobi",
		avarta:"img/avarta.jpg",
		attribute:"动漫",
		followed:false
	};

	var gift =
	{
		gift_title:"奖品标题",
		gift_image:"img/gift.jpg",
		gift_description:"这是介绍这是介绍这是介绍这是介绍这是介绍"
	};

	var wishes = {
		wishes:[
			{
				username:"用户1",
				avarta:"img/avarta3.jpg",
				content:"愿望愿望愿望愿望愿望",
				i_liked:false
			},
			{
				username:"jaisod",
				avarta:"img/avarta3.jpg",
				content:"愿望2愿望2愿望2愿望2愿望2愿望2愿望2愿望2愿望2",
				i_liked:false
			},
			{
				username:"sodjfoaj",
				avarta:"img/avarta4.jpg",
				content:"愿望3愿望3愿望3愿望4愿望3愿望3愿望3愿望3愿望3",
				i_liked:false
			},
			{
				username:"sodjfoaj",
				avarta:"img/avarta4.jpg",
				content:"愿望3愿望3愿望3愿望4愿望3愿望3愿望3愿望3愿望3",
				i_liked:false
			}
		]
	};

	var mywish =
	{
		username:"nobitanobi",
		wished:false,
		content:"",
		like_count:100,
	};

})();
