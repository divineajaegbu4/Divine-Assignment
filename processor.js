const numbers = [22, 67, 33, 96, 88, 72, 49, 11, 53];


const calculateSum = (arr) => {
    let sum = 0;

    for(let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    return sum;
}


const findMax = (arr) => {
    let max = 0;

    for (let i = 0; i < arr.length; i++) {
        // Log each number
        // console.log(arr[i]);

        if(arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}



const getCalculateSum = calculateSum(numbers);
const getFindMax = findMax(numbers);

const calculateAverage = getCalculateSum / numbers.length;

console.log(`Sum: [${getCalculateSum}], Average: [${calculateAverage}], Max: [${getFindMax}]`)

