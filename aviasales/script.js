const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
	dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
	dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
	inputCitiesTo = formSearch.querySelector('.input__cities-to'),
	inputDateDepart = formSearch.querySelector('.input__date-depart');
const cities = ['Moscow', 'Saint-Peterburg', 'Minsk', 'Karaganda', 'Cheliabinsk', 'Kerch\'', 'Volgograd', 'Samara', 'Dnepr', 'Ekaterinburg', 'Odessa', 'Wuhan', 'Shymken', 'Nizhnii Novgorod', 'Kaliningrad', 'Vrozlav', 'Rostov-na-Donu', 'Malaga'];
const showCity = (input, list) => {
	list.textContent = '';
	if (input.value !== '') {
		const filterCity = cities.filter((item) => {
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
inputCitiesFrom.addEventListener('input', () => {
	showCity(inputCitiesFrom, dropdownCitiesFrom)
});
inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo)
});
dropdownCitiesFrom.addEventListener('click', (event) => {
	const target = event.target;
	if (target.tagName.toLowerCase() === 'li') {
		inputCitiesFrom.value = target.textContent;
		dropdownCitiesFrom.textContent = '';
	}
});
dropdownCitiesTo.addEventListener('click', (event) => {
	const target = event.target;
	if (target.tagName.toLowerCase() === 'li') {
		inputCitiesTo.value = target.textContent;
		dropdownCitiesTo.textContent = '';
	}
});