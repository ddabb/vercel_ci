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
        const height = parseFloat(heightSlider.value); // 转换为米
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

        let advice = '';

        switch (category) {
            case '体重过轻':
                advice = '建议增加营养摄入，保持均衡饮食和适当运动，以促进健康增重。';
                break;
            case '正常范围':
                advice = '继续保持良好的生活习惯，定期进行体检，保持健康。';
                break;
            case '超重':
                advice = '建议控制饮食，增加运动量，以减轻体重并降低患病风险。';
                break;
            case '肥胖':
                advice = '强烈建议寻求专业的营养和健身指导，制定减肥计划，以改善健康状况。';
                break;
        }

        result.textContent = `您的身高是 ${heightSlider.value} m，体重是 ${weightSlider.value} kg，BMI是 ${bmi.toFixed(2)}，属于 ${category}。${advice}`;
        result.className = 'lead bmi-result ' + categoryMap[category];
    }

    heightSlider.addEventListener('input', function () {
        heightOutput.textContent = heightSlider.value + ' cm';
        calculateBMI();
    });

    weightSlider.addEventListener('input', function () {
        weightOutput.textContent = weightSlider.value + ' kg';
        calculateBMI();
    });
});