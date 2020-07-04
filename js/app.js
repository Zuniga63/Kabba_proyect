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

const printDoughnutChart = (ctx, title, data, labels, bgColors, borderColor) => {
	let displayTitle = false;
	if (title) {
		displayTitle = true;
	}
	myChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels,
			datasets: [{
				data,
				backgroundColor: bgColors,
				borderColor,
				borderWidth: 1
			}]//Fin del datasets
		},
		options: {
			resposive: true,
			title: {
				display: displayTitle,
				text: title
			}
		}//Fin de option
	});//Fin de Chart
}

const updateCustomerSumary = () => {

	//Se recuperan los graficos
	const customerSumary = document.getElementById('customerSumary');
	const delinquentCustomers = document.getElementById('delinquentCustomers');
	const collectionDificulty = document.getElementById('collectionDificulty');
	const cashFlowQuinquenal = document.getElementById('cashFlowQuinquenal');

	//Se definen los colores
	let bgBlue = 'rgba(54, 162, 235, 0.2)';
	let borderBlue = 'rgba(54, 162, 235, 1)';

	let bgRed = 'rgba(255, 99, 132, 0.2)';
	let borderRed = 'rgba(255, 99, 132, 1)';

	let bgGreen = 'rgba(46, 204, 113,0.2)';
	let borderGreen = 'rgba(46, 204, 113,1)';

	let bgYellow = 'rgba(241, 196, 15,0.2)';
	let borderYellow = 'rgba(241, 196, 15,1.0)';

	let bgOrange = 'rgba(211, 84, 0, 0.2)'
	let borderOrange = 'rgba(211, 84, 0, 1)'

	let bgColors = [
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 99, 132, 0.2)'
	];

	let borderColor = [
		'rgba(54, 162, 235, 1)',
		'rgba(255, 99, 132, 1)'
	];

	//Se recuperan las variables
	let activeCustomers = 0;
	let activeAmount = 0;

	let inactiveCustomers = 0;

	let delinquentCustomersCount = 0;
	let delinquentAmount = 0;

	let correctCustomers = 0;
	let corretAmount = 0;

	let easyCollect = 0;
	let easyAmount = 0;

	let moderateCollect = 0;
	let moderateAmount = 0;

	let dificultCollect = 0;
	let dificultAmount = 0;

	let veryDificultColllect = 0;
	let veryDificultAmount = 0;

	customers.forEach(customer => {
		if (customer.inactive) {
			inactiveCustomers++;
		} else {
			activeCustomers++;
			activeAmount += customer.balance;
			if (customer.deliquentBalance) {
				delinquentCustomersCount++;
				delinquentAmount += customer.balance;
			} else {
				correctCustomers++;
				corretAmount += customer.balance;
			}

			if (customer.paymentFrecuency < 30) {
				easyCollect++;
				easyAmount += customer.balance;
			} else if (customer.paymentFrecuency < 60) {
				moderateCollect++;
				moderateAmount += customer.balance;
			} else if (customer.paymentFrecuency < 90) {
				dificultCollect++;
				dificultAmount += customer.balance;
			} else {
				veryDificultColllect++;
				veryDificultAmount += customer.balance;
			}
		}
	})//Fin de forEach

	//Se actualizan las graficas
	printDoughnutChart(customerSumary, '', [activeCustomers, inactiveCustomers], ['Activos', 'Inactivos'], bgColors, borderColor);

	printDoughnutChart(delinquentCustomers, '', [correctCustomers, delinquentCustomersCount], ['Al día', 'Morosos'], [bgGreen, bgRed], [borderGreen, borderRed]);

	printDoughnutChart(collectionDificulty, '', [easyCollect, moderateCollect, dificultCollect, veryDificultColllect], ['Facil', 'Moderado', 'Dificil', 'Muy dificil'], [bgGreen, bgYellow, bgOrange, bgRed], [borderGreen, borderYellow, borderOrange, borderRed]);


	//Ahora se actualiza el diagrama de barras
	let reportLength = reports.length;
	let labels = [];
	let credits = [];
	let payments = [];

	let lastReports = [reports[reportLength - 4], reports[reportLength - 3], reports[reportLength - 2], reports[reportLength - 1]];

	lastReports.forEach(r => {
		let until = moment(r.until, 'YYYY-M-DD').subtract(1, 'days');
		let label = `${until.format('MMMM DD')}`;

		labels.push(label);
		credits.push(r.creditAmount);
		payments.push(r.paymentAmount);
	})


	let barCharData = {
		labels,
		datasets: [{
			label: 'Abonos',
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1,
			data: payments
		}, {
			label: 'Creditos',
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 1,
			data: credits
		}]
	}

	printBarChart(cashFlowQuinquenal, barCharData);

	//Se actualizan las leyendas de las graficas 
	let activePercentage = customers.length > 0
		? Math.floor((activeCustomers / customers.length) * 100)
		: 0;

	let deliquentPercentage = activeCustomers > 0
		? Math.floor((delinquentCustomersCount / activeCustomers) * 100)
		: 0;

	let correctPercentage = activeCustomers > 0
		? Math.floor((correctCustomers / activeCustomers) * 100)
		: 0;

	let easyPercentage = activeCustomers > 0
		? Math.floor((easyCollect / activeCustomers) * 100)
		: 0;

	let moderatePercentage = activeCustomers > 0
		? Math.floor((moderateCollect / activeCustomers) * 100)
		: 0;

	let dificultPercentage = activeCustomers > 0
		? Math.floor((dificultCollect / activeCustomers) * 100)
		: 0;

	let veryDificultPercentage = activeCustomers > 0
		? Math.floor((veryDificultColllect / activeCustomers) * 100)
		: 0;

	document.getElementById('customerSumaryInfo').innerHTML = `El <span class="history__card__bold">${activePercentage}%</span> de los clientes del sistema se encuentran activos con un saldo deudor que asciende a <span class="history__card__bold">${formatCurrencyLite(activeAmount, 0)}</span>`;

	document.getElementById('delinquentCustomersInfo').innerHTML = `El <span class="history__card__bold">${correctPercentage}%</span> de los clientes activos se encuentran al día con un saldo pendiente total de <span class="history__card__bold">${formatCurrencyLite(corretAmount, 0)}</span>; mientras que el <span class="history__card__bold">${deliquentPercentage}%</span> presentan un saldo en mora de <span class="history__card__bold">${formatCurrencyLite(delinquentAmount, 0)}</span>`;

	document.getElementById('collectionDificultyInfo').innerHTML = `El <span class="history__card__bold">${easyPercentage}% (${formatCurrencyLite(easyAmount, 0)})</span> presentan una frecuencia de pago menor a 30 días;<br>El <span class="history__card__bold">${moderatePercentage}% (${formatCurrencyLite(moderateAmount, 0)})</span> presenta una frecuencia de pago entre 30 y 60 días;<br>El <span class="history__card__bold">${dificultPercentage}% (${formatCurrencyLite(dificultAmount, 0)})</span> presentan una frecuencia de pago entre 60 y 90 día.<br>El <span class="history__card__bold">${veryDificultPercentage}% (${formatCurrencyLite(veryDificultAmount, 0)})</span> presentan una frecuencia de pago superior a 90 días.`;
}//Fin del metodo