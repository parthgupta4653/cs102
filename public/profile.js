let photo = document.getElementById("photo");
let file = document.getElementById("pic-upload");
file.onchange = function () {
    photo.src =URL.createObjectURL(file.files[0]);
}