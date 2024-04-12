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
