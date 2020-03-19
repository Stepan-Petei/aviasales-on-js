//входные данные, 1 секция
//получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
	dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
	dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
	inputCitiesTo = formSearch.querySelector('.input__cities-to'),
	inputDateDepart = formSearch.querySelector('.input__date-depart');

//база городов, ключ АПИ и БД по календарю цен
const CITY_API = 'http://api.travelpayouts.com/data/ru/cities.json',
	CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload',
	PROXY = 'https://cors-anywhere.herokuapp.com/',
	API_KEY = '5d2e3c92f5cbb5b20d19b432ed48fb95';
/*'dataBase/cities.json' - та же БД городов, что и citiesApi, но локальная. 
При вызове getData() вместо citiesApi (онлайн БД) убрать конкатенацию прокси со ссылкой*/

let city = [];

//функции, 2 секция
const getData = (url, callback) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {
		if (request.readyState !== 4) return;

		if (request.status === 200) {
			callback(request.response);
		} else {
			console.error(request.status);
		}
	});

	request.send();
}

const showCity = (input, list) => {
	list.textContent = '';
	
	if (input.value !== '') {
		const filterCity = city.filter((item) => {
			const fixItem = item.toLowerCase();
			return fixItem.includes(input.value.toLowerCase());
		});
		
		filterCity.forEach((item) => {
			const li = document.createElement('li');
			li.classList.add('dropdown__city');
			li.textContent = item;
			list.append(li);
		});
	} else {
		return;
	}
};

const handlerCity = (event, input, list) => {
	const target = event.target;
	if (target.tagName.toLowerCase() === 'li') {
		input.value = target.textContent;
		list.textContent = '';
	}
}

//обработчики событий, 3 секция
inputCitiesFrom.addEventListener('input', () => {
	showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', () => {
	handlerCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', () => {
	handlerCity(event, inputCitiesTo, dropdownCitiesTo);
});

//вызовы функций, секция 4
getData(PROXY + CITY_API, (data) => {
	city = JSON.parse(data).filter(item => item.name);
});
