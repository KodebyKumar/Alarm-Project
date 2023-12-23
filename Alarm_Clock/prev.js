function displayTimer() {
    let date = new Date();
    let [hours, minutes, seconds] = [
      appendZero(date.getHours()),
      appendZero(date.getMinutes()),
      appendZero(date.getSeconds()),
    ];
  
    let day = date.toLocaleDateString("en-US", { weekday: "long" });
    let currentDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
    // Display day, month, and time
    timerRef.innerHTML = `${day}, ${currentDate}<br>${hours}:${minutes}:${seconds}`;
  
    // Alarm
    alarmsArray.forEach((alarm, index) => {
      if (alarm.isActive) {
        if (
          `${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSecond}` ===
          `${hours}:${minutes}:${seconds}`
        ) {
          alarmSound.play();
          alarmSound.loop = true;
        }
      }
    });
  }