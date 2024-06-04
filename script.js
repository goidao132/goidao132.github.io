const calculator = {
    displayValue: '0',  // Valor atual mostrado na tela
    firstOperand: null, // Primeiro operando
    waitingForSecondOperand: false, // Indica se o segundo operando está sendo aguardado
    operator: null, // Operador atual
};

// Função para inserir um dígito na tela
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Função para inserir o ponto decimal
function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Função para lidar com operadores
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Funções para cálculos
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand,
    'log': (firstOperand, secondOperand) => Math.log(secondOperand) / Math.log(firstOperand),
    'exp': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand)
};

// Função para lidar com funções avançadas (log e exp)
function handleFunction(func) {
    const { displayValue } = calculator;
    const inputValue = parseFloat(displayValue);

    let result = 0;
    if (func === 'log') {
        result = Math.log10(inputValue); // Calcula logaritmo base 10
    } else if (func === 'exp') {
        result = Math.exp(inputValue); // Calcula exponencial
    }

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.firstOperand = null;
}

// Função para resetar a calculadora
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Função para atualizar a tela da calculadora
function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

// Evento para lidar com cliques nos botões
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', event => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('function')) {
        handleFunction(target.value);
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});