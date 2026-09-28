// 1. 변하지 않는 서비스 정보는 const로 저장합니다.
const serviceName = "초록달력";

// 2. 신청 완료 여부 상태는 let으로 저장합니다.
let isSubscribed = false;

// 3. DOM에서 필요한 요소를 선택합니다.
const subscribeForm = document.querySelector("#subscribeForm");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#submitButton");
const formMessage = document.querySelector("#formMessage");

// 4. 상태 및 입력값에 맞는 피드백 문구를 반환하는 함수입니다.
function makeFeedbackMessage(email, subscribed) {
  if (subscribed === true) {
    return `${email}으로 ${serviceName} 물주기 알림 신청이 완료되었습니다!`;
  }
  return "이메일 주소를 입력해 주세요.";
}

// 5. 폼 제출 시 실행할 함수입니다.
function handleSubscribe(event) {
  event.preventDefault(); // 기본 새로고침 동작 방지

  const emailValue = emailInput.value.trim();

  // === 연산자로 입력값 검증
  if (emailValue === "") {
    isSubscribed = false;
    formMessage.textContent = makeFeedbackMessage(emailValue, isSubscribed);
    formMessage.classList.remove("is-saved");
    formMessage.classList.add("is-error");
    emailInput.focus();
    return;
  }

  // 성공 상태 업데이트
  isSubscribed = true;
  formMessage.textContent = makeFeedbackMessage(emailValue, isSubscribed);
  formMessage.classList.remove("is-error");
  formMessage.classList.add("is-saved");

  // 버튼 글자 및 상태 변경 (중복 클릭 방지)
  submitButton.textContent = "신청 완료";
  submitButton.disabled = true;
  emailInput.disabled = true;
}

// 6. submit 이벤트와 함수를 연결합니다.
if (subscribeForm) {
  subscribeForm.addEventListener("submit", handleSubscribe);
}
