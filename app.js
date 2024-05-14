const prenexIcons = document.querySelectorAll("#prevNextButton button");
const day = document.querySelector(".calendar-dates");
const currdate = document.querySelector(".calendar-current-date");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
const modalSubmit = document.getElementById("modalSubmit");
const modalInput = document.getElementById("modalInput");
const modalClose = document.getElementById("modalClose");
const modalList = document.getElementById("modalListGroup");

document.addEventListener("DOMContentLoaded", function () {
  // Tüm span değerlerini dönüyo
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const retrievedSpan = Storage.getSpanFromStorage(key);

    showEventsOnDate(retrievedSpan); // günlerin içerisinde eventsleri gösteriyo
  }
  userInteractionOccurred(); // her tıklamada çalışan fonksiyon
});

function showEventsOnDate(spanData) {
  const eventId = `eventDiv_${spanData.date}`;
  const eventDiv = document.getElementById(eventId);

  if (!eventDiv) {
    // console.error(`Event div with ID ${eventId} not found.`); // consolda hata görünmesin diye yorum yaptım.
    return;
  }

  const events = spanData.events || [];

  events.forEach((event, index) => {
    const spanId = `span_${spanData.date}_${index}`;
    const spanElement = document.createElement("span");
    spanElement.id = spanId;
    spanElement.classList.add("badge", "badge-success", "bg-success");
    spanElement.textContent = `${event[0]} - ${event[1]}`; // event0 time veriyo event1 ise input değeri
    var br = document.createElement("br");

    eventDiv.appendChild(spanElement);
    eventDiv.appendChild(br);
  });
}

function manipulate() {
  let dayone = new Date(year, month, 1).getDay();
  dayone = dayone === 0 ? 6 : dayone - 1;

  let lastdate = new Date(year, month + 1, 0).getDate();

  let dayend = new Date(year, month, lastdate).getDay();
  dayend = dayend === 0 ? 6 : dayend - 1;

  let monthlastdate = new Date(year, month, 0).getDate();

  let lit = "";
  for (let i = dayone; i > 0; i--) {
    const prevMonthDate = monthlastdate - i + 1;

    lit += `<li class="inactive list-group-item border-0" id="${year}_${month}_${prevMonthDate}">
            <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-light m-2 p-0 border" style="height: 15vh; width: 25vh;">
                <h5>${prevMonthDate}</h5>
                <br />
                <div class="gap-4" id="eventDiv_${year}_${month}_${prevMonthDate}" ></div>
            </button>
        </li>`;
  }

  for (let i = 1; i <= lastdate; i++) {
    const currentDate = i;
    let isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? "active"
        : "";

    lit += `<li class="list-group-item border-0" id="${year}_${
      month + 1
    }_${currentDate}">
    <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="${isToday} btn btn-light m-2 p-0 border" style="height: 15vh; width: 25vh;">
        <h5>${currentDate}</h5>
        <br />
        <div class="gap-4" id="eventDiv_${year}_${
      month + 1
    }_${currentDate}" ></div>
    </button>
</li>`;
  }

  for (let i = dayend; i < 6; i++) {
    const nextMonthDate = i - dayend + 1;
    lit += `<li class="inactive list-group-item border-0" id="${year}_${
      month + 2
    }_${nextMonthDate}">
                <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-light m-2 p-0 border" style="height: 15vh; width: 25vh;">
                    <h5>${nextMonthDate}</h5>
                    <br />
                    <div class="gap-4" id="eventDiv_${year}_${
      month + 2
    }_${nextMonthDate}" ></div>
                </button>
            </li>`;
  }

  day.innerHTML = lit;
  currdate.innerText = `${months[month]} ${year}`;
}

let lastClickedListId = null; // Son tıklanan liste öğesinin ID'sini tutacak değişken
function second() {
  return new Promise((resolve, reject) => {
    const lists = document.querySelectorAll(".calendar-dates li");
    lists.forEach((dayElement, index) => {
      // HER BİR GÜN İÇERİSİNDE DÖNÜYOR.
      dayElement.addEventListener("click", () => {
        let now = new Date();
        let hour = String(now.getHours());
        let minute = now.getMinutes().toString();

        if (minute.length === 1) {
          minute = "0" + minute;
        }
        if (hour.length === 1) {
          hour = "0" + hour;
        }


        document.getElementById("eventTime").value = `${hour}:${minute}`;





        currentDay = index + 1;
        const idParts = dayElement.id.split("_");
        const dayId = idParts[2];
        const monthId = idParts[1];
        const yearId = idParts[0];
        const listId = `${yearId}_${monthId}_${dayId}`;

        lastClickedListId = listId;
        showModalContent(listId);
      });
    });
  });
}

function showModalContent(listId) {
  const targetList = document.getElementById(`eventDiv_${listId}`);
  const events = targetList.querySelectorAll(".badge"); // Liste içindeki tüm eventler
  modalList.innerHTML = "";

  if (events.length > 0) {
    // Eğer etkinlik varsa, modal içeriğini güncelle
    events.forEach((event, index) => {
      const eventTime = event.textContent;
      const listItem = createEventListItem(
        eventTime.slice(0, 7), // 08:00 -
        eventTime.slice(8), // inputun içiydi
        listId,
        index
      );
      modalList.appendChild(listItem); // Modal içeriğine etkinlikleri ekle
    });
  } else {
    // Eğer etkinlik yoksa, modal içeriği boş olur ya da istediğimizi yazdırabiliriz.
  }




}

function createEventListItem(eventTime, inputValue, listId, index) {
  const spanId = `span_${listId}_${index}`; // Her span için sıralı bir şekilde artan id değerleri oluştur 0dan başlıyor!

  const listItem = document.createElement("li");
  listItem.classList.add(
    "list-group-item",
    "border-0",
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "m-1"
  );
  listItem.style.backgroundColor = "rgb(219, 219, 219)";
  listItem.id = listId;
  listItem.innerHTML = `
        <label class="m-2">${eventTime}</label>
        <input maxlength="10" disabled class="form-control m-2 col" value="${inputValue}">
        <div class="buttonList col">
            <button class="btn btn-danger" onclick="deleteEvent(this, '${spanId}')">delete</button>
            <button class="btn btn-info" onclick="editEvent(this, '${spanId}')">edit</button>
        </div>
    `;

  return listItem;
}

function modalSubmitted() {
  if (!lastClickedListId) return;
  const inputValue = modalInput.value;

  if (inputValue.length === 0) return;

  const eventTime = document.getElementById("eventTime").value;


  const targetList = document
    .getElementById(lastClickedListId)
    .querySelector(".gap-4");

  const spanId = `span_${lastClickedListId}_${targetList.children.length / 2}`;

  targetList.innerHTML += `<span id="${spanId}" class="badge badge-success bg-success">${eventTime} - ${inputValue}</span><br />`;

  const listItem = createEventListItem(
    eventTime,
    inputValue,
    lastClickedListId
  );
  modalList.appendChild(listItem);

  // Verileri storageye kaydetme işlemi
  const date = lastClickedListId.split("_").slice(0, 3).join("_");
  const time = eventTime; 
  Storage.saveSpanToStorage(lastClickedListId, date, [time, inputValue]); // Yeni eklenen eventi storageye gönder

  checkEventTime(spanId, time);

  modalInput.value = "";
  modalClose.click();
}

function deleteEvent(button, spanId) {
  const listItem = button.closest(".list-group-item"); // modaldaki event liste ögesi
  const listId = listItem.id; // Öğenin ID'sini al
  listItem.remove(); // Öğeyi sil

  // Silinen etkinliğin span ve brsini de sil
  const spanElement = document.getElementById(spanId); // gün içerisindeki badge
  const brElement = spanElement.nextElementSibling; // Bir sonraki br öğesini al

  if (spanElement) {
    spanElement.remove();
  }

  if (brElement && brElement.tagName.toLowerCase() === "br") {
    brElement.remove();
  }

  oldTime = listItem.firstElementChild.textContent.slice(0, 5); // 18:04
  oldValue = listItem.children[1].value; // input valuesi

  // STORAGEDEN SİLME İŞLEMİ
  Storage.deleteEventFromStorage(spanId, [oldTime, oldValue]);
}

function editEvent(button, spanId) {
  const listItem = button.closest(".list-group-item"); // Modaldaki event liste ögesi
  const inputElement = listItem.querySelector("input");
  const editButton = button;

  oldTime = listItem.firstElementChild.textContent.slice(0, 5); // 18:30

  // Inputu enabled yapıyoruz ve edit butonunu save butonuna dönüştürüyoruz.
  inputElement.disabled = false;
  editButton.textContent = "Save";
  editButton.classList.remove("btn-info");
  editButton.classList.add("btn-success");

  // Save butonuna click eventi ekle
  editButton.removeEventListener("click", editEvent);
  editButton.addEventListener("click", function () {
    saveEvent(this, spanId);
  });
}

function saveEvent(button, spanId) {
  const spanElement = document.getElementById(spanId); // Span element (badge)

  if (spanElement) {
    const listItem = button.closest(".list-group-item");
    const inputElement = listItem.querySelector("input");
    const inputValue = inputElement.value; // yeni Input değeri
    const eventTime = spanElement.textContent.split(" - ")[0]; // 01:56

    // Span (badge) içeriğini güncelle
    spanElement.textContent = `${eventTime} - ${inputValue}`;

    inputElement.disabled = true;

    // Save butonunu edit butonuna dönüştür
    const editButton = button;
    editButton.textContent = "Edit";
    editButton.classList.remove("btn-success");
    editButton.classList.add("btn-info");

    const key = spanId.split("_").slice(1, 4).join("_");
    index = spanId.split("_")[4];
    eventDiv = document.getElementById(`eventDiv_${listItem.id}`);
    userInteractionOccurred()


    // Değişiklikleri Storage'de de güncelle
    Storage.saveEventToStorage(key, index, [oldTime, inputValue]);
  } else {
    console.error(`Span element with ID ${spanId} not found.`);
  }
}

let alertedEvents = []; // daha önceden alert olarak gösterilenler
let isOpen = true;

function checkEventTime(spanId, eventTime) {
  const spanContent = document.getElementById(spanId).innerText;

  if (alertedEvents.includes(spanContent)) {
    alertedEvents = [];
    const alertList = document.getElementById("alertList");
    alertList.innerHTML = "";
  }

  const year = spanId.split("_")[1].toString();
  let month = spanId.split("_")[2].toString();
  let dayElem = spanId.split("_")[3].toString();

  if (month.length === 1) {
    month = `0${month}`;
  }
  if (dayElem.length === 1) {
    dayElem = `0${dayElem}`;
  }

  const span = document.getElementById(spanId);

  const eventDateTime = new Date(`${year}-${month}-${dayElem}T${eventTime}:59`);
  const currentTime = new Date();

  const timeDifference = eventDateTime.getTime() - currentTime.getTime();

  if (
    timeDifference <= 24 * 60 * 60 * 1000 &&
    timeDifference >= -24 * 60 * 60 * 1000
  ) {
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const secondsDifference = Math.floor(timeDifference / 1000);

    const alertList = document.getElementById("alertList");
    alertList.parentElement.style.display = "";

    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    const alertModalDiv = document.getElementById("alertModalDiv");
    const alertModalButton = document.getElementById("alertModalButton");

    if (timeDifference <= 0) {
      listItem.style.backgroundColor = "red";
      listItem.innerText = `${span.innerText} - Expired`;
      alertModalDiv.innerHTML = `${span.innerText} - Expired`;

      
      if (isOpen) {
        alertModalButton.click();
        isOpen = false;
      }



      alertedEvents.push(spanContent);
    } else {
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));

      listItem.style.backgroundColor = "#a3cfbb";

      if (hoursDifference > 0 ){
        listItem.innerText = `${span.innerText} - Last ${hoursDifference} hours left`;
      }
      if (hoursDifference == 0 && minutesDifference > 0){
        listItem.innerText = `${span.innerText} - Last ${minutesDifference} minutes left`;
      }
      if (hoursDifference == 0 && minutesDifference == 0 && secondsDifference >= 0) {
        listItem.innerText = `${span.innerText} - Last ${secondsDifference} seconds left`;
      }
      if (hoursDifference == 0 && minutesDifference == 0 && secondsDifference == 0){
        isOpen = true;
      }
      alertedEvents.push(spanContent);
    }

    alertList.appendChild(listItem);
  }
}

function userInteractionOccurred() {
  // Her tıklamada çalışıyo ve eventleri dönüp kontrol ediyo
  let alertList = document.getElementById("alertList");
  if (alertedEvents.length > 0) {
    alertList.parentElement.style.display = "";
  } else {
    alertList.parentElement.style.display = "none";
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i); // localStorage içindeki her bir anahtar değerini alıyo
    const retrievedSpan = Storage.getSpanFromStorage(key); // Span değerini storageden çekiyo
  }

  const allSpans = document.querySelectorAll("[id^='span_']"); // Tüm spanları seçiyo ve dönüyo
  allSpans.forEach((span) => {
    const spanId = span.id;
    const eventTime = span.textContent.split(" - ")[0];

    checkEventTime(spanId, eventTime); // Her bir event için checkEventTime
  });
}

document.addEventListener("click", userInteractionOccurred);
document.addEventListener("input", userInteractionOccurred);

modalSubmit.addEventListener("click", modalSubmitted);

prenexIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());

      year = date.getFullYear();

      month = date.getMonth();
    } else {
      date = new Date();
    }

    manipulate();
    second();

    // Yeniden çağrı yapıldıktan sonra tüm span verilerini yeniden al
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const retrievedSpan = Storage.getSpanFromStorage(key);
      showEventsOnDate(retrievedSpan);
    }
  });
});





manipulate();
second();
