// ==========================================
// 5주차: 소식 받기 실시간 폼 피드백 기능
// ==========================================

const serviceName = "초록달력";
let isSubscribed = false;

const subscribeForm = document.querySelector("#subscribeForm");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#submitButton");
const formMessage = document.querySelector("#formMessage");

function makeFeedbackMessage(email, subscribed) {
  if (subscribed === true) {
    return `${email}으로 ${serviceName} 물주기 알림 신청이 완료되었습니다!`;
  }
  return "이메일 주소를 입력해 주세요.";
}

function handleSubscribe(event) {
  event.preventDefault();

  const emailValue = emailInput.value.trim();

  if (emailValue === "") {
    isSubscribed = false;
    formMessage.textContent = makeFeedbackMessage(emailValue, isSubscribed);
    formMessage.classList.remove("is-saved");
    formMessage.classList.add("is-error");
    emailInput.focus();
    return;
  }

  isSubscribed = true;
  formMessage.textContent = makeFeedbackMessage(emailValue, isSubscribed);
  formMessage.classList.remove("is-error");
  formMessage.classList.add("is-saved");

  submitButton.textContent = "신청 완료";
  submitButton.disabled = true;
  emailInput.disabled = true;
}

if (subscribeForm) {
  subscribeForm.addEventListener("submit", handleSubscribe);
}

// ==========================================
// 6주차: 이벤트(click, input, change)와 동적 UI
// ==========================================

// 1. 단일 요소 선택
const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

// 2. click 이벤트: 테마 및 버튼 텍스트 전환
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
}

// 3. input 이벤트: 이름 입력 실시간 글자 수 반영
function handleUserNameInput() {
  const currentLength = userNameInput.value.length;
  userNameCount.textContent = currentLength + " / 10";
}

// 4. change 이벤트: 동의 체크박스 상태에 따른 문구, 스타일, 버튼 제어
function handleAgreeChange() {
  const agreed = agreeCheck.checked;
  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 서비스를 시작할 수 있습니다."
    : "안내 확인 후 서비스를 시작할 수 있습니다.";
  agreeMessage.classList.toggle("is-ready", agreed);
}

if (themeButton) {
  themeButton.addEventListener("click", handleThemeClick);
}

if (userNameInput) {
  userNameInput.addEventListener("input", handleUserNameInput);
}

if (agreeCheck) {
  agreeCheck.addEventListener("change", handleAgreeChange);
}

if (startButton) {
  startButton.addEventListener("click", function () {
    const name = userNameInput ? userNameInput.value.trim() : "";
    const greeting = name ? `${name}님과 함께하는 ` : "";
    alert(`${greeting}초록달력 서비스를 시작합니다! 환영합니다 🌱`);
  });
}

// 5. 탭 UI: querySelectorAll, forEach, data-* 속성 활용
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);
  if (!targetPanel) return;

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");
  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});
