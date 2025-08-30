document.addEventListener('DOMContentLoaded', () => {
    const courseGrid = document.getElementById('course-grid');
    const filterContainer = document.getElementById('filters');
    let allCourses = []; // To store courses fetched from JSON

    // Object to store the current active filters
    let activeFilters = {
        price: null,
        type: null,
        level: null
    };

    // Function to render courses based on filters
    const renderCourses = () => {
        if (!courseGrid) return;
        courseGrid.innerHTML = '';

        const filteredCourses = allCourses.filter(course => {
            // Check if the course matches the active filters
            const priceMatch = !activeFilters.price || course.price === activeFilters.price;
            const typeMatch = !activeFilters.type || course.type === activeFilters.type;
            const levelMatch = !activeFilters.level || course.level === activeFilters.level;
            return priceMatch && typeMatch && levelMatch;
        });

        if (filteredCourses.length === 0) {
            courseGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 text-xl">No courses match the selected filters.</p>`;
        } else {
            filteredCourses.forEach(course => {
                const card = document.createElement('div');
                card.className = 'course-card rounded-lg p-6 flex flex-col';
                card.innerHTML = `
                    <h2 class="text-xl font-bold mb-2 text-indigo-300">${course.title}</h2>
                    <p class="text-gray-400 flex-grow mb-4">${course.description}</p>
                    <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="inline-block mt-auto text-center font-semibold bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                        Go to Course
                    </a>
                `;
                courseGrid.appendChild(card);
            });
        }
    };

    // Event listener for filter buttons
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;

            const button = e.target;
            const filterGroup = button.dataset.filterGroup;
            const filterValue = button.dataset.filter;

            const allButton = filterContainer.querySelector('[data-filter="all"]');

            if (filterGroup === 'all') {
                // If 'All' is clicked, deactivate all other filters
                activeFilters = { price: null, type: null, level: null };
                filterContainer.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
                allButton.classList.add('active');
            } else {
                // If another filter is clicked, deactivate 'All'
                allButton.classList.remove('active');
                
                // If the clicked button is already active, deactivate it.
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    activeFilters[filterGroup] = null;
                } else {
                    // Otherwise, deactivate all buttons in the group and activate the clicked one.
                    const buttonsInGroup = filterContainer.querySelectorAll(`.filter-btn[data-filter-group="${filterGroup}"]`);
                    buttonsInGroup.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    activeFilters[filterGroup] = filterValue;
                }

                // If no filters are active, reactivate 'All'
                if (Object.values(activeFilters).every(val => val === null)) {
                    allButton.classList.add('active');
                }
            }
            renderCourses();
        });
    }
    
    // Fetch course data and initialize
    async function initialize() {
        try {
            const response = await fetch('courses.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allCourses = await response.json();
            renderCourses();
        } catch (error) {
            console.error("Could not fetch course data:", error);
            if(courseGrid) courseGrid.innerHTML = `<p class="col-span-full text-center text-red-400 text-xl">Error: Could not load course data.</p>`;
        }
    }

    initialize();
});
