$(document).ready(()=>{
    var slider = $("#loader");
    var result = $("#result");

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
    
    $("form").submit((e)=>{
        makeRequest("POST", "/proceed", $("form").serialize()).then((res)=>{
            slider.hide();
            console.log(res)
            //clear result
            result.html("");

            res.features.forEach((x)=>{
                switch(x){
                    case "FACE_DETECTION" : doFaceDetection(res.body.faceAnnotations);
                    break;
                    case "LANDMARK_DETECTION" : 
                    break;
                    case "LOGO_DETECTION" : 
                    break;
                    case "TEXT_DETECTION" : 
                    break;
                    case "DOCUMENT_TEXT_DETECTION" : 
                    break;
                    case "SAFE_SEARCH_DETECTION" : 
                    break;
                    case "CROP_HINTS" : 
                    break;
                    case "WEB_DETECTION" : 
                    break;
                    case "LABEL_DETECTION" : 
                    break;
                    case "IMAGE_PROPERTIES" : 
                    break;
                }
            })           
        },(err)=>{
            slider.hide();
            console.log(err)
        });
        e.preventDefault();
    })
})