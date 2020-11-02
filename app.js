//------------------------------------------ GLOBAL VARIABLES ------------------------------------------------
let loadData = 12
//------------------------------------------ EVENT LISTENERS -------------------------------------------------
window.addEventListener('load', getData) //Load Data in DOM on page load
document.getElementsByClassName('selected')[0].addEventListener('click', toggleFilter) //Toggle Filter Button
document.getElementsByClassName('unselected')[0].addEventListener('click', filterData) //Filter countries by Region
document.getElementById('search-input').addEventListener('keyup', () => {
	document.getElementsByClassName('load-btn')[0].classList.add('hide')
	setTimeout(searchData, 2000)
}) // Search Countries
document.getElementsByClassName('load-more')[0].addEventListener('click', getData) //Load More Data
document.getElementsByClassName('countries')[0].addEventListener('click', sliderCountry) //Trigger Slider for full Details
document.getElementsByClassName('slider-btn')[0].addEventListener('click', hideSlider) // Hide Slider

// -------------------------------------------- FUNCTIONS ------------------------------------------------------
function toggleFilter() {
	document.getElementsByClassName('filter')[0].classList.toggle('active') 
}

// Getting Data from API
function getData() {
	return fetch('https://restcountries.eu/rest/v2/all')
		.then(res => res.json())
		.then(data => displayData(data))
}

// Filtering the Data
function filterData(e) {
	let region = e.target.innerHTML
	if (region === 'All') {
		document.getElementsByClassName('load-btn')[0].classList.remove('hide')
		getData()
		loadData = 12
	} else {
		document.getElementsByClassName('load-btn')[0].classList.add('hide')
		return fetch('https://restcountries.eu/rest/v2/region/' + region)
			.then(res => res.json())
			.then(data => displayData(data))
	}
}

// Search the Data
function searchData(e) {
	let countryName = document.getElementById('search-input').value
	if (countryName === '') {
		getData()
		loadData = 12
		document.getElementsByClassName('load-btn')[0].classList.remove('hide')
	} else {
		return fetch('https://restcountries.eu/rest/v2/name/' + countryName)
			.then(res => {
				if (!res.ok) {
					throw Error(res.statusText)
				}
				return res.json()
			})
			.then(data => displayData(data))
			.catch(e => {
				errorHandle()
			})
	}
}

// Displayig all the Data
function displayData(countries) {
	$(document).ready(function() {
		$('.countries').html('')
		let countryLength = countries.length
		for (let i = 0; i < loadData && i < countryLength; i++) {
			let name = countries[i].name
			let population = countries[i].population
			let region = countries[i].region
			let capital = countries[i].capital
			let flag = countries[i].flag

			$('.countries').append(` 
					<div class="container">
						<div class="flag">
							<img src="` + flag + `" alt="Loading Error">
						</div>
						<div class="info">
							<p class="name">` + name + `</p> 
							<p>Population: <span>` + population + `</span></p>
							<p>Region: <span>` + region + `</span></p>
							<p>Capital: <span>` + capital + `</span></p>
						</div>
					</div>
				`)
		}
		loadData = loadData + 12
	})
}

// Error when searching
function errorHandle() {
	$(document).ready(function() {
		$('.countries').html('')
		$('.countries').append(` 
					<div class="container" style="color: white;">
						No Country Found
					</div>
				`)
	})
}

// ------------------------------------------- Slider ---------------------------------------------------
// Getting Data for the Slider from API
function sliderCountry(e) {
	let countryName = e.target.parentNode.childNodes[3].childNodes[1].innerHTML
	return fetch('https://restcountries.eu/rest/v2/name/' + countryName + '?fullText=true')
		.then(res => res.json())
		.then(data => {
			sliderDataDisplay(data[0])
		})
}

// Display Data in the Slider
function sliderDataDisplay(country) {
	$(document).ready(function() {
		document.querySelector('main').classList.add('open-detail')
		document.getElementsByClassName('slider-content')[0].innerHTML = ''

		let name = country.name
		let nativeName = country.nativeName
		let population = country.population
		let region = country.subregion
		let capital = country.capital
		let timeZone = country.timezones[0]
		let callCode = country.callingCodes[0]
		let flag = country.flag
		let currencies = country.currencies[0].code
		let domain = country.topLevelDomain[0]

		let borders = country.borders
		let bordersDOM = ''
		let borderLength = country.borders.length
		
		if (borderLength === 0) {
			bordersDOM += `
					<div class="border-country"> No Border Countries </div>
			 `
		} else {
			for (i = 0; i < borderLength; i++) {
				bordersDOM += `
					 	<div class="border-country">` + borders[i] + `</div>
						`
			}
		}

		let languages = []
		let languageLength = country.languages.length
		for (i = 0; i < languageLength; i++) {
			languages.push(country.languages[i].name)
		}

		$('.slider-content').append(` 
				<div class="slider-flag">
					<img src="` + flag + `">
				</div>
				<div class="slider-info">
					<h1>` + name + `</h1>
					<div class="slider-detail">
						<p>Native Name: ` + nativeName + `</p>
						<p>Population: ` + population + `</p>
						<p>Region: ` + region + `</p>
						<p>Capital: ` + capital + `</p>
						<p>Domain: ` + domain + `</p>
						<p>Currencies: ` + currencies + `</p>
						<p>Languages: ` + languages + `</p>
						<p>Calling code: ` + callCode + `</p>
						<p>Time Zone: ` + timeZone + `</p>
					</div>
					<div class="slider-geography">
						<span>Border Countries:</span>
						<span class="country-names">` + bordersDOM + `</span>						
					</div>
				</div>
			`)
	})
}

// Back From Slider
function hideSlider() {
	document.querySelector('main').classList.remove('open-detail')
}