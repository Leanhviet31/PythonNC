document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("chatbot-btn");
    const box = document.getElementById("chatbot-box");
    const input = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("chatbot-send");
    const messages = document.getElementById("chatbot-messages");
    const typing = document.getElementById("chatbot-typing");

    // Mở/đóng hộp chat
    button.onclick = () => {
        const isHidden = box.style.display === "none" || box.style.display === "";
        box.style.display = isHidden ? "flex" : "none";

        // Khi mở lần đầu: gửi lời chào bằng Tiếng Việt
        if (isHidden && messages.children.length === 0) {
            appendMessage("Shop", "Xin chào! 👋 Mình là trợ lý AI của cửa hàng. Mình có thể giúp gì cho bạn hôm nay?");
        }
    };

    // Hàm thêm tin nhắn
    function appendMessage(role, text) {
        let div = document.createElement("div");
        div.className = role === "Shop" ? "bot-msg" : "user-msg";
        div.innerHTML = `<b>${role}:</b> ${text}`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight; // auto scroll xuống cuối
    }

    // Hàm gửi tin nhắn (dùng chung cho nút gửi và Enter)
    async function sendMessage() {
        let userMessage = input.value.trim();
        if (!userMessage) return;

        appendMessage("Bạn", userMessage);
        input.value = "";

        // Hiệu ứng bot đang gõ...
        if (typing) typing.style.display = "block";

        try {
            let res = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });
            let data = await res.json();

            if (typing) typing.style.display = "none";
            appendMessage("Shop", data.reply);
        } catch (err) {
            if (typing) typing.style.display = "none";
            appendMessage("Shop", "Xin lỗi, hệ thống AI đang bận. Bạn vui lòng thử lại sau nhé.");
            console.error(err);
        }
    }

    // Nhấn nút gửi
    sendBtn.onclick = sendMessage;

    // Nhấn Enter trong input
    input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") sendMessage();
    });
});