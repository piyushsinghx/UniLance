import { Auth } from "./auth.js";
import { NotificationManager } from "./helpers.js";
import { Toast } from "../components/toast.js";

const listeners = {
  orderUpdate: new Set(),
  message: new Set(),
  typing: new Set(),
  onlineUsers: new Set(),
};

function emitLocal(type, payload) {
  listeners[type]?.forEach((handler) => handler(payload));
}

function refreshOnlineState(ids = []) {
  const set = new Set(ids.map(String));
  SocketManager.onlineUsers = set;
  document.querySelectorAll("[data-user]").forEach((node) => {
    const userId = node.getAttribute("data-user");
    const dot = node.querySelector(".online-dot");
    if (!dot) {
      return;
    }
    dot.classList.toggle("online", set.has(String(userId)));
  });
  emitLocal("onlineUsers", set);
}

export const SocketManager = {
  socket: null,
  initialized: false,
  onlineUsers: new Set(),

  async init(token = Auth.getToken()) {
    if (!token) {
      return null;
    }

    if (this.socket) {
      return this.socket;
    }

    const { io } = await import("https://cdn.jsdelivr.net/npm/socket.io-client@4.7.5/+esm");
    const userId = Auth.getUserId();

    this.socket = io("http://localhost:5000", {
      auth: { token },
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      if (userId) {
        this.socket.emit("addUser", userId);
      }
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("newNotification", (notification) => {
      NotificationManager.push(notification);
    });

    this.socket.on("new_order", (data) => {
      NotificationManager.push({
        type: "order",
        title: "New Order!",
        body: `${data.buyer} ordered "${data.gigTitle}"`,
        icon: "📦",
      });
    });

    this.socket.on("order_status_update", (data) => {
      Toast.info(`Order #${data.orderId} status: ${data.status}`);
      emitLocal("orderUpdate", data);
    });

    this.socket.on("orderStatusUpdate", (data) => {
      Toast.info(`Order update: ${data.status}`);
      emitLocal("orderUpdate", data);
    });

    this.socket.on("receiveMessage", (message) => {
      emitLocal("message", message);
    });

    this.socket.on("new_message", (message) => {
      emitLocal("message", message);
    });

    this.socket.on("newMessageNotification", (payload) => {
      NotificationManager.push({
        type: "message",
        title: "New message",
        body: payload?.message?.text || "You have a new message.",
        icon: "💬",
      });
    });

    this.socket.on("typing", (payload) => {
      emitLocal("typing", payload);
    });

    this.socket.on("userTyping", (payload) => {
      emitLocal("typing", payload);
    });

    this.socket.on("getOnlineUsers", (ids) => {
      refreshOnlineState(ids);
    });

    this.socket.on("user_online", ({ userId: onlineId }) => {
      const next = new Set(this.onlineUsers);
      next.add(String(onlineId));
      refreshOnlineState([...next]);
    });

    this.socket.on("user_offline", ({ userId: offlineId }) => {
      const next = new Set(this.onlineUsers);
      next.delete(String(offlineId));
      refreshOnlineState([...next]);
    });

    return this.socket;
  },

  on(type, handler) {
    listeners[type]?.add(handler);
    return () => listeners[type]?.delete(handler);
  },

  joinConversation(conversationId) {
    this.socket?.emit("joinConversation", conversationId);
  },

  leaveConversation(conversationId) {
    this.socket?.emit("leaveConversation", conversationId);
  },

  sendMessage(payload) {
    this.socket?.emit("sendMessage", payload);
  },

  emitTyping(conversationId, isTyping = true) {
    this.socket?.emit("typing", {
      conversationId,
      userId: Auth.getUserId(),
      isTyping,
    });
  },
};
