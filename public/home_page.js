var collapsed = true;
function Sidebar() {
if (collapsed) {

document.getElementById("side_bar").style.backgroundColor = "#1d40cc";
document.getElementById("icon-text").style.display = "inline";
document.getElementById("icon-text1").style.display = "inline";
document.getElementById("icon-text2").style.display = "inline";
document.getElementById("icon-text3").style.display = "inline";
this.collapsed = false;
} 
else {
document.getElementById("side_bar").style.backgroundColor = "#1d40cc";
document.getElementById("icon-text").style.display = "none";
document.getElementById("icon-text1").style.display = "none";
document.getElementById("icon-text2").style.display = "none";
document.getElementById("icon-text3").style.display = "none";
this.collapsed = true;

}
}

function showLoginPrompt(xyz,abc) {


    let x=document.getElementById(abc).alt;
    
    if(x=="Mark_Attendance"){
        document.getElementById(abc).src="public/icons/close.png";
        var loginForm = document.getElementById(xyz);
        loginForm.style.display = "block";

        document.getElementById(abc).alt="close";
    }

    else{
        document.getElementById(abc).src="public/icons/attendance-statistics-1-32.png";
        var loginForm = document.getElementById(xyz);
        loginForm.style.display = "none";

        document.getElementById(abc).alt="Mark_Attendance";

    }
    
}

    function login() {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
    
        var correctUsername = "2204214";
        var correctPassword = "cs102";
    
        if (username === correctUsername && password === correctPassword) {
            console.log("Login successful!");
            window.location.href = "welcome.html?output=Login%20successful";
        } else {
            console.log("Invalid username or password. Please try again.");
        }
        
        // After handling the credentials, you may want to hide the login form
        var loginForm = document.getElementById("loginForm");
        loginForm.style.display = "none";
    }






