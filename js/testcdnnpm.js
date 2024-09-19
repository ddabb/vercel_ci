import { getPoets, getPoems, getPoemsByPoet } from 'poetryesm';

getPoets().then(poets => {
    document.getElementById('poets').textContent = JSON.stringify(poets, null, 2);
}).catch(error => {
    console.error('Error fetching poets:', error);
});

getPoems().then(poems => {
    document.getElementById('poems').textContent = JSON.stringify(poems, null, 2);
}).catch(error => {
    console.error('Error fetching poems:', error);
});

getPoemsByPoet('李白').then(poems => {
    document.getElementById('poems-by-poet').textContent = JSON.stringify(poems, null, 2);
}).catch(error => {
    console.error('Error fetching poems by poet:', error);
});