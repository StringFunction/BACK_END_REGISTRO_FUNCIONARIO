const { format } = require('date-fns');

const data_atual = new Date();
const dataFormatada = format(data_atual, 'yyyy/MM/yyyy'); // Formatar a data
console.log(dataFormatada); // Exibe a data formatada