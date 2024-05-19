const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const itemsContainer = document.getElementById('items');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

let data;

async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/AvinashPatel15/Fashion-Database-Api/master/db.json');
        data = await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

function searchItems(e) {
    e.preventDefault();

    if (!data) {
        console.error('Данные еще не загружены');
        return;
    }

    itemsContainer.innerHTML = '';

    const term = search.value.trim().toLowerCase();

    const matchingItems = Object.values(data).flat().filter(item =>
        item.title && item.title.toLowerCase().includes(term)
    );

    if (matchingItems.length === 0) {
        resultHeading.innerHTML = `<p>Товары по запросу '${term}' не найдены</p>`;
    } else {
        resultHeading.innerHTML = `<h2>Результаты поиска по запросу '${term}':</h2>`;
        displayItems(matchingItems);
    }

    search.value = '';
}

function displayItems(items) {
    itemsContainer.innerHTML = items.map(item => `
        <div class="item">
            <img src="${item.images[0]}" alt="${item.title}" class="item-img"/>
            <div class="item-info">
                <h3>${item.title}</h3>
                <p>Цена: $${item.price}</p>
                <button class="details-btn" data-id="${item.id}">Подробнее</button>
            </div>
        </div>
    `).join('');
}

function getRandomItem() {
    if (!data) {
        console.error('Данные еще не загружены');
        return;
    }

    const allItems = Object.values(data).flat();
    if (allItems.length === 0) {
        console.error('В выбранной категории нет товаров');
        return;
    }

    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];

    resultHeading.innerHTML = `<h2>Случайный товар:</h2>`;
    itemsContainer.innerHTML = `
        <div class="item">
            <img src="${randomItem.images[0]}" alt="${randomItem.title}" class="item-img"/>
            <div class="item-info">
                <h3>${randomItem.title}</h3>
                <p>Цена: $${randomItem.price}</p>
                <button class="details-btn" data-id="${randomItem.id}">Подробнее</button>
            </div>
        </div>
    `;
}

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
