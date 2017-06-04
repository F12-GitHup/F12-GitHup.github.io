//让播放动画小块参差不齐
$(".playAni span").each(function(i){
	var num=Math.random()*80;
	var num1=Math.random()*10;
	$(this).css({
		transform:"translateY("+num+"%)",
		animationDelay:(num1*0.1)+'s'
	})
})





//歌曲数据数组
var musicArr=[
	{name:"GARNIDELIA",src:"music/1.mp3",img:"img/1.jpg",author:"極楽浄土"},
	{name:"ピコ太郎",src:"music/2.mp3",img:"img/2.jpg",author:"PPAP"},
	{name:"最炫民族风",src:"music/3.mp3",img:"img/3.jpg",author:"凤凰传奇"},
	{name:"怪你过份美丽 ",src:"music/4.mp3",img:"img/4.jpg",author:"张国荣 "},
	{name:"耶咯耶",src:"music/5.mp3",img:"img/5.jpg",author:"张玮"},
	{name:"好妹妹乐队",src:"music/6.mp3",img:"img/5.jpg",author:"不说再见"},
	{name:"咱们结婚吧",src:"music/7.mp3",img:"img/6.jpg",author:"齐晨"},
	{name:"相信自己",src:"music/8.mp3",img:"img/6.jpg",author:"成龙"},
	{name:"口哨歌1",src:"music/9.mp3",img:"img/6.jpg",author:"古德"},
	{name:"口哨歌2",src:"music/10.mp3",img:"img/6.jpg",author:"古德"},
	{name:"口哨歌3",src:"music/11.mp3",img:"img/6.jpg",author:"古德"},
	{name:"口哨歌4",src:"music/12.mp3",img:"img/6.jpg",author:"古德"},
	{name:"口哨歌5",src:"music/13.mp3",img:"img/6.jpg",author:"古德"},
	{name:"口哨歌6",src:"music/14.mp3",img:"img/6.jpg",author:"古德"}
	
]




//audio DOM元素
var audio=$("#audio")[0];
//控制播放的是哪个歌曲
var musicNum=0;
//歌曲的总数
var musicLen=musicArr.length;
//控制循环模式  0 列表循环 1单曲循环 2随机播放
var musicStyle=0;
//音量
var vol=0.8;

//显示歌曲列表
showSong();

//在应用启动的时候先换一次样式
changeStyle();



//播放按钮点击
$("#play").click(function(){
	play(this)
})

//下一曲按钮点击
$("#next").click(function(){
	changeSong('next');
})

//上一曲点击
$("#prev").click(function(){
	changeSong('prev');
})

//点击歌曲列表
$(".songList").delegate("li","click",function(){
	musicNum=$(this).index();
	changeSong();
	audio.play();
	$(".playAni").addClass("_play");
})

//点击切换循环模式
$("#style").click(function(){
	musicStyle++;
	if(musicStyle>2){
		musicStyle=0;
	}
	switch(musicStyle){
		case 0:
			$(this).removeClass("glyphicon-random");
			$(this).addClass("glyphicon-refresh");
			break;
		case 1:
			$(this).removeClass("glyphicon-refresh");
			$(this).addClass("glyphicon-repeat");
			break;
		case 2:
			$(this).removeClass("glyphicon-repeat");
			$(this).addClass("glyphicon-random");
			break;
	}
})






//进度条

var p_flag=false;
var p_lf=0;
var p_ex=0;
var p_faraway=$(".proBar").width()-16;
$(".proBar div").mousedown(function(e){
	p_lf=$(this).position().left;
	p_ex=e.pageX;
	p_flag=true;
})
$(document).mousemove(function(e){
	if(p_flag){
		var p_nx=e.pageX-p_ex+p_lf;
		if(p_nx<0){
			p_nx=0;
		}else if(p_nx>p_faraway){
			p_nx=p_faraway
		}
		$(".proBar div").css({left:p_nx+'px'})
		$(".proBar p").css({width:(p_nx+4)+'px'})
		var bl=p_nx/p_faraway;	
		audio.currentTime=bl*audio.duration;
	}
})
$(document).mouseup(function(){
	p_flag=false;
})


//音量

var v_flag=false;
var v_lf=0;
var v_ex=0;
var v_faraway=$(".volBar").width()-16;
$(".volBar div").mousedown(function(e){
	v_lf=$(this).position().left;
	v_ex=e.pageX;
	v_flag=true;
})
$(document).mousemove(function(e){
	if(v_flag){
		var v_nx=e.pageX-v_ex+v_lf;
		if(v_nx<0){
			v_nx=0;
		}else if(v_nx>v_faraway){
			v_nx=v_faraway
		}
		$(".volBar div").css({left:v_nx+'px'})
		$(".volBar p").css({width:(v_nx+4)+'px'})
		var bl=v_nx/v_faraway;
		audio.volume=bl;
		
	}
})
$(document).mouseup(function(){
	v_flag=false;
})

showVol();





$(audio).on("canplay",function(){
	$(".allTime").html(makeTime(this.duration));
})
$(audio).on("timeupdate",function(){
	$(".nowTime").html(makeTime(this.currentTime));
	var bl=this.currentTime/this.duration;
	$(".proBar div").css({left:bl*p_faraway+'px'})
	$(".proBar p").css({width:(bl*p_faraway+4)+'px'})
})

$(audio).on("ended",function(){
	changeSong('next');
	audio.play()
})





//显示歌曲列表的函数
function showSong(){
	var str='';
	$(musicArr).each(function(i,item){
		str+='<li class="list-group-item "><span>'+item.name+'</span><span class="label label-default">'+item.author+'</span></li>'
	})
	$(".songList").html(str);
}

//每次换歌的时候更新页面样式的函数
function changeStyle(){
	$(".songList li").removeClass('active');
	$(".songList li").eq(musicNum).addClass('active');
	
	$(".songImg").prop('src',musicArr[musicNum].img);
	$(".songName").html(musicArr[musicNum].name);
	$(".songAuthor").html(musicArr[musicNum].author);
	
	$(audio).prop("src",musicArr[musicNum].src);
	
	$(".proBar div").css({left:'0px'})
	$(".proBar p").css({width:'0px'})
	
}
//点击播放按钮后执行的函数
function play(btn){
	if(audio.paused){
		audio.play();
		$(btn).removeClass("glyphicon-play");
		$(btn).addClass("glyphicon-pause");
		$(".playAni").addClass("_play");
	}else{
		audio.pause();
		$(btn).removeClass("glyphicon-pause");
		$(btn).addClass("glyphicon-play");
		$(".playAni").removeClass("_play");	
	}
}

//切歌的函数
function changeSong(type){	
	//记录播放状态
	var paused=audio.paused;
	//改 musicNum	
	changeNum(type)
	//改样式
	changeStyle();
	//根据切之前的播放还是暂停来控制切之后播放或暂停
	if(!paused){
		audio.play()
	}
}

//上一曲和下一曲切歌时，专门 根据循环模式改musicNum的函数  
function changeNum(type){
	if(musicStyle==0){
		if(type=='next'){
			musicNum++;
			if(musicNum>=musicLen){
				musicNum=0;
			}
		}else if(type=='prev'){
			musicNum--;
			if(musicNum<0){
				musicNum=musicLen-1;
			}
		}
	}else if(musicStyle==2){
		musicNum=Math.floor(Math.random()*musicLen)
	}
	
}


function showVol(){
	$(".volBar div").css("left",vol*v_faraway+'px')
	$(".volBar p").css("width",(vol*v_faraway+4)+'px')
}

function makeTime(s){
	var m=Math.floor(s/60);
	var _s=Math.floor(s%60);
	if(m<10){
		m='0'+m;
	}
	if(_s<10){
		_s='0'+_s;
	}
	return m+':'+_s;
}


