var collapsed = true;
function Sidebar() {
    if (collapsed) {

        document.getElementById("side_bar").style.backgroundColor = "#5153d2";
        document.getElementById("icon-text").style.display = "inline";
        document.getElementById("icon-text1").style.display = "inline";
        document.getElementById("icon-text2").style.display = "inline";
        document.getElementById("icon-text3").style.display = "inline";
        this.collapsed = false;
    }
    else {
        document.getElementById("side_bar").style.backgroundColor = "#5153d2";
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
        document.getElementById(abc).src="icons/pencil.svg";
        var loginForm = document.getElementById(xyz);
        loginForm.style.display = "none";

        document.getElementById(abc).alt="down_arrow";

    }
    
}