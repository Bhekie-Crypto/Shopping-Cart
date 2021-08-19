
 
    var x = document.getElementById("demo");
   
      function getLocation() {
   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(showPosition, showError);
   } else { 
       x.innerHTML = "Geolocation is not supported by this browser.";
    }
   }
   
       function showPosition(position) {
           // x.innerHTML = "Latitude: " + position.coords.latitude + 
           // 			  "<br>Longitude: " + position.coords.longitude;
            document.getElementById('address_latitude').value= position.coords.latitude; 
                        
            document.getElementById('address_longitude').value= position.coords.longitude;
    }
   
      function showError(error) {
   switch(error.code) {
       case error.PERMISSION_DENIED:
           x.innerHTML = "User denied the request for Geolocation."
           break;
       case error.POSITION_UNAVAILABLE:
           x.innerHTML = "<p style='color:red;'>Oops! No network coverage at the moment. please check your connection and try again</p>"
           break;
       case error.TIMEOUT:
           x.innerHTML = "The request to get user location timed out."
           break;
       case error.UNKNOWN_ERROR:
           x.innerHTML = "An unknown error occurred."
           break;
     }
    }
 
   
   