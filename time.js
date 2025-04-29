function updateDateTime() {
  const dt = new Date();

  // Format the date and time
  const formattedDate = dt.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  document.getElementById("datetime").innerHTML = formattedDate;
}

// Update the time every second
setInterval(updateDateTime, 1000);