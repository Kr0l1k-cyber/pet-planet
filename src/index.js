const API_URL = 'https://arrow-tricky-engineer.glitch.me';

const buttons = document.querySelectorAll(".store__category-button");
const productList = document.querySelector(".store__list");
const cartButton = document.querySelector(".store__cart-button");
const cartCount = cartButton.querySelector(".store__cart-cnt");
const modalOverlay = document.querySelector(".modal-overlay");
const cartItemsList = document.querySelector(".modal__cart-items");
const modalCloseButton = document.querySelector(".modal-overlay__close-button");

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

const renderProducts = (products) => {
    productList.textContent = "";
    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.append(productCard);
    });
};

const fetchProductByCategory = async (category) => {
    try {
        const response = await fetch(`${API_URL}/api/products/category/${category}`);
        if (!response.ok) {
            throw new Error(response.status);
        }
        const products = await response.json();
        renderProducts(products);
        console.log("products: ", products);
    } catch (error) {
        console.error(`Ошибка запроса товаров: ${error}`);
    }
};

const fetchCartItems = async (ids) => {
    try {
        const response = await fetch(`${API_URL}/api/products/list/${ids}`);
        if (!response.ok) {
            throw new Error(response.status);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка запроса корзины: ${error}`);
    }
};

const changeCategory = ({ target }) => {
    const category = target.textContent;
    buttons.forEach(button => {
        button.classList.remove("store__category-button_active");
    });
    target.classList.add("store__category-button_active");
    fetchProductByCategory(category);
};

buttons.forEach((button) => {
    button.addEventListener('click', changeCategory);
    if (button.classList.contains("store__category-button_active")) {
        fetchProductByCategory(button.textContent);
    }
});

const renderCartItems = async () => {
    cartItemsList.textContent = "";
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const ids = cartItems.map(item => item.id);

    if (!ids.length) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Корзина пуста';
        cartItemsList.append(listItem);
        return;
    }

    const products = await fetchCartItems(ids);
    console.log("products: ", products);
    localStorage.setItem('cartProductDetails', JSON.stringify(products));

    products.forEach(product => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${product.name} - ${product.price} ₽`;
        cartItemsList.append(cartItem);
    });
};

cartButton.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    renderCartItems();
});

modalOverlay.addEventListener('click', ({ target }) => {
    if (target === modalOverlay || target.closest(".modal-overlay__close-button")) {
        modalOverlay.style.display = 'none';
    }
});

const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    cartCount.textContent = cartItems.length;
};
updateCartCount();

const addToCart = (productId) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.count += 1;
    } else {
        cartItems.push({ id: productId, count: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
    console.log('cartItems: ', cartItems);
};

productList.addEventListener('click', ({ target }) => {
    if (target.closest(".product__btn-add-cart")) {
        const productId = parseInt(target.dataset.id, 10);
        addToCart(productId);
    }
});