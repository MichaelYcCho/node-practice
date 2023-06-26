const person = {
    name: 'John',
    age: 20,
    greet(){
        console.log('Hi, I am ' + this.name);
    }
};

const hobbies = ['Sports', 'Cooking']; 
for (let hobby of hobbies){ // python 의 for in 과 비슷
    console.log(hobby);
} // Sports Cooking


// map은 함수의 형태이며, 어떻게 배열 또는 배열의 엘리먼트를 변환할지 정의한다.
console.log(hobbies.map(hobby => 'Hobby: ' + hobby)); // [ 'Hobby: Sports', 'Hobby: Cooking' ]