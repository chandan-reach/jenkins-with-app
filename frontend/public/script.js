
const form = document.getElementById("populationForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const city = document.getElementById("city").value.trim();

    result.innerHTML = "Fetching population data...";

    try {

        const response = await fetch("/api/search", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                city: city
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        const population = Number(data.population);

        result.innerHTML = `
            <h3>${data.message}</h3>

            <p>City: ${data.city}</p>

            <p>Country: ${data.country}</p>

            <p>Estimated Population:</p>

            <div class="population">
                ${
                    Number.isFinite(population)
                    ? population.toLocaleString("en-IN")
                    : "Not available"
                }
            </div>

            <small>Population figure from the available city dataset.</small>
        `;

    } catch (error) {

        result.innerHTML = `
            <p style="color:red">${error.message}</p>
        `;

    }

});
