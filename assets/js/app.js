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
    
    $("form").submit((e)=>{
        makeRequest("POST", "/proceed", $("form").serialize()).then((res)=>{
            console.log(res);
            doFaceDetection(res.body.faceAnnotations);
            doWebDetection(res.body.webDetection);  

            slider.hide();
        },(err)=>{
            slider.hide();
            console.log(err)
        });
        e.preventDefault();
    })
})