function hmenuhover()
{
	if(!document.getElementById("hmenu"))
		return;
	var lis = document.getElementById("hmenu").getElementsByTagName("LI");
	for (var i=0;i<lis.length;i++)
	{
		lis[i].onmouseover=function(){this.className+=" iehover";}
		lis[i].onmouseout=function() {this.className=this.className.replace(new RegExp(" iehover\\b"), "");}
	}
}
if (window.attachEvent)
	window.attachEvent("onload", hmenuhover);

$(function() {
	$(window).scroll(function() {
		//var mtop = $("#header").outerHeight(true) - $(window).scrollTop(); // in ff при прокрутке скачет и виден фон
		
		if ($(window).scrollTop() >= 60){
			$("#head-bar").css("top", -1);
			$("#head-bar").css("position", "fixed");
			//$("#header").css("height", "70px");
		}else{
			$("#head-bar").css("top", "");
			$("#head-bar").css("position", "");
			//$("#header").css("height", "45px");
		}
		if ($(window).scrollTop() >= 80){
			$("#sidebar_right").css("top", 39);
			$("#sidebar_right").css("position", "fixed");			
		}else{
			$("#sidebar_right").css("top", "");
			$("#sidebar_right").css("position", "");
		}
	});
	
	/*
	$(window).scroll(function() {
		//var mtop = $("#header").outerHeight(true) - $(window).scrollTop(); // in ff при прокрутке скачет и виден фон
		var mtop = 60 - $(window).scrollTop();
		if (mtop < 0){mtop = 0;}
		var mr = mtop + 60;
		$("#head-bar").css("top", mtop);
		$("#sidebar_right").css("top", mr);
	});
	*/
});