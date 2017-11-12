$(document).ready(()=>{
    var slider = $("#loader");
    var API_KEY_MAPS = "AIzaSyBPjw-o1sdleDZ7N3nxxJWhd9k1TX8z1Pk";

    $("#result>div").hide();

    function makeRequest(method, url, data){
        return $.ajax({
            method : method,
            url : url,
            data : data,
            beforeSend : ()=>{
                slider.show();
            }
        })
    }

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    Number.prototype.round = function(num){    
        return +(Math.round(this + ("e+"+num))  + ("e-"+num));
    }

    function doFaceDetection(data){

    }

    function doWebDetection(data){
        $("#web-detection ul.collection").html("");
        $("#web-detection").show();
        data.webEntities.forEach((x)=>{
            $("#web-entities").append('<a target="_blank" href="https://www.google.com/search?q='+x.description+'" class="collection-item">'+x.description+'</a>');
        });
        data.pagesWithMatchingImages.forEach((x)=>{
            $("#web-pages-matched").append('<a target="_blank" href="'+x.url+'" class="collection-item">'+x.url+'</a>');
        });
        data.fullMatchingImages.forEach((x)=>{
            $("#web-fully-matched").append('<a target="_blank" href="'+x.url+'" class="collection-item">'+x.url+'</a>');
        });
        data.partialMatchingImages.forEach((x)=>{
            $("#web-partial-matched").append('<a target="_blank" href="'+x.url+'" class="collection-item">'+x.url+'</a>');
        });
    }

    function doLabelDetection(data){
        $("#label-detection-result>div:not(#label-detection-template)").remove();
        $("#label-detection").show();
        data.forEach((x)=>{
            var temp = $("#label-detection-template").clone();
            temp.show();
            temp.removeAttr("id");
            temp.find("div.left").text(x.description.capitalize());
            var score = (x.score*100).round(2);
            temp.find("div.right").text(score);
            temp.find("div.determinate").css("width",score+'%');
            $("#label-detection-result").append(temp);
        });
    }

    function doSafeSearchDetection(data){
        $("#safe-detection-result").html("");
        $("#safe-detection").show();
        Object.keys(data).forEach((x)=>{
            switch(data[x]){
                case "VERY_LIKELY" : color="red darken-4"; break;
                case "LIKELY" : color="red darken-1"; break;
                case "POSSIBLE" : color="orange darken-3"; break;
                case "UNLIKELY" : color="teal darken-1"; break;
                case "VERY_UNLIKELY" : color="teal darken-4"; break;
                default : color="black"; break;
            }
            $("#safe-detection-result").append('<a href="#" class="collection-item"><span data-badge-caption="" class="new badge '+color+'">'+data[x]+'</span>'+x.capitalize()+'</a>');
        });
    }

    function doTextDetection(data){
        $("#text-detection").show();
        if(data==null) return;
        $("#text-detection-result").text(data.text);
    }

    function doLandmarkDetection(data){
        $("#landmark-detection-result").html("");
        $("#landmark-detection").show();
        if(data.length==0) return;
        data.forEach((x)=>{
            var temp = '<div class="col m6">';
            temp+='<blockquote>'+x.description+' : '+(x.score*100).round(2)+'%</blockquote>';
            temp+='<div class="video-container">';
            var location = x.locations[0].latLng;            
            temp+='<iframe src="https://www.google.com/maps/embed/v1/view?key='+API_KEY_MAPS+'&center='+location.latitude+','+location.longitude+'&zoom=18&maptype=satellite"></iframe>';
            temp+='</div></div>';
            $("#landmark-detection-result").append(temp);
        })
    }

    function doLogoDetection(data){
        $("#logo-detection ul.collection").html("");
        $("#logo-detection").show();
        data.forEach((x)=>{
            $("#logo-detection-result").append('<a target="_blank" href="https://www.google.com/search?q='+x.description+' logos" class="collection-item">'+x.description+' ('+(x.score*100).round(2)+'%)</a>');
        });
    }
    
    $("form").submit((e)=>{
        makeRequest("POST", "/proceed", $("form").serialize()).then((res)=>{
            $("#result>div").hide();
            console.log(res)
            if($.inArray("WEB_DETECTION", res.features)!=-1) doWebDetection(res.body.webDetection);
            if($.inArray("LABEL_DETECTION", res.features)!=-1) doLabelDetection(res.body.labelAnnotations);
            if($.inArray("SAFE_SEARCH_DETECTION", res.features)!=-1) doSafeSearchDetection(res.body.safeSearchAnnotation);
            if($.inArray("TEXT_DETECTION", res.features)!=-1) doTextDetection(res.body.fullTextAnnotation);
            if($.inArray("LANDMARK_DETECTION", res.features)!=-1) doLandmarkDetection(res.body.landmarkAnnotations);
            if($.inArray("LOGO_DETECTION", res.features)!=-1) doLogoDetection(res.body.logoAnnotations);
            slider.hide();
        },(err)=>{
            slider.hide();
            console.log(err)
        });
        e.preventDefault();
    })
})