const inputCountries = document.querySelector('#input-countries');
const inputUsername = document.querySelector('#input-username');
const inputEmail = document.querySelector('#input-email');
const inputNumber = document.querySelector('#input-number');
const inputPassword = document.querySelector('#input-password');
const inputMatch = document.querySelector('#input-match');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const spanCode = document.querySelector('#country-code');

[...inputCountries.children].forEach(option => {
    option.innerHTML = option.innerHTML.split('(')[0];
});

let usernameValidation = false;
let emailValidation = false;
let countryValidation = false;
let numberValidation = false;
let passwordValidation = false;
let passwordMatchValidation = false;

const validation = (input, regexValidation) => {
    formBtn.disabled = !usernameValidation || !emailValidation || !countryValidation || !numberValidation || !passwordValidation || !passwordMatchValidation ? true : false
    if (!regexValidation && input.value !== '') {
        input.parentElement.children[1].classList.add('show')
        input.classList.add('incorrect');
        input.classList.remove('correct');
    } else if (regexValidation) {
        input.parentElement.children[1].classList.remove('show')
        input.classList.remove('incorrect');
        input.classList.add('correct');
    } else if (input.value === '') {
        input.parentElement.children[1].classList.remove('show')
        input.classList.remove('incorrect');
        input.classList.remove('correct');
    }
}

inputUsername.addEventListener('input', e => {
    const USERNAME_REGEX = /^(?=.*[a-z])[a-z0-9].{3,8}$/;
    usernameValidation = USERNAME_REGEX.test(e.target.value);
    validation(inputUsername, usernameValidation);
});

inputEmail.addEventListener('input', e => {
    const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    emailValidation = EMAIL_REGEX.test(e.target.value);
    validation(inputEmail, emailValidation);
});

inputNumber.addEventListener('input', e => {
    const NUMBER_REGEX = /^[0-9]{10}$/;
    numberValidation = NUMBER_REGEX.test(e.target.value);
    validation(inputNumber, numberValidation);
});

inputCountries.addEventListener('input', e => {
    const selected = [...e.target.children].find(option => option.selected);
    spanCode.innerHTML = `+${selected.value}`
    spanCode.classList.add('correct');
    countryValidation = selected.value === '' ? false : true;
    validation(inputCountries, countryValidation);
});

inputPassword.addEventListener('input', e => {
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;
    passwordValidation = PASSWORD_REGEX.test(e.target.value);
    passwordMatchValidation = e.target.value === inputMatch.value;
    validation(inputPassword, passwordValidation);
    validation(inputMatch, passwordMatchValidation);
});

inputMatch.addEventListener('input', e => {
    passwordMatchValidation = inputPassword.value === e.target.value;
    validation(inputMatch, passwordMatchValidation);
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const user = {
        name: inputUsername.value,
        email: inputEmail.value,
        country: [...inputCountries.children].find(option => option.selected).innerHTML,
        password: inputPassword.value,
        phone: `${spanCode.innerHTML} ${inputNumber.value}`
    }
    console.log(user);
});

// eed98c63a7bf4faca0444f692ae7fd01
// https://api.geoapify.com/v1/ipinfo?apiKey=YOUR_API_KEY

const getCountryFromIp = async () => {
    try {
    const apiKey = 'eed98c63a7bf4faca0444f692ae7fd01';
    const url = `https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    const isoCode = data.country.iso_code;
    const option = [...inputCountries.children].find(option => {
        const optionIsoCode = option.getAttribute('data-countryCode');
        if (optionIsoCode === isoCode) return option;
    })
    option.selected = true
    spanCode.innerHTML = `+${option.value}`;
    countryValidation = true;
    spanCode.classList.add('correct');
    inputCountries.classList.add('corroct');
    
   } catch (error) {
    if (error.message === 'Invalid apiKey') {
        alert('La api key es invalida :(')
    }
};


}

window.onload = getCountryFromIp();
