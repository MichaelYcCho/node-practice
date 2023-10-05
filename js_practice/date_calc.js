/**
 * 두 날짜 사이의 차이를 일(day) 단위로 반환합니다.
 * @param {string} date1 첫 번째 날짜 문자열 (예: '2023-10-01')
 * @param {string} date2 두 번째 날짜 문자열 (예: '2023-10-05')
 * @returns {number} 두 날짜 사이의 차이 (일 단위)
 */
function calculateDateDifference(date1, date2) {
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  const differenceInTime = endDate.getTime() - startDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return Math.abs(differenceInDays);
}

// 날짜 차이 계산기
const diff = calculateDateDifference("2023-05-31", "2023-06-29");
//console.log(diff); // 출력: 4

// 2023-01-31, 2023-02-27 -> 27일
// 2023-02-28, 2023-03-30 -> 30일
// 2023-03-31, 2023-04-29 -> 29일
// 2023-04-30, 2023-05-30 -> 30일
// 2023-05-31, 2023-06-29 -> 29일

// 월계산기
/**
 * 주어진 날짜에 특정 개월 수를 더한 날짜를 반환합니다.
 * @param {string} dateStr 날짜 문자열 (예: '2023-10-01')
 * @param {number} months 더할 개월 수
 * @returns {string} 계산된 날짜 문자열
 */
function addMonthsToDate(dateStr, months) {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);

  // 결과를 'YYYY-MM-DD' 형태로 반환합니다.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // JS에서 월은 0부터 시작하므로 +1이 필요하고, 두 자릿수로 맞추기 위해 padStart를 사용합니다.
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const resultMonthDate = addMonthsToDate("2023-01-31", 1);
//console.log(resultMonthDate); // 출력: 2023-01-31 -> 2023-03-03

// 일계산기
/**
 * 주어진 날짜에 특정 일 수를 더한 날짜를 반환합니다.
 * @param {string} dateStr 날짜 문자열 (예: '2023-10-01')
 * @param {number} days 더할 일 수
 * @returns {string} 계산된 날짜 문자열
 */
function addDaysToDate(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);

  // 결과를 'YYYY-MM-DD' 형태로 반환합니다.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // JS에서 월은 0부터 시작하므로 +1이 필요하고, 두 자릿수로 맞추기 위해 padStart를 사용합니다.
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 예시
const resultDate = addDaysToDate("2023-01-31", 30);
//console.log(resultDate); // 출력: 2023-03-02

// // 구독 만료일 계산기
// /**
//  * 주어진 날짜에 특정 개월 수를 더한 후, 그 월의 가능한 일자를 조정하여 날짜를 반환합니다.
//  * @param {string} dateStr 날짜 문자열 (예: '2023-01-31')
//  * @param {number} months 더할 개월 수
//  * @returns {string} 계산된 날짜 문자열
//  */
// function nextSubscriptionDate(startDate) {
//   let nextDate = new Date(
//     startDate.getFullYear(),
//     startDate.getMonth() + 1,
//     startDate.getDate()
//   );

//   // 만약 다음 달에 해당 일이 존재하지 않으면 그 달의 마지막 날로 설정
//   if (startDate.getMonth() === nextDate.getMonth()) {
//     while (startDate.getMonth() === nextDate.getMonth()) {
//       nextDate.setDate(nextDate.getDate() - 1);
//     }
//   }

//   return nextDate;
// }

// function paymentProcess(startDate) {
//   // 실제 결제 처리 로직. 여기서는 단순히 날짜를 출력합니다.
//   console.log(
//     `Payment processed for subscription starting on ${startDate
//       .toISOString()
//       .slice(0, 10)}`
//   );
// }

// let startDate = new Date("2023-01-31");

// for (let i = 0; i < 5; i++) {
//   paymentProcess(startDate);
//   startDate = nextSubscriptionDate(startDate);
// }

function getNextPaymentDate(startDate) {
  let start = new Date(startDate);
  let nextMonth = new Date(start);

  nextMonth.setMonth(start.getMonth() + 1);

  // 만약 다음 달에 해당 날짜가 없다면 (예: 2월 30일, 2월 31일)
  // nextMonth는 다다음 달의 첫째 날이 될 것입니다.
  // 이 경우, nextMonth를 이전 달의 마지막 날로 설정해야 합니다.
  if (nextMonth.getMonth() !== (start.getMonth() + 1) % 12) {
    nextMonth.setDate(0);
  }

  return nextMonth.toISOString().slice(0, 10); // YYYY-MM-DD 형태로 반환
}

let startDate = "2023-02-28";
console.log(getNextPaymentDate(startDate)); // 2023-02-28

// 2023-01-31 -> 2023-02-28
