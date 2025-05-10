
function goHome() {
    window.location.href = "/";
  }

  // Add a subtle animation to the caveman
  document.addEventListener("DOMContentLoaded", function () {
    const caveman = document.getElementById("caveman");

    // Make the caveman slightly move up and down
    let position = 0;
    let direction = 1;

    setInterval(() => {
      if (position > 5) direction = -1;
      if (position < 0) direction = 1;

      position += direction * 0.1;
      caveman.setAttribute("transform", `translate(0, ${position})`);
    }, 50);
  });