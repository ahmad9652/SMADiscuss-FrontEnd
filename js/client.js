// const socket = io('http://localhost:8080');
const socket = io("http://localhost:8080", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "allow"
  }
});

const form = document.getElementById("send-message-form");

const message_input = document.getElementById("send-message-input");

const messagecontainer = document.querySelector('.ProfilepageInfo');

var audio = new Audio('ting.mp3')

const append_joined_leave_notification = (message,css_class) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(css_class);
    messageElement.classList.add('secondary-text');
    messagecontainer.append(messageElement);
    audio.play();
}
const append_message = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageElement.classList.add('message');
    messagecontainer.append(messageElement);
    if(position=='left-message'){
        audio.play();
    }

}
const name = prompt("Enter Your name to join");


socket.emit('new-user-joined',name);
socket.on('user-joined',name=>{
    append_joined_leave_notification(`${name} joined the chat`,'someone-joined-chat');
});

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = message_input.value;
    append_message(`You : ${message}`,'right-message')
    socket.emit('send',message);
    message_input.value = '';
})

socket.on('receive',data=>{
    append_message(`${data.name}: ${data.message}`,'left-message');

})

socket.on('left',name=>{
    append_joined_leave_notification(`${name}: leaves the chat`,'someone-leaves-chat');

})

