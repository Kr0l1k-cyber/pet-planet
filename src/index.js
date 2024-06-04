const API_URL ='https://arrow-tricky-engineer.glitch.me';
// https://arrow-tricky-engineer.glitch.me/
const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');
const cartButton = document.querySelector('.store__cart-button');
const modalOverlay = document.querySelector('.modal-overlay');
const cartItemsList = document.querySelector('.modal__cart-items');
const modalCloseButton = document.querySelector('.modal-overlay__close-button');


const createProductCard = (product) => {
	const productCard = document.createElement('li');
	productCard.classList.add('store__item');
	productCard.innerHTML =
		`<article class="store__product product">
			<img src="${API_URL}${product.photoUrl}" alt="${product.name}" class="product__image" width="388" height="261">
			<h3 class="product__title">${product.name}</h3>
			<p class="product__price">${product.price}&nbsp;₽</p>
			<button class="product__btn-add-cart">Заказать</button>
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

const fettchProductByCategory = async (category) => {
	try {
		const response = await fetch(`${API_URL}/api/products/category/${category}`);

		if (!response.ok) {
			throw new Error(response.status);
		};

		const products = await response.json();

		renderProducts(products);
		// console.log("products: ", products);

	} catch (error) {
		console.error(`Ошибка запроса товаров: ${error}`);
	}

};

const changeCategory = event => {
	const target = event.target
	const category = target.textContent;
	buttons.forEach(button => {
		button.classList.remove("store__category-button_active");
	});

	target.classList.add("store__category-button_active");
	fettchProductByCategory(category);
};

buttons.forEach((button) => {
	button.addEventListener('click', changeCategory);
	if (button.classList.contains(".store__category-button_active")){
		fettchProductByCategory(button.textContent);
	};
	
});

cartButton.addEventListener('click', () => {
	modalOverlay.style.display = 'flex';
});

modalOverlay.addEventListener('click', (event) => {
	const target = event.target;
	console.log('target', target);
	if (target === modalOverlay || target.closest(".modal-overlay__close-button")) {
	modalOverlay.style.display = 'none';
	};
});
