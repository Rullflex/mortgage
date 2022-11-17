var investmentRange = document.querySelector('#investment-amount-range');
var investmentAmount = document.querySelector('#investment-amount');
var investmentDuration = document.querySelector('#investment-duration')
var investmentDurationRange = document.querySelector('#investment-duration-range');
var totalIncome = document.querySelector('#total-income');
var netIncome = document.querySelector('#net-income');
var taxes = document.querySelector('#tax');
var investmentTypes = document.querySelector('.income-calculator__type-label');
var investmentRadios = document.querySelectorAll('.income-calculator__radio');

function count(){
  const resultMonthsNumber = investmentDurationRange.value;
  investmentDuration.value = resultMonthsNumber;
  var percentRate = document.querySelector('.income-calculator__radio:checked').getAttribute('data-percent-rate');
  totalIncome.innerHTML = Math.round(+investmentAmount.value+(investmentAmount.value * resultMonthsNumber * percentRate / 12 / 100)) + " ₽";
  netIncome.innerHTML = (Math.round(+investmentAmount.value+(investmentAmount.value * resultMonthsNumber * percentRate / 12 / 100)) - Math.round(investmentAmount.value * resultMonthsNumber * percentRate / 12 / 100 * 0.13) - investmentAmount.value)+ " ₽" ;
  taxes.innerHTML = Math.round(investmentAmount.value * resultMonthsNumber * percentRate / 12 / 100 * 0.13) + " ₽";
}

investmentRange.addEventListener('input', function (event) {
  investmentAmount.value = event.target.value;
  count();
  var rangepercent = investmentRange.value / 1000000;
  event.target.style.background = 'linear-gradient(90deg, rgba(228,190,152,1)' + rangepercent + '% , rgba(255,255,255,0) ' + rangepercent + '% )';
});

investmentAmount.addEventListener('input', function (event) {
  investmentRange.value = event.target.value;
  count();
});

investmentDurationRange.addEventListener('input', function (event) {
  investmentDuration.value = event.target.value;
  count();
  var rangepercent;
  switch (event.target.value) {
    case '18':
      rangepercent = 50;
      break;
    case '24':
      rangepercent = 100;
      break;
    default:
      rangepercent = 0;
  }
  event.target.style.background = 'linear-gradient(90deg, rgba(228,190,152,1)' + rangepercent + '% , rgba(255,255,255,0) ' + rangepercent + '% )';
});

investmentDuration.addEventListener('input', function (event) {
  investmentDurationRange.value = event.target.value;
  count();
});

investmentRadios.forEach((item) => {
  item.addEventListener('input', function () {
    count();
  });
});

count();
