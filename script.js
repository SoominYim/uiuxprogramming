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
    // 7주차: 단순 alert 대신 단계별 사용자 흐름(#plantFlow)으로 진입하도록 연결합니다.
    if (plantFlow) {
      plantFlow.hidden = false;
      showPlantStep(1);

      // 6주차에서 입력한 반려식물 애칭/이름이 있다면 1단계 식물 이름에 자동 반영
      const name = userNameInput ? userNameInput.value.trim() : "";
      if (name && plantName && !plantName.value) {
        plantName.value = name;
      }

      plantFlow.scrollIntoView({ behavior: "smooth" });
      plantName.focus();
    }
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

// ==========================================
// 7주차: 사용자 흐름 및 인터랙션 시나리오
// ==========================================

const plantFlow = document.querySelector("#plantFlow");
const plantSteps = document.querySelectorAll(".plant-step");
const plantProgress = document.querySelector("#plantProgress");
const plantName = document.querySelector("#plantName");
const plantDate = document.querySelector("#plantDate");
const plantType = document.querySelector("#plantType");
const plantError = document.querySelector("#plantError");
const plantHelp = document.querySelector("#plantHelp");
const plantSummary = document.querySelector("#plantSummary");

const plantNext1 = document.querySelector("#plantNext1");
const plantBack2 = document.querySelector("#plantBack2");
const plantNext2 = document.querySelector("#plantNext2");
const plantBack3 = document.querySelector("#plantBack3");
const plantComplete = document.querySelector("#plantComplete");
const plantRestart = document.querySelector("#plantRestart");

const stepNames = ["식물 정보 입력", "식물 종류 선택", "신청 내용 확인"];

// 단계 표시 및 진행도 갱신 함수
function showPlantStep(step) {
  plantSteps.forEach((item) => {
    item.hidden = Number(item.dataset.step) !== step;
  });
  plantProgress.textContent =
    step <= 3 ? `${step} / 3 · ${stepNames[step - 1]}` : "신청 완료";
}

// 1단계 -> 2단계: 필수값(이름, 날짜) 검증
if (plantNext1) {
  plantNext1.addEventListener("click", () => {
    const missingName = !plantName.value.trim();
    const missingDate = !plantDate.value;

    if (missingName || missingDate) {
      plantError.textContent = missingName
        ? "식물 이름(애칭)을 입력해 주세요."
        : "마지막으로 물 준 날짜를 선택해 주세요.";
      plantName.classList.toggle("has-error", missingName);
      plantDate.classList.toggle("has-error", missingDate);
      (missingName ? plantName : plantDate).focus();
      return;
    }

    plantError.textContent = "";
    plantName.classList.remove("has-error");
    plantDate.classList.remove("has-error");
    showPlantStep(2);
  });
}

// 2단계: 식물 종류 선택에 따른 동적 도움말 표시
if (plantType) {
  plantType.addEventListener("change", () => {
    plantHelp.hidden = plantType.value !== "succulent";
  });
}

// 2단계 -> 1단계: 이전으로 이동 (입력값 유지)
if (plantBack2) {
  plantBack2.addEventListener("click", () => {
    showPlantStep(1);
    plantName.focus();
  });
}

// 2단계 -> 3단계: 내용 확인으로 이동 (입력값 및 선택값 요약 반영)
if (plantNext2) {
  plantNext2.addEventListener("click", () => {
    const selectedTypeName = plantType.options[plantType.selectedIndex].text;
    plantSummary.textContent = `${plantName.value.trim()} · 마지막 물 준 날: ${plantDate.value} · ${selectedTypeName}`;
    showPlantStep(3);
  });
}

// 3단계 -> 2단계: 이전으로 이동 (선택값 유지)
if (plantBack3) {
  plantBack3.addEventListener("click", () => {
    showPlantStep(2);
  });
}

// 3단계 -> 4단계: 알림 신청 완료
if (plantComplete) {
  plantComplete.addEventListener("click", () => {
    showPlantStep(4);
  });
}

// 4단계 -> 다시 시작: 모든 입력값과 상태 초기화 후 1단계 복귀
if (plantRestart) {
  plantRestart.addEventListener("click", () => {
    plantName.value = "";
    plantDate.value = "";
    plantType.value = "monstera";
    plantError.textContent = "";
    plantName.classList.remove("has-error");
    plantDate.classList.remove("has-error");
    plantHelp.hidden = true;
    plantSummary.textContent = "";
    showPlantStep(1);
    plantName.focus();
  });
}
