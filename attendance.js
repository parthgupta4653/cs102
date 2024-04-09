let attendanceArray = new Array(160).fill(0);
let attendanceCode;

function takeAttendance() {
    attendanceCode = Math.floor(1000 + Math.random() * 9000);
    alert(`Attendance Code: ${attendanceCode}`);
    localStorage.setItem('attendanceCode', attendanceCode);
}

document.getElementById('takeAttendanceBtn')?.addEventListener('click', takeAttendance);

function markAttendance() {
    let rollNumber = parseInt(document.getElementById('rollNumber').value);
    let code = parseInt(document.getElementById('attendanceCode').value);
    let responseElement = document.getElementById('studentResponse');

    let storedCode = parseInt(localStorage.getItem('attendanceCode'));

    alert(`Entered Code: ${code}, Stored Code: ${storedCode}`);

    if (code === storedCode) {
        attendanceArray[rollNumber - 1] = 1;
        responseElement.textContent = "Attendance marked successfully!";
    } else {
        responseElement.textContent = "Incorrect code. Please try again.";
    }

    console.log(attendanceArray);
}

document.getElementById('markAttendanceBtn')?.addEventListener('click', markAttendance);
function displayAttendanceArray() {
    let arrayElement = document.getElementById('attendanceArray');
    arrayElement.textContent = `Attendance Array: ${attendanceArray}`;
}

document.getElementById('displayArrayBtn')?.addEventListener('click', displayAttendanceArray);