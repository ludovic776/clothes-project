const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const itemsContainer = document.getElementById('items');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

let data;

// Load data
async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/AvinashPatel15/Fashion-Database-Api/master/db.json');
        data = await response.json();
        console.log('Data loaded:', data); // Отладка
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Search items
function searchItems(e) {
    e.preventDefault();

    if (!data) {
        console.error('Data not yet loaded');
        return;
    }

    itemsContainer.innerHTML = '';

    const term = search.value.trim().toLowerCase();
    console.log('Search term:', term); // Отладка

    const matchingItems = Object.values(data).flat().filter(item =>
        item.title && item.title.toLowerCase().includes(term)
    );

    if (matchingItems.length === 0) {
        resultHeading.innerHTML = `<p>No items found for '${term}'</p>`;
    } else {
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
        displayItems(matchingItems);
    }

    search.value = '';
}

// Display items
function displayItems(items) {
    console.log('Displaying items:', items); // Отладка

    itemsContainer.innerHTML = items.map(item => `
        <div class="item">
            <img src="${item.images[0]}" alt="${item.title}" class="item-img"/>
            <div class="item-info">
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
                <button class="details-btn" data-id="${item.id}">View Details</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', showDetails);
    });
}

// Show details in modal
function showDetails(e) {
    const itemId = e.target.getAttribute('data-id');
    console.log('Clicked item ID:', itemId); // Отладка

    if (!data) {
        console.error('Data not yet loaded');
        return;
    }

    // Преобразуем идентификатор в строку для поиска
    const item = Object.values(data).flat().find(item => String(item.id) === itemId);

    if (item) {
        console.log('Item found:', item); // Отладка

        const modalImagesContainer = document.querySelector('.modal-images');
        modalImagesContainer.innerHTML = item.images.map(image => `<img src="${image}" alt="${item.title}"/>`).join('');

        document.getElementById('modal-title').textContent = item.title;
        document.getElementById('modal-price').textContent = `Price: $${item.price}`;
        document.getElementById('modal-description').textContent = item.description || 'No description available';

        modal.style.display = 'block';
    } else {
        console.error('Item not found:', itemId); // Отладка
    }
}

// Get random item
function getRandomItem() {
    if (!data) {
        console.error('Data not yet loaded');
        return;
    }

    const allItems = Object.values(data).flat();
    if (allItems.length === 0) {
        console.error('No items available');
        return;
    }

    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];

    resultHeading.innerHTML = `<h2>Random item:</h2>`;
    itemsContainer.innerHTML = `
        <div class="item">
            <img src="${randomItem.images[0]}" alt="${randomItem.title}" class="item-img"/>
            <div class="item-info">
                <h3>${randomItem.title}</h3>
                <p>Price: $${randomItem.price}</p>
                <button class="details-btn" data-id="${randomItem.id}">View Details</button>
            </div>
        </div>
    `;

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', showDetails);
    });
}

// Event listeners
submit.addEventListener('submit', searchItems);
random.addEventListener('click', getRandomItem);
fetchData();

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});
