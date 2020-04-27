function buttonClick() {
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/homeworks/" + event.toElement.name);
  xhr.send();
  xhr.onload = () => {
    if (xhr.status != 200) {
      alert("Ошибка " + xhr.status + " " + xhr.statusText);
    } else {
      document.body.innerHTML = xhr.response;
      alert("Вы удалили елемент");
      window.location.href = "http://localhost:5000/homeworks";
    }
  };
}
