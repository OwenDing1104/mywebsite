// Set the current year in the footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.innerHTML = new Date().getFullYear();
    }
}
);

// Sidebar Toggle Functionality with Keyboard Shortcut
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const toggleIcon = sidebarToggle.querySelector('i');

    // Initialize AOS if used
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
    }

    // Initial Icon Setup based on sidebar state
    if (!sidebar.classList.contains('collapsed')) {
        toggleIcon.classList.remove('fa-arrow-right');
        toggleIcon.classList.add('fa-arrow-left');
        sidebarToggle.setAttribute('aria-expanded', 'true');
    }

    sidebarToggle.addEventListener('click', function() {
        toggleSidebar();
    });

    // Keyboard Shortcut: Ctrl + B to toggle sidebar
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
            e.preventDefault();
            toggleSidebar();
        }
    });

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');

        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.remove('fa-arrow-left');
            toggleIcon.classList.add('fa-arrow-right');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        } else {
            toggleIcon.classList.remove('fa-arrow-right');
            toggleIcon.classList.add('fa-arrow-left');
            sidebarToggle.setAttribute('aria-expanded', 'true');
        }
    }

    // Timer Implementation
    startPageTimer();
});

/* Shared Page Timer Functionality*/
function startPageTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;

    let secondsElapsed = parseInt(localStorage.getItem('secondsElapsed')) || 0;
    let lastTimestamp = parseInt(localStorage.getItem('lastTimestamp')) || Date.now();
    let timerInterval = null;
    let isPaused = false;

    // Function to format time as HH:MM:SS
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    // Update Timer Display
    function updateTimer() {
        const currentTime = Date.now();
        const deltaSeconds = Math.floor((currentTime - lastTimestamp) / 1000);
        if (deltaSeconds > 0) {
            secondsElapsed += deltaSeconds;
            lastTimestamp = currentTime;

            timerDisplay.textContent = formatTime(secondsElapsed);

            // Persist data
            localStorage.setItem('secondsElapsed', secondsElapsed);
            localStorage.setItem('lastTimestamp', lastTimestamp);
        }
    }

    // Start Timer
    function startTimer() {
        if (!timerInterval && !isPaused) {
            lastTimestamp = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    // Stop Timer
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // Handle Visibility Change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopTimer();
        } else {
            // Update lastTimestamp to prevent counting the hidden duration
            lastTimestamp = Date.now();
            startTimer();
        }
    });

    // Initialize Timer Display
    timerDisplay.textContent = formatTime(secondsElapsed);

    // Start Timer
    startTimer();
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                form.reset(); // Reset form fields
                successMessage.style.display = 'block'; // Show success message
                setTimeout(() => {
                    successMessage.style.display = 'none'; // Hide after 5 seconds
                }, 5000);
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        alert(data.errors.map(error => error.message).join(", "));
                    } else {
                        alert('Oops! Something went wrong.');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! Something went wrong.');
        });
    });
});
