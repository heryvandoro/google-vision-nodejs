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

    function rgb2hex(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
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

    function getBadgeColor(type){
        var color = "";
        switch(type){
            case "VERY_LIKELY" : color="red darken-4"; break;
            case "LIKELY" : color="red darken-1"; break;
            case "POSSIBLE" : color="orange darken-3"; break;
            case "UNLIKELY" : color="teal darken-1"; break;
            case "VERY_UNLIKELY" : color="teal darken-4"; break;
            default : color="black"; break;
        }
        return color;
    }

    function doSafeSearchDetection(data){
        $("#safe-detection-result").html("");
        $("#safe-detection").show();
        Object.keys(data).forEach((x)=>{
            var color = getBadgeColor(data[x]);
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

    function doImagePropertiesDetection(data){
        $("#image-properties-result").html("");
        $("#image-properties-detection").show();
        var calc = 0;
        data.dominantColors.colors.forEach((x)=>{ calc+=x.pixelFraction; });
        data.dominantColors.colors.forEach((x)=>{
            $("#image-properties-result").append('<div style="display:inline-block;height:200px;width:'+((x.pixelFraction*100)/calc)+'%;background-color:rgb('+x.color.red+','+x.color.green+','+x.color.blue+')">&nbsp;</div>');
        });
    }

    function doFaceDetection(imageData, data){
        $("#face-detection-description").html("");
        $("#face-detection").show();
        var canvas = $("#face-detection-result")[0];
        var ctx = canvas.getContext("2d");

        var img = new Image();
        img.src = imageData;

        img.onload = ()=>{
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.strokeStyle = "#6fff20";
            ctx.fillStyle = "#6fff20";
            
            data.forEach((x, y)=>{
                //boundingPoly
                var verticates = x.boundingPoly.vertices;
                ctx.beginPath();
                ctx.moveTo(verticates[0].x, verticates[0].y)
                x.boundingPoly.vertices.forEach((point)=>{
                    ctx.lineTo(point.x, point.y);
                });
                ctx.lineTo(verticates[0].x, verticates[0].y)
                ctx.stroke();
                ctx.closePath();

                //fdBoundingPoly
                var FDverticates = x.fdBoundingPoly.vertices;
                ctx.beginPath();
               
                ctx.moveTo(FDverticates[0].x, FDverticates[0].y)
                x.fdBoundingPoly.vertices.forEach((point)=>{
                    ctx.lineTo(point.x, point.y);
                });
                ctx.lineTo(FDverticates[0].x, FDverticates[0].y)
                ctx.stroke();
                ctx.closePath();

                //landmarks
                x.landmarks.forEach((p)=>{
                    ctx.beginPath();
                    ctx.arc(p.position.x, p.position.y, 1, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                });
                
                //text
                ctx.font="12px Roboto";
                var textX = FDverticates[0].x+5;
                var textY = FDverticates[0].y-5 < 5 ? FDverticates[0].y+10 : FDverticates[0].y-5;
                ctx.fillText("Face : "+(y+1), textX, textY);

                var temp = '<div class="col m4">';
                temp+='<blockquote>Person : '+(y+1)+' ('+(x.detectionConfidence*100).round(2)+'%)</blockquote>';
                temp+='<ul class="collection">';
                Object.keys(x).forEach((hood)=>{
                    if(typeof(x[hood])=="string"){
                        var color = getBadgeColor(x[hood]);
                        temp+='<a href="#" class="collection-item"><span data-badge-caption="" class="new badge '+color+'">'+x[hood]+'</span>'+hood.capitalize()+'</a>';
                    }
                });
                temp+='</ul>';
                temp+='<blockquote>Angle : Pan ('+x.panAngle.round(0)+'°) Roll ('+x.rollAngle.round(0)+'°) Tilt ('+x.tiltAngle
                .round(0)+'°)</blockquote>';
                temp+='</div>';
                $("#face-detection-description").append(temp);
            })
        }
    }

    $(document).on("mouseover", "#image-properties-result>div", function(){
        var RGB = $(this).css("backgroundColor").replace("rgb", "").replace("(", "").replace(")", "");
        var splitted = RGB.split(",");
        var HEX = rgb2hex(splitted[0], splitted[1], splitted[2]);
        $("#image-properties-picker").html("RGB : "+RGB+"<br>HEX : "+HEX);
    });
    
    $("form").submit((e)=>{
        makeRequest("POST", "/proceed", $("form").serialize()).then((res)=>{
            $("#result>div").hide();
            if($.inArray("WEB_DETECTION", res.features)!=-1) doWebDetection(res.body.webDetection);
            if($.inArray("LABEL_DETECTION", res.features)!=-1) doLabelDetection(res.body.labelAnnotations);
            if($.inArray("SAFE_SEARCH_DETECTION", res.features)!=-1) doSafeSearchDetection(res.body.safeSearchAnnotation);
            if($.inArray("TEXT_DETECTION", res.features)!=-1) doTextDetection(res.body.fullTextAnnotation);
            if($.inArray("LANDMARK_DETECTION", res.features)!=-1) doLandmarkDetection(res.body.landmarkAnnotations);
            if($.inArray("LOGO_DETECTION", res.features)!=-1) doLogoDetection(res.body.logoAnnotations);
            if($.inArray("IMAGE_PROPERTIES", res.features)!=-1) doImagePropertiesDetection(res.body.imagePropertiesAnnotation);
            if($.inArray("FACE_DETECTION", res.features)!=-1) doFaceDetection(res.imageUrl, res.body.faceAnnotations);
            slider.hide();
        },(err)=>{
            slider.hide();
            console.log(err);
        });
        e.preventDefault();
    })
})