const API_URL = 'https://arrow-tricky-engineer.glitch.me';

const buttons = document.querySelectorAll(".store__category-button");
const productList = document.querySelector(".store__list");
const cartButton = document.querySelector(".store__cart-button");
const cartCount = cartButton.querySelector(".store__cart-cnt");
const modalOverlay = document.querySelector(".modal-overlay");
const cartItemsList = document.querySelector(".modal__cart-items");
const modalCloseButton = document.querySelector(".modal-overlay__close-button");
const cartTotalPriceElement = document.querySelector('.modal__cart-price');


// Функция для создания карточки товара
const createProductCard = ({ id, photoUrl, name, price }) => {
    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
        <article class="store__product product">
            <img src="${API_URL}${photoUrl}" alt="${name}" class="product__image" width="388" height="261">
            <h3 class="product__title">${name}</h3>
            <p class="product__price">${price}&nbsp;₽</p>
            <button class="product__btn-add-cart" data-id="${id}">Заказать</button>
        </article>
    `;
    return productCard;
};

// Функция для рендера товаров на странице
const renderProducts = (products) => {
    productList.textContent = "";
    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.append(productCard);
    });
};

// Функция для получения товаров по категории
const fetchProductByCategory = async (category) => {
    try {
        const response = await fetch(`${API_URL}/api/products/category/${category}`);
        if (!response.ok) {
            throw new Error(response.status);
        }
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(`Ошибка запроса товаров: ${error}`);
    }
};

// Функция для получения товаров по их идентификаторам
const fetchCartItems = async (ids) => {
    try {
        const response = await fetch(`${API_URL}/api/products/list/${ids.join(",")}`);
        if (!response.ok) {
            throw new Error(response.status);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка запроса корзины: ${error}`);
        return [];
    }
};

// Функция для смены категории товаров
const changeCategory = ({ target }) => {
    const category = target.textContent;
    buttons.forEach(button => {
        button.classList.remove("store__category-button_active");
    });
    target.classList.add("store__category-button_active");
    fetchProductByCategory(category);
};

// Добавление обработчиков событий на кнопки категорий
buttons.forEach((button) => {
    button.addEventListener('click', changeCategory);
    if (button.classList.contains("store__category-button_active")) {
        fetchProductByCategory(button.textContent);
    }
});

// Функция для рендера товаров в корзине
const renderCartItems = async () => {
    cartItemsList.textContent = "";

    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const products = JSON.parse(localStorage.getItem("cartProductDetails") || "[]");

    products.forEach(({ id, photoUrl, name, price }) => {
        const cartItem = cartItems.find((item) => item.id == id);
        if (!cartItem) return;  // ИСПРАВЛЕНО: меняем !== на == чтобы правильно сравнить типы

        const listItem = document.createElement('li');
        listItem.classList.add('modal__cart-item');
        listItem.innerHTML = `
            <img src="${API_URL}${photoUrl}" alt="${name}" class="modal__cart-item-image">
            <h3 class="modal__cart-item-title">${name}</h3>
            <div class="modal__cart-item-count">
                <button class="modal__minus modal__btn" data-id="${id}">-</button>
                <span class="modal__count">${cartItem.count}</span>
                <button class="modal__plus modal__btn" data-id="${id}">+</button>
            </div>
            <p class="modal__cart-item-price">${price * cartItem.count}&nbsp;₽</p>
        `;
        cartItemsList.append(listItem);
    });

    const totalPrice = calculateTotalPrice(cartItems, products);
};

// Обработчик клика на кнопку корзины для отображения модального окна
cartButton.addEventListener('click', async () => {
    modalOverlay.style.display = 'flex';
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const ids = cartItems.map(item => item.id);

    if (!ids.length) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Корзина пуста';
        cartItemsList.append(listItem);
        return;
    }

    const products = await fetchCartItems(ids);
    localStorage.setItem('cartProductDetails', JSON.stringify(products));
    await renderCartItems();
});

// Обработчик клика на overlay для закрытия модального окна
modalOverlay.addEventListener('click', ({ target }) => {
    if (target === modalOverlay || target.closest(".modal-overlay__close-button")) {
        modalOverlay.style.display = 'none';
    }
});

// Функция для обновления количества товаров в корзине
const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    cartCount.textContent = cartItems.length;
};
updateCartCount();

// Функция для добавления товара в корзину
const addToCart = (productId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = cartItems.find(item => item.id === productId); // Обратить внимание на приведение типов данных


    if (existingItem) {
        existingItem.count += 1;
    } else {
        cartItems.push({ id: productId, count: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
};

// Обработчик клика на кнопку "Заказать" для добавления товара в корзину
productList.addEventListener('click', ({ target }) => {
    if (target.closest(".product__btn-add-cart")) {
        const productId = parseInt(target.dataset.id, 10);
        addToCart(productId);
    }
});