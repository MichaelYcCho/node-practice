const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            // Time이 지나면 callback 함수를 실행한다.
            resolve('Done!');
        }, 1500);
    });
    return promise;
};

setTimeout(() => {
    console.log('Timer is done!');
    // then을 통해 promise가 resolve되면 실행할 함수를 정의할 수 있다.
    fetchData().then(text => {
        console.log(text);
        return fetchData();
    })
    .then(text2 => {
        console.log(text2);
    });
}, 2000);