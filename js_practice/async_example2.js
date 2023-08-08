async function aa() {
  return 123;
}

//console.log(aa()); // Promise { 123 } -> fulfilled 상태

//await aa(); // 에러 -> await는 async 함수 안에서만 사용 가능

async function bb() {
  let result = await aa();
  console.log(result); // 123
}
console.log(bb()); // Promise { undefined } -> pending 상태

function cc() {
  return new Promise((resolve, reject) => {
    resolve(567);
  });
}

async function dd() {
  let result = await cc();
  console.log(result); // 567
}
console.log(dd()); // Promise { undefined } -> pending 상태
