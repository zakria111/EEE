// Make the page responsive
      function checkScreenSize() {
        const profileCard = document.querySelector(".profile-card");
        if (window.innerWidth <= 576) {
          profileCard.style.borderRadius = "10px";
        } else {
          profileCard.style.borderRadius = "20px";
        }
      }

      // Run on page load and window resize
      window.addEventListener("load", checkScreenSize);
      window.addEventListener("resize", checkScreenSize);

      // Retrieve attendee details from local storage
      const attendee = JSON.parse(localStorage.getItem("selectedAttendee"));
let any = attendee.courses ? Object.values(attendee.courses).reduce((sum, value) => sum + value, 0) : 0;
      if (attendee) {
        document.getElementById("profile-img").src = attendee.image;
        document.getElementById("profile-name").textContent = attendee.name;
        document.querySelector(".Gpa").textContent= attendee.GPA;
        document.querySelector(".any").textContent= any;
        document.getElementById("profile-description").textContent =
          attendee.description;
        document.getElementById(
          "profile-userID"
        ).textContent = `User ID: ${attendee.code}`;
      } else {
        document.body.innerHTML = "<p>Profile data not found.</p>";
      }