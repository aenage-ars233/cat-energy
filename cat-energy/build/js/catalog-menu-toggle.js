let togglerButton = document.querySelector('.catalog-header__toggler');
let menu = document.querySelector('.catalog-header__menu');

togglerButton.addEventListener('click', function() {
  menu.classList.toggle('catalog-header__menu--open');
});
