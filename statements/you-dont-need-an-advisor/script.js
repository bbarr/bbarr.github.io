// Expandable sections
document.querySelectorAll('.expand-btn').forEach(button => {
    button.addEventListener('click', () => {
        const evidenceId = button.getAttribute('aria-controls');
        const evidence = document.getElementById(evidenceId);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        button.setAttribute('aria-expanded', !isExpanded);
        evidence.hidden = isExpanded;
        button.querySelector('.expand-icon').textContent = isExpanded ? '+' : '−';
    });
});

// Fee Calculator
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

function calculateFutureValue(principal, annualContribution, years, returnRate, feeRate) {
    const netReturn = (returnRate - feeRate) / 100;
    let balance = principal;
    
    for (let year = 0; year < years; year++) {
        balance = balance * (1 + netReturn) + annualContribution;
    }
    
    return balance;
}

function updateCalculator() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
    const annualContribution = parseFloat(document.getElementById('annual-contribution').value) || 0;
    const years = parseInt(document.getElementById('years').value) || 0;
    const returnRate = parseFloat(document.getElementById('return-rate').value) || 0;
    const advisorFee = parseFloat(document.getElementById('advisor-fee').value) || 0;
    const indexFee = parseFloat(document.getElementById('index-fee').value) || 0;
    
    const advisorValue = calculateFutureValue(initialInvestment, annualContribution, years, returnRate, advisorFee);
    const indexValue = calculateFutureValue(initialInvestment, annualContribution, years, returnRate, indexFee);
    const costOfAdvisor = indexValue - advisorValue;
    
    document.getElementById('advisor-result').textContent = formatCurrency(advisorValue);
    document.getElementById('index-result').textContent = formatCurrency(indexValue);
    document.getElementById('cost-result').textContent = formatCurrency(costOfAdvisor);
}

// Add event listeners to all calculator inputs
document.querySelectorAll('.calculator-inputs input').forEach(input => {
    input.addEventListener('input', updateCalculator);
});

// Initial calculation
updateCalculator();
