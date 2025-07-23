import $store from "@/store";
// import {
// 	VUE_APP_WS_URL
// } from "@/utils/index.js";
const VUE_APP_WS_URL = ''
const Socket = function() {
	let url = VUE_APP_WS_URL
	this.ws = new WebSocket(wss(url));
	this.ws.onopen = this.onOpen.bind(this);
	this.ws.onerror = this.onError.bind(this);
	this.ws.onmessage = this.onMessage.bind(this);
	this.ws.onclose = this.onClose.bind(this);
};

function wss(wsSocketUrl) {
	let ishttps = document.location.protocol == 'https:';
	if (ishttps) {
		return wsSocketUrl.replace('ws:', 'wss:');
	} else {
		return wsSocketUrl.replace('wss:', 'ws:');
	}
}

Socket.prototype = {
	vm(vm) {
		this.vm = vm;
	},
	close() {
		clearInterval(this.timer);
		this.ws.close();
	},
	onOpen() {
		this.init();
		this.send({
			type: "login",
			data: $store.state.app.token
		});
		this.vm.$emit("socket_open");
	},
	init() {
		var that = this;
		this.timer = setInterval(()=> {
			that.send({
				type: "ping"
			});
		}, 10000);
	},
	send(data) {
		return this.ws.send(JSON.stringify(data));
	},
	onMessage(res) {
		const {
			type,
			data = {}
		} = JSON.parse(res.data);
		this.vm.$emit(type, data);
	},
	onClose: function() {
		clearInterval(this.timer);
	},
	onError: function(e) {
		this.vm.$emit("socket_error", e);
	}
};

Socket.prototype.constructor = Socket;

export default Socket;
