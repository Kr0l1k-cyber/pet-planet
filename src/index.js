const buttons = document.querySelectorAll('.store__category-button')

const changeActiveBtn = event => {
	const target = event.target

	buttons.forEach(button => {
		button.classList.remove('store__category-button_active')
	})

	target.classList.add('store__category-button_active')
}

buttons.forEach(button => {
	button.addEventListener('click', changeActiveBtn)
})

const API_URL ='https://kind-frost-servant.glitch.me';
// api/products/category/%D0%9B%D0%B5%D0%B6%D0%B0%D0%BD%D0%BA%D0%B8

const productList = document.querySelector('.store__item');