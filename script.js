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
// 7주차 및 9주차: 사용자 흐름과 폼 UI & 입력 경험 설계
// ==========================================

const plantFlow = document.querySelector("#plantFlow");
const plantForm = document.querySelector("#plantForm");
const plantSteps = document.querySelectorAll(".plant-step");
const plantProgress = document.querySelector("#plantProgress");

const plantNameField = document.querySelector("#plant-name-field");
const plantName = document.querySelector("#plantName");
const plantNameHelp = document.querySelector("#plant-name-help");
const plantNameCount = document.querySelector("#plant-name-count");
const plantNameError = document.querySelector("#plant-name-error");

const plantDateField = document.querySelector("#plant-date-field");
const plantDate = document.querySelector("#plantDate");
const plantDateError = document.querySelector("#plant-date-error");

const plantType = document.querySelector("#plantType");
const plantHelp = document.querySelector("#plantHelp");
const plantSummary = document.querySelector("#plantSummary");

// 9주차 조건부 입력 요소
const nutritionOption = document.querySelector("#nutrition-option");
const nutritionOptions = document.querySelector("#nutrition-options");
const nutritionCycleInputs = [...document.querySelectorAll('input[name="nutrition-cycle"]')];

// 9주차 제출 상태 및 실패 테스트 요소
const submitStatus = document.querySelector("#submit-status");
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");

const plantNext1 = document.querySelector("#plantNext1");
const plantBack2 = document.querySelector("#plantBack2");
const plantNext2 = document.querySelector("#plantNext2");
const plantBack3 = document.querySelector("#plantBack3");
const plantComplete = document.querySelector("#plantComplete");
const plantRestart = document.querySelector("#plantRestart");

const stepNames = ["식물 정보 입력", "식물 종류 선택", "신청 내용 확인"];
let currentPlantStep = 1;

// 단계 표시 및 진행도 갱신 함수 (단계 제목에 초점 이동 포함)
function showPlantStep(step) {
  currentPlantStep = step;
  plantSteps.forEach((item) => {
    item.hidden = Number(item.dataset.step) !== step;
  });
  plantProgress.textContent =
    step <= 3 ? `${step} / 3 · ${stepNames[step - 1]}` : "신청 완료";

  if (step >= 1 && step <= 4) {
    const heading = plantSteps[step - 1].querySelector("h3");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
}

// 9주차 유닛 01: 조건부 입력 상태 갱신 함수
function syncNutritionFields() {
  if (!nutritionOption || !nutritionOptions) return;
  const open = nutritionOption.checked;
  nutritionOption.setAttribute("aria-expanded", String(open));
  nutritionOptions.hidden = !open;
  nutritionCycleInputs.forEach((input) => {
    input.disabled = !open;
  });
}

if (nutritionOption) {
  nutritionOption.addEventListener("change", syncNutritionFields);
  syncNutritionFields();
}

// 9주차 유닛 02: 실시간 글자 수 및 조건 충족 상태 갱신
function updatePlantNameExperience() {
  if (!plantName || !plantNameCount || !plantNameField || !plantNameHelp) return;
  const length = plantName.value.length;
  const enough = plantName.value.trim().length >= 2;
  const invalid = plantName.getAttribute("aria-invalid") === "true";

  plantNameCount.textContent = `${length} / 20자`;
  plantNameField.classList.toggle("is-valid", enough && !invalid);

  if (!invalid) {
    plantNameHelp.textContent = enough
      ? "입력 조건을 충족했습니다."
      : "식물을 구분할 수 있도록 2자 이상 입력해 주세요.";
  }
}

// 9주차 유닛 03: 오류 표시 및 해제 함수
function showPlantNameError(message) {
  if (!plantName || !plantNameError || !plantNameField) return false;
  plantName.setAttribute("aria-invalid", "true");
  plantNameError.textContent = message;
  plantNameField.classList.remove("is-valid");
  plantNameField.classList.add("has-error");
  return false;
}

function clearPlantNameError() {
  if (!plantName || !plantNameError || !plantNameField) return;
  plantName.removeAttribute("aria-invalid");
  plantNameError.textContent = "";
  plantNameField.classList.remove("has-error");
  updatePlantNameExperience();
}

function validatePlantName() {
  const name = plantName ? plantName.value.trim() : "";
  if (!name) {
    return showPlantNameError("식물 이름(애칭)을 입력해 주세요.");
  }
  if (name.length < 2) {
    return showPlantNameError("식물 이름을 2자 이상 입력해 주세요.");
  }
  clearPlantNameError();
  return true;
}

function showPlantDateError(message) {
  if (!plantDate || !plantDateError || !plantDateField) return false;
  plantDate.setAttribute("aria-invalid", "true");
  plantDateError.textContent = message;
  plantDateField.classList.add("has-error");
  return false;
}

function clearPlantDateError() {
  if (!plantDate || !plantDateError || !plantDateField) return;
  plantDate.removeAttribute("aria-invalid");
  plantDateError.textContent = "";
  plantDateField.classList.remove("has-error");
}

function validatePlantDate() {
  if (!plantDate || !plantDate.value) {
    return showPlantDateError("마지막으로 물 준 날짜를 선택해 주세요.");
  }
  clearPlantDateError();
  return true;
}

// 입력 중 실시간 검증 이벤트
if (plantName) {
  plantName.addEventListener("input", () => {
    updatePlantNameExperience();
    if (plantName.getAttribute("aria-invalid") === "true") {
      validatePlantName();
    }
  });
}

if (plantDate) {
  plantDate.addEventListener("change", () => {
    if (plantDate.getAttribute("aria-invalid") === "true") {
      validatePlantDate();
    }
  });
}

// 1단계 -> 2단계: 필수값 검증 및 첫 오류 필드로 초점 이동
if (plantNext1) {
  plantNext1.addEventListener("click", () => {
    const isNameValid = validatePlantName();
    const isDateValid = validatePlantDate();

    if (!isNameValid || !isDateValid) {
      if (!isNameValid) {
        plantName.focus();
      } else {
        plantDate.focus();
      }
      return;
    }

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
    const nutritionChecked = nutritionOption && nutritionOption.checked;
    const selectedRadio = nutritionCycleInputs.find((r) => r.checked);
    const nutritionCycleText = nutritionChecked && selectedRadio ? selectedRadio.value : "미설정";
    const nutritionLabel = nutritionChecked ? ` · 영양제 알림: ${nutritionCycleText}` : "";

    plantSummary.textContent = `${plantName.value.trim()} · 마지막 물 준 날: ${plantDate.value} · ${selectedTypeName}${nutritionLabel}`;
    showPlantStep(3);
  });
}

// 3단계 -> 2단계: 이전으로 이동 (선택값 유지)
if (plantBack3) {
  plantBack3.addEventListener("click", () => {
    showPlantStep(2);
  });
}

// 9주차 유닛 03: 폼 submit 이벤트와 저장/로딩 상태 처리
function setSubmitState(loading, message) {
  if (plantForm) {
    plantForm.setAttribute("aria-busy", String(loading));
  }
  if (plantComplete) {
    plantComplete.disabled = loading;
    plantComplete.textContent = loading ? "저장하는 중…" : "알림 신청 완료하기 →";
  }
  if (submitStatus) {
    submitStatus.textContent = message;
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function persistPlantPlan(newPlant) {
  await wait(600);

  if (forceSaveFailure) {
    throw new Error("수업용 저장 실패 시뮬레이션");
  }

  registeredPlants.push(newPlant);
  renderPlantList();
}

if (plantForm) {
  plantForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (currentPlantStep === 1) {
      if (plantNext1) plantNext1.click();
      return;
    }

    if (currentPlantStep !== 3) return;

    const isNameValid = validatePlantName();
    const isDateValid = validatePlantDate();

    if (!isNameValid || !isDateValid) {
      showPlantStep(1);
      window.requestAnimationFrame(() => {
        plantForm.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const plantTypeOption = plantType.options[plantType.selectedIndex].text;
    const cleanTypeName = plantTypeOption.split(" (")[0];
    const nutritionChecked = nutritionOption && nutritionOption.checked;
    const selectedRadio = nutritionCycleInputs.find((r) => r.checked);
    const nutritionCycleText = nutritionChecked && selectedRadio ? selectedRadio.value : null;

    const newPlant = {
      id: Date.now(),
      name: plantName.value.trim(),
      lastDate: plantDate.value,
      type: plantType.value,
      typeName: cleanTypeName,
      cycleDays: plantCycleDays[plantType.value] || 7,
      nutrition: nutritionCycleText,
      isWateredToday: false,
      cancelled: false
    };

    setSubmitState(true, "알림 신청을 저장하고 있습니다.");

    try {
      await persistPlantPlan(newPlant);
      setSubmitState(false, "알림 신청이 성공적으로 완료되었습니다.");
      showPlantStep(4);
    } catch {
      setSubmitState(
        false,
        "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요."
      );
    }
  });
}

// 4단계 -> 다시 시작: 모든 입력값과 화면 상태 완전 초기화
if (plantRestart) {
  plantRestart.addEventListener("click", () => {
    if (plantForm) plantForm.reset();
    syncNutritionFields();

    if (plantNameCount) plantNameCount.textContent = "0 / 20자";
    if (plantNameHelp) plantNameHelp.textContent = "식물을 구분할 수 있도록 2자 이상 입력해 주세요.";
    if (plantNameError) plantNameError.textContent = "";
    if (plantDateError) plantDateError.textContent = "";

    if (plantName) plantName.removeAttribute("aria-invalid");
    if (plantDate) plantDate.removeAttribute("aria-invalid");
    if (plantNameField) plantNameField.classList.remove("is-valid", "has-error");
    if (plantDateField) plantDateField.classList.remove("has-error");
    setSubmitState(false, "");

    showPlantStep(1);
    if (plantName) plantName.focus();
  });
}

// ==========================================
// 10주차: 내비게이션 UI, 현재 위치 감지, 목록 필터 & 탐색
// ==========================================

// 내비게이션 및 모바일 메뉴 요소
const navLinks = document.querySelectorAll(".main-nav a");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

// 10주차 필터 버튼 및 상태
const filterButtons = document.querySelectorAll(".filter-button");
let currentFilter = "all";

const plantListSection = document.querySelector("#plantListSection");
const plantCountBadge = document.querySelector("#plantCountBadge");
const plantEmptyState = document.querySelector("#plantEmptyState");
const plantCardsContainer = document.querySelector("#plantCardsContainer");
const emptyAddButton = document.querySelector("#emptyAddButton");
const viewListButton = document.querySelector("#viewListButton");

// 식물 종류별 권장 주기 (일수)
const plantCycleDays = {
  monstera: 7,
  succulent: 30,
  pothos: 6,
  tablepalm: 4
};

// 등록된 식물 목록 상태 배열
let registeredPlants = [];

// 1. 현재 메뉴 위치 표시 함수
function updateCurrentNav() {
  const currentHash = window.location.hash;

  navLinks.forEach((link) => {
    const current = currentHash
      ? link.getAttribute("href") === currentHash
      : link === navLinks[0];

    link.classList.toggle("is-current", current);

    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // 11주차: 현재 메뉴 위치를 브라우저 탭 제목(document.title)에 실시간 반영
  const currentLink = document.querySelector('.main-nav a[aria-current="page"]');
  const pageName = currentLink ? currentLink.textContent.trim() : "홈";
  document.title = `${pageName} | 초록달력`;
}

window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();

// 2. 모바일 메뉴 열기/닫기 토글
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// 11주차: Esc 키로 열린 모바일 메뉴 닫기 및 초점 복귀
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !mainNav || !mainNav.classList.contains("is-open")) return;
  mainNav.classList.remove("is-open");
  if (menuToggle) {
    menuToggle.textContent = "메뉴 열기";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  }
});

// 3. 목적지 선택 시 모바일 메뉴 자동 닫기 및 알림 신청 섹션 열기
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mainNav && menuToggle) {
      mainNav.classList.remove("is-open");
      menuToggle.textContent = "메뉴 열기";
      menuToggle.setAttribute("aria-expanded", "false");
    }

    const targetHash = link.getAttribute("href");
    if (targetHash === "#plantFlow" && plantFlow) {
      plantFlow.hidden = false;
      showPlantStep(1);
    }
  });
});

// HTML 특수문자 이스케이프 함수
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 날짜 객체를 YYYY-MM-DD 문자열로 변환하는 함수
function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 다음 물주기 날짜 및 D-Day 계산 함수
function calculateNextWatering(lastDateStr, cycleDays, isWateredToday) {
  const [year, month, day] = lastDateStr.split("-").map(Number);
  const nextDate = new Date(year, month - 1, day + cycleDays);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const nextDateStr = formatDateToString(nextDate);

  if (isWateredToday) {
    return {
      ddayText: "오늘 완료 🌱",
      badgeClass: "is-done",
      nextDateStr: nextDateStr
    };
  }

  if (diffDays === 0) {
    return {
      ddayText: "오늘 물주기! (D-Day)",
      badgeClass: "is-urgent",
      nextDateStr: nextDateStr
    };
  } else if (diffDays < 0) {
    return {
      ddayText: `물주기 ${Math.abs(diffDays)}일 지남!`,
      badgeClass: "is-urgent",
      nextDateStr: nextDateStr
    };
  } else if (diffDays <= 2) {
    return {
      ddayText: `D-${diffDays} (임박)`,
      badgeClass: "is-urgent",
      nextDateStr: nextDateStr
    };
  } else {
    return {
      ddayText: `D-${diffDays}`,
      badgeClass: "is-normal",
      nextDateStr: nextDateStr
    };
  }
}

// 4. 10주차 조건에 맞는 식물 목록 필터링 함수
function getVisiblePlants() {
  return registeredPlants.filter((plant) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "cancelled") return Boolean(plant.cancelled);
    return !plant.cancelled; // "active" (관리 중)
  });
}

// 5. 식물 목록 화면 렌더링 함수
function renderPlantList() {
  if (!plantCountBadge || !plantEmptyState || !plantCardsContainer) return;

  const visiblePlants = getVisiblePlants();
  const count = visiblePlants.length;
  const isFiltered = currentFilter !== "all";

  // 상태 뱃지 및 접근성 안내 갱신
  const statusLabel = currentFilter === "cancelled" ? "알림 취소됨" : "관리 중";
  plantCountBadge.textContent = `${count}개 ${statusLabel}`;
  plantCountBadge.setAttribute("aria-label", `현재 표시 중인 식물 ${count}개`);

  const emptyTitle = plantEmptyState.querySelector(".empty-title");
  const emptyDesc = plantEmptyState.querySelector(".empty-desc");
  const emptyActionBtn = document.querySelector("#emptyAddButton");

  // 분기 1: 표시할 식물이 없는 경우
  if (count === 0) {
    plantEmptyState.hidden = false;
    plantCardsContainer.hidden = true;
    plantCardsContainer.innerHTML = "";

    if (isFiltered) {
      // 11주차: 특정 필터 결과가 없을 때 '전체 식물 보기' 버튼 제공 및 초점 이동 준비
      if (emptyTitle) emptyTitle.textContent = "선택한 상태의 반려식물이 없어요.";
      if (emptyDesc) emptyDesc.textContent = "다른 상태 필터를 선택하여 등록된 식물을 확인해 보세요.";
      if (emptyActionBtn) {
        emptyActionBtn.hidden = false;
        emptyActionBtn.textContent = "전체 식물 보기";
      }
    } else {
      // 전체 목록이 아예 없을 때
      if (emptyTitle) emptyTitle.textContent = "등록된 반려식물 알림이 없습니다";
      if (emptyDesc) emptyDesc.textContent = "위의 물주기 알림 신청을 통해 키우시는 식물을 등록해 보세요.";
      if (emptyActionBtn) {
        emptyActionBtn.hidden = false;
        emptyActionBtn.textContent = "식물 등록하러 가기";
      }
    }
    return;
  }

  // 분기 2: 표시할 식물이 있는 경우 (카드 목록 표시)
  plantEmptyState.hidden = true;
  plantCardsContainer.hidden = false;

  plantCardsContainer.innerHTML = visiblePlants
    .map((plant) => {
      const info = calculateNextWatering(
        plant.lastDate,
        plant.cycleDays,
        plant.isWateredToday
      );

      const isCancelled = Boolean(plant.cancelled);

      return `
        <article class="plant-card ${isCancelled ? "is-cancelled" : ""}" data-id="${plant.id}">
          <div>
            <div class="card-top">
              <div>
                <h3 class="plant-title">${escapeHtml(plant.name)}</h3>
                <span class="plant-type-tag">${escapeHtml(plant.typeName)} (권장: ${plant.cycleDays}일마다)</span>
              </div>
              <span class="dday-badge ${isCancelled ? "is-cancelled" : info.badgeClass}">
                ${isCancelled ? "알림 취소됨" : info.ddayText}
              </span>
            </div>
            <div class="plant-meta">
              <p><strong>마지막 물 준 날:</strong> ${plant.lastDate}</p>
              <p><strong>다음 물주기 예정:</strong> ${isCancelled ? "알림 중단됨" : info.nextDateStr}</p>
              ${plant.nutrition ? `<p><strong>영양제 알림:</strong> ${escapeHtml(plant.nutrition)}</p>` : ""}
            </div>
          </div>
          <div class="card-actions">
            ${
              isCancelled
                ? `
              <button type="button" class="btn-restore" data-action="restore" data-id="${plant.id}">
                ↺ 알림 다시 시작하기
              </button>
            `
                : `
              <button type="button" class="btn-water" data-action="water" data-id="${plant.id}">
                🌱 오늘 물주기 완료
              </button>
              <button type="button" class="btn-delete" data-action="cancel" data-id="${plant.id}">
                알림 취소
              </button>
            `
            }
          </div>
        </article>
      `;
    })
    .join("");
}

// 6. 필터 버튼 클릭 이벤트 연결
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    renderPlantList();

    // 11주차: 필터 조작 시 결과 개수와 결과 없음을 실시간 음성(aria-live)으로 전달
    const count = getVisiblePlants().length;
    const filterName = button.textContent.trim();
    if (plantCountBadge) {
      plantCountBadge.textContent = count > 0
        ? `${filterName} 식물 ${count}개가 표시됩니다.`
        : `${filterName} 식물이 없습니다. 다른 상태를 선택해 보세요.`;
    }
  });
});

// 4단계 완료 화면에서 '내 알림 목록 보기' 클릭 시 스크롤 이동
if (viewListButton && plantListSection) {
  viewListButton.addEventListener("click", () => {
    plantListSection.scrollIntoView({ behavior: "smooth" });
  });
}

// 11주차: 빈 상태 버튼 클릭 시 전체 보기 복귀 또는 1단계 등록 이동
if (emptyAddButton) {
  emptyAddButton.addEventListener("click", () => {
    if (currentFilter !== "all") {
      const allButton = document.querySelector('.filter-button[data-filter="all"]');
      if (allButton) {
        allButton.click();
        allButton.focus();
      }
    } else if (plantFlow) {
      plantFlow.hidden = false;
      showPlantStep(1);
      plantFlow.scrollIntoView({ behavior: "smooth" });
      plantName?.focus();
    }
  });
}

// 카드 내 이벤트 위임: '오늘 물주기 완료'(상태 갱신), '알림 취소', '알림 다시 시작'
if (plantCardsContainer) {
  plantCardsContainer.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    const plant = registeredPlants.find((item) => item.id === id);
    if (!plant) return;

    if (action === "water") {
      const todayStr = formatDateToString(new Date());
      plant.lastDate = todayStr;
      plant.isWateredToday = true;
      renderPlantList();
    } else if (action === "cancel") {
      plant.cancelled = true;
      renderPlantList();
      // 11주차: 카드가 사라진 뒤 키보드 초점이 길을 잃지 않도록 현재 선택된 필터 버튼으로 초점 이동
      const selectedFilter = document.querySelector('.filter-button[aria-pressed="true"]');
      selectedFilter?.focus();
    } else if (action === "restore") {
      plant.cancelled = false;
      renderPlantList();
      const selectedFilter = document.querySelector('.filter-button[aria-pressed="true"]');
      selectedFilter?.focus();
    }
  });
}

// 초기 화면 로드 시 목록 상태 초기화
renderPlantList();
