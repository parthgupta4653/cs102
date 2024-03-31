var collapsed = true;
function Sidebar() {
if (collapsed) {

document.getElementById("side_bar").style.backgroundColor = "#00498D";
document.getElementById("icon-text").style.display = "inline";
document.getElementById("icon-text1").style.display = "inline";
document.getElementById("icon-text2").style.display = "inline";
document.getElementById("icon-text3").style.display = "inline";
this.collapsed = false;
} 
else {
document.getElementById("side_bar").style.backgroundColor = "#3d79bd";
document.getElementById("icon-text").style.display = "none";
document.getElementById("icon-text1").style.display = "none";
document.getElementById("icon-text2").style.display = "none";
document.getElementById("icon-text3").style.display = "none";
this.collapsed = true;

}
}

function showLoginPrompt(xyz,abc) {


    let x=document.getElementById(abc).alt;
    
    if(x=="down_arrow"){
        document.getElementById(abc).src="icons/close.png";
        var loginForm = document.getElementById(xyz);
        loginForm.style.display = "block";

        document.getElementById(abc).alt="close";
    }

    else{
        document.getElementById(abc).src="icons/downarrow.png";
        var loginForm = document.getElementById(xyz);
        loginForm.style.display = "none";

        document.getElementById(abc).alt="down_arrow";

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

function showAttendance() {
    // Sample attendance data
    var attendanceData = [
        ["Date", "Status"],
        ["2024-03-01", "Present"],
        ["2024-03-02", "Absent"],
        ["2024-03-03", "Present"]
    ];

    // Generate CSV content
    var csvContent = "data:text/csv;charset=utf-8,"
                   + attendanceData.map(row => row.join(",")).join("\n");

    // Create a virtual link element
    var link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "attendance.csv");

    // Trigger the click event to initiate the download
  

    alert("The attendence sheet will be downloaded shortly")

    link.click();
}





