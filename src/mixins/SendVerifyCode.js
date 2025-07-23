export default {
	data() {
		return {
			disabled: false,
			text: '验证码',
			runTime: undefined,
			captchaType: 'clickWord'
		};
	},
	methods: {
		sendCode() {
			if (this.disabled) return;
			this.disabled = true;
			let n = 60;
			this.text = '剩余'+ n + "s";
			this.runTime = setInterval(() => {
				n = n - 1;
				if (n < 0) {
					clearInterval(this.runTime);
					this.disabled = false;
					this.text = '重新获取';
					return
				}
				this.text = '剩余' + n + "s";
			}, 1000);
		}
	},
	onHide() {
		clearInterval(this.runTime);
	}
};
