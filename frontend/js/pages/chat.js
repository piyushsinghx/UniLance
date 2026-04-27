import { api } from "../utils/api.js";
import { Auth } from "../utils/auth.js";
import { demoConversations, demoMessages, demoGigs } from "../utils/demo-data.js";
import {
  avatarMarkup,
  buildConversationId,
  escapeHtml,
  getQueryParam,
  timeAgo,
} from "../utils/helpers.js";
import { ThemeManager } from "../utils/theme.js";
import { SocketManager } from "../utils/socket.js";
import { renderNavbar } from "../components/navbar.js";
import { renderBottomNav } from "../components/sidebar.js";
import { Toast } from "../components/toast.js";

if (!Auth.requireAuth()) {
  throw new Error("Authentication required");
}

let conversations = [];
let activeConversation = null;
let typingTimer = null;

function normalizeMessage(message) {
  return {
    ...message,
    senderId: message.sender?._id || message.sender,
    receiverId: message.receiver?._id || message.receiver,
    text: message.text || message.content || "",
  };
}

function conversationMarkup(conversation) {
  return `
    <button class="conv-item ${activeConversation?.conversationId === conversation.conversationId ? "active" : ""}" data-conversation="${conversation.conversationId}" type="button">
      <div data-user="${escapeHtml(conversation.otherUser?._id || "")}" style="position:relative">
        ${avatarMarkup(conversation.otherUser, 48)}
        <span class="online-dot ${conversation.otherUser?.isOnline ? "online" : ""}"></span>
      </div>
      <div class="conv-item__meta">
        <div class="conv-item__top">
          <strong>${escapeHtml(conversation.otherUser?.name || "Student")}</strong>
          <span class="muted" style="font-size:0.75rem">${timeAgo(conversation.lastMessageDate)}</span>
        </div>
        <div class="muted" style="font-size:0.84rem">${escapeHtml(conversation.lastMessage || "Start the conversation")}</div>
      </div>
      ${conversation.unreadCount ? `<span class="conv-item__unread">${conversation.unreadCount}</span>` : ""}
    </button>
  `;
}

function renderConversationList() {
  const list = document.getElementById("conversationList");
  if (!list) {
    return;
  }

  if (!conversations.length) {
    list.innerHTML = '<div class="quick-list__item" style="margin:16px">No conversations yet.</div>';
    return;
  }

  list.innerHTML = conversations.map(conversationMarkup).join("");

  list.querySelectorAll("[data-conversation]").forEach((button) => {
    button.addEventListener("click", () => {
      const conversation = conversations.find((entry) => entry.conversationId === button.dataset.conversation);
      if (conversation) {
        selectConversation(conversation);
      }
    });
  });
}

function renderHeader(conversation) {
  const header = document.getElementById("chatRecipient");
  if (!header || !conversation) {
    return;
  }

  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px" data-user="${escapeHtml(conversation.otherUser?._id || "")}">
      <div style="position:relative">
        ${avatarMarkup(conversation.otherUser, 42)}
        <span class="online-dot ${conversation.otherUser?.isOnline ? "online" : ""}"></span>
      </div>
      <div>
        <strong>${escapeHtml(conversation.otherUser?.name || "Student")}</strong>
        <div class="muted" style="font-size:0.84rem">
          ${conversation.otherUser?.isOnline ? "Online now" : `Last seen ${timeAgo(conversation.otherUser?.lastSeen || conversation.lastMessageDate)}`}
        </div>
      </div>
    </div>
  `;
}

function messageMarkup(message) {
  const normalized = normalizeMessage(message);
  const me = Auth.getUserId();
  const sent = normalized.senderId === me;
  return `
    <div class="msg ${sent ? "sent" : "received"}">
      ${escapeHtml(normalized.text)}
      <span class="msg__time">${timeAgo(normalized.createdAt)}</span>
    </div>
  `;
}

function renderMessages(messages = []) {
  const container = document.getElementById("chatMessages");
  if (!container) {
    return;
  }

  if (!messages.length) {
    container.innerHTML = '<div class="quick-list__item" style="max-width:420px">No messages yet. Say hello and kick off the project.</div>';
    return;
  }

  container.innerHTML = messages.map(messageMarkup).join("");
  container.scrollTop = container.scrollHeight;
}

function appendMessage(message) {
  const container = document.getElementById("chatMessages");
  if (!container) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = messageMarkup(message);
  container.appendChild(wrapper.firstElementChild);
  container.scrollTop = container.scrollHeight;
}

async function selectConversation(conversation) {
  if (activeConversation?.conversationId) {
    SocketManager.leaveConversation(activeConversation.conversationId);
  }

  activeConversation = {
    ...conversation,
    messages: [],
  };

  renderConversationList();
  renderHeader(activeConversation);
  SocketManager.joinConversation(activeConversation.conversationId);

  try {
    const messages = await api.get(`/messages/${activeConversation.conversationId}`);
    activeConversation.messages = messages.map(normalizeMessage);
  } catch {
    activeConversation.messages = (demoMessages[activeConversation.conversationId] || []).map(normalizeMessage);
  }

  renderMessages(activeConversation.messages);
}

async function bootstrapConversationFromTarget() {
  const targetId = getQueryParam("to");
  if (!targetId) {
    return null;
  }

  const existing = conversations.find((conversation) => conversation.otherUser?._id === targetId);
  if (existing) {
    return existing;
  }

  try {
    const user = await api.get(`/users/${targetId}`);
    const conversation = {
      conversationId: buildConversationId(Auth.getUserId(), user._id),
      otherUser: user,
      lastMessage: "",
      lastMessageDate: new Date().toISOString(),
      unreadCount: 0,
    };
    conversations.unshift(conversation);
    return conversation;
  } catch {
    const seller = demoGigs.map((gig) => gig.seller).find((user) => user._id === targetId);
    if (!seller) {
      return null;
    }
    const conversation = {
      conversationId: buildConversationId(Auth.getUserId(), seller._id),
      otherUser: seller,
      lastMessage: "",
      lastMessageDate: new Date().toISOString(),
      unreadCount: 0,
    };
    conversations.unshift(conversation);
    return conversation;
  }
}

async function loadConversations() {
  try {
    conversations = await api.get("/messages/conversations");
  } catch {
    conversations = demoConversations;
  }

  const targetConversation = await bootstrapConversationFromTarget();
  renderConversationList();

  if (targetConversation) {
    await selectConversation(targetConversation);
    return;
  }

  if (conversations[0]) {
    await selectConversation(conversations[0]);
  }
}

function updateConversationPreview(message) {
  const normalized = normalizeMessage(message);
  const conversationId = message.conversationId || activeConversation?.conversationId;
  const conversation = conversations.find((entry) => entry.conversationId === conversationId);
  if (!conversation) {
    return;
  }

  conversation.lastMessage = normalized.text;
  conversation.lastMessageDate = normalized.createdAt || new Date().toISOString();
  renderConversationList();
}

function bindComposer() {
  document.getElementById("chatComposer")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!activeConversation) {
      Toast.error("Choose a conversation first.");
      return;
    }

    const input = document.getElementById("msgInput");
    const text = input.value.trim();
    if (!text) {
      return;
    }

    input.value = "";

    try {
      const message = await api.post("/messages", {
        receiverId: activeConversation.otherUser._id,
        text,
      });
      const normalized = normalizeMessage(message);
      activeConversation.messages.push(normalized);
      appendMessage(normalized);
      updateConversationPreview({ ...normalized, conversationId: activeConversation.conversationId });
      SocketManager.sendMessage({
        conversationId: activeConversation.conversationId,
        receiverId: activeConversation.otherUser._id,
        message: normalized,
      });
      SocketManager.emitTyping(activeConversation.conversationId, false);
    } catch {
      const fallbackMessage = normalizeMessage({
        _id: `demo-${Date.now()}`,
        sender: Auth.getUserId(),
        receiver: activeConversation.otherUser._id,
        text,
        createdAt: new Date().toISOString(),
      });
      activeConversation.messages.push(fallbackMessage);
      appendMessage(fallbackMessage);
      updateConversationPreview({ ...fallbackMessage, conversationId: activeConversation.conversationId });
    }
  });

  document.getElementById("msgInput")?.addEventListener("input", () => {
    if (!activeConversation) {
      return;
    }

    SocketManager.emitTyping(activeConversation.conversationId, true);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => SocketManager.emitTyping(activeConversation.conversationId, false), 1500);
  });
}

function bindSocketListeners() {
  SocketManager.on("message", (message) => {
    const conversationId = message.conversationId || buildConversationId(message.sender?._id || message.sender, message.receiver?._id || message.receiver);
    const normalized = normalizeMessage(message);

    if (activeConversation?.conversationId === conversationId) {
      activeConversation.messages.push(normalized);
      appendMessage(normalized);
    }

    updateConversationPreview({ ...normalized, conversationId });
  });

  SocketManager.on("typing", (payload) => {
    const indicator = document.getElementById("typingIndicator");
    const label = document.getElementById("typingName");
    if (!indicator || !label || !activeConversation) {
      return;
    }

    const otherUserId = activeConversation.otherUser?._id;
    const fromId = payload.userId || payload.from;
    const activeId = payload.conversationId || payload.to;
    const typing = payload.isTyping ?? true;

    if (fromId !== otherUserId && activeId !== activeConversation.conversationId) {
      return;
    }

    indicator.style.display = typing ? "flex" : "none";
    label.textContent = `${activeConversation.otherUser?.name || "Someone"} is typing...`;
  });
}

async function init() {
  ThemeManager.init();
  Toast.init();
  await Auth.hydrate();
  renderNavbar("#navbarMount", { page: "chat.html" });
  renderBottomNav("#bottomNavMount", "chat");
  await SocketManager.init();
  bindSocketListeners();
  bindComposer();
  await loadConversations();
}

init().catch((error) => {
  console.error(error);
  Toast.error("Chat failed to load.");
});
