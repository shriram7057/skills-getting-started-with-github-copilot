const activitiesList = document.getElementById("activities-list");
const activitySelect = document.getElementById("activity");
const signupForm = document.getElementById("signup-form");
const messageDiv = document.getElementById("message");

// Load activities from API
async function loadActivities() {

    const response = await fetch("/activities");
    const activities = await response.json();

    // Clear current content
    activitiesList.innerHTML = "";
    activitySelect.innerHTML =
        '<option value="">-- Select an activity --</option>';

    // Render activities
    Object.entries(activities).forEach(([name, activity]) => {

        // Add dropdown option
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);

        // Create participant list
        const participantsHtml = activity.participants
            .map(participant => `
                <li class="participant-item">
                    ${participant}
                </li>
            `)
            .join("");

        // Create activity card
        const card = document.createElement("div");
        card.className = "activity-card";

        card.innerHTML = `
            <h4>${name}</h4>

            <p>${activity.description}</p>

            <p>
                <strong>Schedule:</strong>
                ${activity.schedule}
            </p>

            <p>
                <strong>Participants:</strong>
                ${activity.participants.length}/${activity.max_participants}
            </p>

            <div class="participants-section">
                <h5>Signed Up Students</h5>

                <ul class="participants-list">
                    ${participantsHtml}
                </ul>
            </div>
        `;

        activitiesList.appendChild(card);
    });
}

// Signup form submit
signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {

        const response = await fetch(
            `/activities/${activity}/signup?email=${email}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Signup failed");
        }

        messageDiv.textContent = data.message;
        messageDiv.className = "";

        signupForm.reset();

        // Refresh activities automatically
        loadActivities();

    } catch (error) {

        messageDiv.textContent = error.message;
        messageDiv.className = "error";
    }
});

// Initial load
loadActivities();