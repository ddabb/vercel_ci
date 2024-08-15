document.addEventListener('DOMContentLoaded', function () {
    const heightSlider = document.getElementById('heightSlider');
    const weightSlider = document.getElementById('weightSlider');
    const heightOutput = document.getElementById('heightOutput');
    const weightOutput = document.getElementById('weightOutput');
    const result = document.getElementById('bmiresult');

    const categoryMap = {
        '体重过轻': 'underweight',
        '正常范围': 'normal',
        '超重': 'overweight',
        '肥胖': 'obese'
    };

    function calculateBMI() {
        const height = parseFloat(heightSlider.value);
        const weight = parseFloat(weightSlider.value);

        const bmi = weight / (height * height);
        let category;

        if (bmi < 18.5) {
            category = '体重过轻';
        } else if (bmi >= 18.5 && bmi < 24) {
            category = '正常范围';
        } else if (bmi >= 24 && bmi < 28) {
            category = '超重';
        } else {
            category = '肥胖';
        }

        result.textContent = `您的BMI是 ${bmi.toFixed(2)}，属于 ${category}。`;
        result.className = 'lead bmi-result ' + categoryMap[category];
    }

    heightSlider.addEventListener('input', function () {
        heightOutput.textContent = heightSlider.value;
        calculateBMI();
    });

    weightSlider.addEventListener('input', function () {
        weightOutput.textContent = weightSlider.value;
        calculateBMI();
    });
});