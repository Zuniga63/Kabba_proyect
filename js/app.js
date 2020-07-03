const products = ['Tratamiento Repolarizador', 'Tonico Capilar', 'Biomascarilla', 'Shampoo'];

const customers = [{
	name: 'Edith',
	products: [[products[0], 1, 27300], [products[3], 1, 24300], [products[2], 3, 31300]],
	payments: 145500
}, {
	name: 'Zuly',
	products: [[products[0], 1, 35000], [products[3], 1, 30000], [products[1], 1, 30000], [products[2], 1, 35000]],
	payments: 0
}, {
	name: 'Carmen',
	products: [[products[0], 1, 35000], [products[3], 1, 30000]],
	payments: 0
}, {
	name: 'Erika',
	products: [[products[2], 1, 40000]],
	payments: 0
}, {
	name: 'Dairo',
	products: [[products[2], 1, 40000]],
	payments: 0
}, {
	name: 'Jehison',
	products: [[products[3], 1, 30000]],
	payments: 20000
}, {
	name: 'Andrés',
	products: [[products[0], 1, 27300], [products[2], 1, 31300], [products[1], 1, 26300]],
	payments: 84900
}
];

window.addEventListener('load', () => {
	printCharts();
	document.getElementById('customerSelect').addEventListener('input', ()=>{
		updateTable();
	})
	updateTable();
})

const printCharts = () => {
	printCashFlow();
	printDelinquentChart();
}

const printCashFlow = () => {
	let labels = ['Andrés', 'Edith'];
	let capital = [283000, 283000];
	let goods = [84900, 145500];
	let cash = [94000, 0];

	let data = {
		labels,
		datasets: [{
			label: 'Aportes',
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 1,
			data: capital
		}, {
			label: 'Mercancías',
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1,
			data: goods
		}, {
			label: 'Efectivo',
			backgroundColor: 'rgba(46, 204, 113, 0.2)',
			borderColor: 'rgba(46, 204, 113, 1)',
			borderWidth: 1,
			data: cash
		},
		]
	}

	const ctx = document.getElementById('cashFlow');
	printBarChart(ctx, data, 'Flujo de caja');
}

const printDelinquentChart = () => {
	let labels = ['Zuly', 'Carmen', 'Erika', 'Dairo', 'Jehison'];
	let amounts = [130000, 70000, 40000, 40000, 10000];
	let data = {
		labels,
		datasets: [{
			label: 'Saldos',
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 1,
			data: amounts
		}]
	}

	const ctx = document.getElementById('delinquentCustomers');
	printBarChart(ctx, data, 'Saldos pendientes');
}

const updateTable = ()=>{
	const customerSelect = document.getElementById('customerSelect');
	const tableBody = document.getElementById('body');
	const subtotalDOM = document.getElementById('subtotal');
	const paymentsDOM = document.getElementById('payments');
	const totalDOM = document.getElementById('total');

	let index = parseInt(customerSelect.value);
	if(index >= 0){
		let htmlCode = '';
		let customer = customers[index];

		let subtotal = 0;
		let payments = customer.payments;

		customer.products.forEach(product => {
			subtotal += product[1] * product[2];
			htmlCode += `
			<p class="table__data text-left">${product[0]}</p>
			<p class="table__data text-center">${product[1]}</p>
			<p class="table__data text-center">${formatCurrencyLite(product[2], 0)}</p>
			<p class="table__data text-center">${formatCurrencyLite(product[1] * product[2], 0)}</p>`
		})

		tableBody.innerHTML = htmlCode;
		subtotalDOM.innerText = formatCurrencyLite(subtotal,0);
		paymentsDOM.innerText = formatCurrencyLite(payments,0);
		totalDOM.innerText = formatCurrencyLite(subtotal - payments,0);
	}else{
		tableBody.innerHTML = '';
		subtotalDOM.innerText = formatCurrencyLite(0,0);
		paymentsDOM.innerText = formatCurrencyLite(0,0);
		totalDOM.innerText = formatCurrencyLite(0,0);
	}
}
//----------------------------------------------------------------------------------------------
//                              UTILIDADES
//----------------------------------------------------------------------------------------------
/**
 * Esta funcion generica funciona para dar formato de moneda a los numeros pasados como parametros
 * @param {string} locales Es el leguaje Eje: es-CO
 * @param {string} currency Eltipo de moneda a utilizar ej: COP
 * @param {number} fractionDigits El numero de digitos decimales que se van a mostrar
 * @param {number} number Es la cantidad de dinero que se va a dar formato
 */
function formatCurrency(locales, currency, fractionDigits, number) {
	var formatted = new Intl.NumberFormat(locales, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: fractionDigits
	}).format(number);
	return formatted;
}

/**
 * Esta es una version simplificada de formatCurreny para moneda colombiana
 * @param {number} number Numero para establecer formato
 * @param {number} fractionDigits Fracciones a mostrar
 */
function formatCurrencyLite(number, fractionDigits) {
	return formatCurrency('es-CO', 'COP', fractionDigits, number);
}

const printBarChart = (ctx, barCharData, title) => {
	let myBar = new Chart(ctx, {
		type: 'bar',
		data: barCharData,
		options: {
			resposive: true,
			legend: {
				position: 'top'
			},
			title: {
				display: true,
				text: title
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data) {
						var label = data.datasets[tooltipItem.datasetIndex].label || '';

						if (label) {
							label += ': ';
						}
						// label += Math.round(tooltipItem.yLabel * 100) / 100;
						label += formatCurrencyLite(tooltipItem.yLabel, 0);
						return label;
					}
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						// Include a dollar sign in the ticks
						callback: function (value, index, values) {
							return formatCurrencyLite(value, 0);
						}
					}
				}]
			}
		}
	})
}