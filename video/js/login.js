$(document).ready(function() {
	var e = $(this);
	//var loginWrapper = $("div[data-qipalogin-login]");
	var loginWrapper = $("div[data-qipalogin-login]");
	var regWrapper = $("div[data-qipalogin-reg]");
	var loginPanel = $('div[data-loginele="passLogin"]');
	var qrCodePanel = $('div[data-loginele="codeLogin"]');
	var thirdPanel = $('div[data-loginele="thirdLogin"]');
	var errPanel = $('div[data-loginele="errLogin"]');
	var nameContainer = $('div[data-pwdloginbox="nameContainer"]');
	var name = $("div[data-pwdloginbox='name']");


	//	alert($(loginWrapper).prop('outerHTML')),
	//切换到注册
	$(this).delegate("[data-regist]", "click", function() {
			$(loginWrapper).addClass("dn"),
				$(document.body).attr("class", "reg-container"),
				$(regWrapper).removeClass("dn");
		}),

		//切换到登录	
		$(this).delegate("[data-passLogin]", "click", function(t) {
			$(document.body).attr("class", "embed-container"),
				$(regWrapper).addClass("dn"),
				$(qrCodePanel).addClass("dn"),
				$(regWrapper).addClass("dn"),
				$(loginPanel).removeClass("dn"),
				$(loginWrapper).removeClass("dn");

		}),
		
		//切换到二维码
		$(this).delegate("[data-qrLogin]", "click", function(t) {
				$(this).attr("data-qrLogin") && (y = "hrisk"),
				$(loginPanel).addClass("dn"),
				$(qrCodePanel).removeClass("dn");
		}),
		
		$(this).delegate("[data-pwdloginbox='nameContainer']", "click", function(t) {
			$(nameContainer).addClass("accountIn"),
			$(name).focus(1);
//					this.nameErr.addClass("vh"),
//					this.nameTip.show(),
//					this.nameContainer.addClass("accountIn");
					//e.name.focus()
					}),

					

		$(this);

});


