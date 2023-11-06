const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:8080'); // B 소켓의 주소와 포트로 변경하세요.

ws.on('open', function open() {
  console.log('Connected to B socket');

  // 오디오 파일을 읽습니다.
  const stream = fs.createReadStream('vos-test24.wav', {
    highWaterMark: 1024,
  });

  console.log('Start sending audio data');
  // highWaterMark는 한 번에 읽을 바이트 수를 설정합니다.
  // 실시간 데이터의 크기를 시뮬레이션하기 위해 적절한 크기로 설정합니다.

  // 스트림을 통해 파일을 조각내어 전송합니다.
  stream.on('data', (chunk) => {
    ws.send(chunk);
    console.log('Sent chunk to B socket');
  });

  stream.on('end', () => {
    console.log('Finished sending audio data');
    ws.close(); // 모든 데이터를 전송한 후 연결을 닫습니다.
  });
});

ws.on('error', function error(e) {
  console.log('WebSocket error: ' + e.message);
});

ws.on('close', function close() {
  console.log('Disconnected from B socket');
});
