function upload(callback){
	var files = $("#files").attr("value");
	var uploadUrl = $("#uploadUrl").attr("value");
	var rel = $("#rel").attr("value");
	var url = uploadUrl+"&files="+escape(encodeURIComponent(files))+"&rel="+escape(encodeURIComponent(rel));
	$("#files").attr("value","");
	alert(files);
	if(files=="")
//		alertMsg.info('您还未选择文件，请确认后在提交！')
		alertMsg.info(gms_message.UI_MESSAGE_UPLOADUNSEL);
//	alert(url);
	else{
		var $callback = callback || navTabAjaxDone;
		if (! $.isFunction($callback)) $callback = eval('(' + callback + ')');
		$.ajax({
			type:'GET',
			url:url,
			//data : {"SYSTEMKEYNAME" : GMS_SYSTEM_KEYNAME , "SYSTEMTELLERNO" :  GMS_SYSTEM_TELLERNO},
			data : {"SYSTEMKEYNAME" :  gms_constants.getSystem_key_name() , "SYSTEMTELLERNO" :   gms_constants.getSystem_teller_node()},
			dataType:"json",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			cache: false,
			success: $callback,
			error: $callback
		});
	}
}