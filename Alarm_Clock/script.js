//Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const secondInput=document.getElementById("secondInput");
const ampmInput = document.getElementById("ampmInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio('./sound/Oppo - Nostalgic.mp3');
let initialHour = 0,
  initialMinute = 0,
  initialSecond=0;
  alarmIndex = 0;
//Append zeroes for single digit
const appendZero = (value) => value < 10 ? "0" + value : value;
//Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};
function appendZeroHrs(value) {
  return value < 10 ? `0${value}` : value;
}

// Display Time
function displayTimer() {
  let date = new Date();
  let hours = date.getHours();
  
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  let hrs = appendZeroHrs(hours);  
  let [minutes, seconds] = [
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  let day = date.toLocaleDateString("en-US", { weekday: "long" });
  let currentDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // Display day, month, and time
  timerRef.innerHTML = `${day}, ${currentDate}<br>${hrs}:${minutes}:${seconds} ${ampm}`;

  // Alarm

  alarmsArray.forEach((alarm) => {
    // console.log(alarmsArray)
    if (alarm.isActive) {
      const alarmTime = convertTo12HourFormat(alarm.alarmHour,alarm.alarmMinute,alarm.alarmSecond);
      const currentTime = `${hrs}:${minutes}:${seconds} ${ampm}`;
       console.log(alarmTime)
      if (alarmTime === currentTime) {
        alarmSound.play();
        alarmSound.loop = true;
        console.log('Sound is playing!!');
      }
    }
  });
}
function convertTo12HourFormat(hour, minute, seconds) {
  const parsedHour = parseInt(hour, 10);
  const ampm = parsedHour >= 12 ? 'PM' : 'AM';
  const twelveHour = parsedHour % 12 || 12; // Convert to 12-hour format
  return `${appendZeroHrs(twelveHour)}:${appendZero(minute)}:${seconds} ${ampm}`;
}
  
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};
hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});
minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});
secondInput.addEventListener("input", () => {
  secondInput.value = inputCheck(secondInput.value);
});
// Create alarm div
const createAlarm = (alarmObj) => {

  const { id, alarmHour, alarmMinute, alarmSecond } = alarmObj;

  const displayHour = (alarmHour % 12) || 12;
  const ampm = alarmHour >= 12 ? 'PM' : 'AM';
  
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${appendZeroHrs(displayHour)}:${alarmMinute}:${alarmSecond} ${ampm}</span>`;
 
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    //console.log("Checkbox clicked");
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
 // console.log("Alarm created:", alarmObj);
};

//Set Alarm

setAlarm.addEventListener("click", () => {
  alarmIndex += 1;
  let hour24 = parseInt(hourInput.value, 10);
  if (ampmInput.value === "PM" && hour24 !== 12) {
    hour24 += 12;
  } else if (ampmInput.value === "AM" && hour24 === 12) {
    hour24 = 0;
  }

  const alarmObj = {
    id: `${alarmIndex}_${hour24}_${minuteInput.value}_${secondInput.value}`,
    alarmHour: hour24,
    alarmMinute: minuteInput.value,
    alarmSecond: secondInput.value,
    isActive: false
  };

 // console.log(alarmObj);

  alarmsArray.push(alarmObj);
  //console.log(alarmsArray);

  createAlarm(alarmObj);

  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
  secondInput.value = appendZero(initialSecond);
  ampmInput.value = "AM"; // Reset AM/PM dropdown
});

const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  const alarm = alarmsArray.find((a) => a.id == searchId);
  if (alarm) {
    alarm.isActive = true;
  }
};

const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  const alarm = alarmsArray.find((a) => a.id == searchId);
  if (alarm) {
    alarm.isActive = false;
    alarmSound.pause();
  }
};

//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
    alarmSound.pause();
    
  }
};
// const testAlarmButton = document.getElementById('testAlarmButton');
// testAlarmButton.addEventListener('click', () => {
//   alarmSound.play();
// });
window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  initialSecond = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
  secondInput.value= appendZero(initialSecond);
};