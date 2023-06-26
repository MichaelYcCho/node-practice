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



// 오 node array_method.js 로 실행가능 