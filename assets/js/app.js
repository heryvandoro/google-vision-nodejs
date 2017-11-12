$(document).ready(()=>{
    var slider = $("#loader");

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
        data.forEach((x)=>{
            var temp = $("#label-detection-template").clone();
            temp.show();
            temp.removeAttr("id");
            temp.find("div.left").text(x.description.capitalize());
            var score = (x.score*100).round(2);
            temp.find("div.right").text(score);
            temp.find("div.determinate").css("width",score+'%');
            $("#label-detection-result").append(temp);
        })
    }

    function doSafeSearchDetection(data){
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
    
    $("form").submit((e)=>{
        makeRequest("POST", "/proceed", $("form").serialize()).then((res)=>{
            console.log(res);
            doFaceDetection(res.body.faceAnnotations);
            doWebDetection(res.body.webDetection);  
            doLabelDetection(res.body.labelAnnotations);
            doSafeSearchDetection(res.body.safeSearchAnnotation);
            slider.hide();
        },(err)=>{
            slider.hide();
            console.log(err)
        });
        e.preventDefault();
    })
})