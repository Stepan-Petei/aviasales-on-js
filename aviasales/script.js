//входные данные, 1 секция
//получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
	dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
	dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
	inputCitiesTo = formSearch.querySelector('.input__cities-to'),
	inputDateDepart = formSearch.querySelector('.input__date-depart'),
	cheapestTicket = document.getElementById('cheapest-ticket'),
	otherCheapTickets = document.getElementById('other-cheap-tickets');

//база городов, ключ АПИ и БД по календарю цен
const CITY_API = 'http://api.travelpayouts.com/data/ru/cities.json',
	CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload',
	PROXY = 'https://cors-anywhere.herokuapp.com/',
	API_KEY = '5d2e3c92f5cbb5b20d19b432ed48fb95',
	MAX_COUNT = 10;
/*'dataBase/cities.json' - та же БД городов, что и citiesApi, но локальная. 
При вызове getData() вместо citiesApi (онлайн БД) убрать конкатенацию прокси со ссылкой*/

let city = [];

//функции, 2 секция
const getData = (url, callback, reject = console.error) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {
		if (request.readyState !== 4) return;

		if (request.status === 200) {
			callback(request.response);
		} else {
			reject(request.status);
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

const getNameCity = (code) => {
	const objCity = city.find(item => item.code === code);
	return objCity.name;
};

const getDate = (date) => {
	return new Date(date).toLocaleString('ru', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};

const getChanges = (num) => {
	switch (num) {
		case 1:
			return 'С одной пересадкой';
		case 2:
			return 'С двумя пересадками';
			break;
		default:
			return 'Без пересадок';
	}
};

const getLinkAviaSales = (data) => {
	let link = 'https://www.aviasales.ru/search/';

	link += data.origin;

	const date = new Date(data.depart_date),
		day = date.getDate(),
		month = 1 + date.getMonth();

	link += day < 10 ? '0' + day : day;
	link += month < 10 ? '0' + month : month;
	link += data.destination + '1';

	return link;
};

const createCard = (data) => {
	const ticket = document.createElement('article');
	ticket.classList.add('ticket');

	let deep = '';

	if (data) {
		deep = `
		<h3 class="agent">${data.gate}</h3>
		<div class="ticket__wrapper">
			<div class="left-side">
				<a href="${getLinkAviaSales(data)}" ​target="_blank" class="button button__buy">Купить	за ${data.value}₽</a>
			</div>
			<div class="right-side">
				<div class="block-left">
					<div class="city__from">Вылет из города
						<span class="city__name">${getNameCity(data.origin)}</span>
					</div>
					<div class="date">${data.depart_date}</div>
				</div>

				<div class="block-right">
					<div class="changes">${getChanges(data.number_of_changes)}</div>
					<div class="city__to">Город назначения:
						<span class="city__name">${getNameCity(data.destination)}</span>
					</div>
				</div>
			</div>
		</div>
		`;
	} else {
		deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>'
	}

	ticket.insertAdjacentHTML('afterbegin', deep);

	return ticket;
};

const renderCheapDay = (cheapTicket) => {
	cheapestTicket.style.display = 'block';
	cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

	const ticket = createCard(cheapTicket[0]);
	cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
	otherCheapTickets.style.display = 'block';
	otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

	cheapTickets.sort((a, b) => a.value - b.value);

	for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
		const ticket = createCard(cheapTickets[i]);
		otherCheapTickets.append(ticket)
	}

	console.log(cheapTickets);
};

const renderCheap = (data, date) => {
	const cheapTicketYear = JSON.parse(data).best_prices;

	const cheapTicketDay = cheapTicketYear.filter(item => {
		return item.depart_date === date;
	});

	renderCheapDay(cheapTicketDay);
	renderCheapYear(cheapTicketYear);
};

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

formSearch.addEventListener('submit', (event) => {
	event.preventDefault();

	const cityFrom = city.find(item => {
		return inputCitiesFrom.value === item.name;
	});

	const cityTo = city.find(item => {
		return inputCitiesTo.value === item.name;
	});
	
		const formData = {
			from: cityFrom,
			to: cityTo,
			when: inputDateDepart.value
		}
	if (cityFrom && cityTo) {
		console.log(formData);

		const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}`
		+`&destination=${formData.to.code}&one_way=true`;

		getData(CALENDAR + requestData, (data) => {
			renderCheap(data, formData.when);
		}, (error) => {
			alert('В этом направлении нет рейсов');
			console.error('Ошибка', error);
		});
	} else {
		alert('Введите корректное название города!');
	}
});

//вызовы функций, секция 4
getData(PROXY + CITY_API, (data) => {
	city = JSON.parse(data).filter(item => item.name).sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});
});
