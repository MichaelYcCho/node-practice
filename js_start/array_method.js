const person = {
    name: 'John',
    age: 20,
    greet(){
        console.log('Hi, I am ' + this.name);
    }
};

const hobbies = ['Sports', 'Cooking']; 

const copiedArray = [...hobbies]; // spread operator
console.log(copiedArray); // [ 'Sports', 'Cooking' ]


// for (let hobby of hobbies){ // python 의 for in 과 비슷
//     console.log(hobby);
// } // Sports Cooking
// // map은 함수의 형태이며, 어떻게 배열 또는 배열의 엘리먼트를 변환할지 정의한다.
// console.log(hobbies.map(hobby => 'Hobby: ' + hobby)); // [ 'Hobby: Sports', 'Hobby: Cooking' ]

// 참조 타입(array, function, object, date emd)은 배열이 저장된 메모리 위치를 가리키는 주소만 저장하므로, 새로운 원소를 추가한다고 해서 메모리 주소가 바뀌지 않는다.
// 따라서 상수로 저장된값은 포인터로 나타낸 주소만 나타내고, 그 주소에 저장된 값은 변경이 가능하다.
// hobbies.push('Programming');
// console.log(hobbies); // [ 'Sports', 'Cooking', 'Programming' ]
