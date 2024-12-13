"use strict";
class View {
    constructor() {
        this.ip = $("#ip");
        this.protocol = $("#protocol");
        this.network = $("#network");
        this.xhttpview = $("#xhttpview");
        this.xhttpmode = $("#xhttpmode");
        this.grpcview = $("#grpcview");
        this.grpcmode = $("#grpcmode");
        this.wsview = $("#wsview");
        this.wsed = $("#wsed");
        this.label = $("label");
        this.btn = $("#btn");
        this.node_ws = $("#node_ws");
        this.node_httpupgrade = $("#node_httpupgrade");
        this.node_grpc = $("#node_grpc");
        this.node_xhttp = $("#node_xhttp");
    }
    init() {
        this.network.on('change', (v) => {
            this._hide();
        });
        this.protocol.val('vless');
        this.network.val('xhttp');
        this.xhttpmode.val('stream-one');
        let maxw = 0;
        this.label.each((_, ele) => {
            var _a;
            const w = (_a = $(ele).width()) !== null && _a !== void 0 ? _a : 0;
            if (w > maxw) {
                maxw = w;
            }
        });
        this.label.width(maxw);
        this._hide();
        const baseurl = $("#baseurl");
        baseurl.focus();
        const output = $("#output");
        const copy = $("#copy");
        new ClipboardJS('#copy');
        this.btn.on('click', () => {
            try {
                const u = `${baseurl.val()}`;
                if (!u.startsWith("http://") && !u.startsWith("https://")) {
                    throw new Error("請輸入有效的訂閱地址");
                }
                const url = new URL(u);
                url.search = '';
                const query = url.searchParams;
                const protocol = this.protocol.val();
                switch (protocol) {
                    case 'vless':
                    case 'vmess':
                        break;
                    default:
                        throw new Error(`請選擇有效的數據協議`);
                }
                query.set('protocol', `${protocol}`);
                const network = this.network.val();
                query.set('network', `${network}`);
                let mode;
                switch (network) {
                    case 'ws':
                    case 'httpupgrade':
                        if (this.wsed.is(":checked")) {
                            query.set('mode', '2560');
                        }
                        break;
                    case 'grpc':
                        mode = this.grpcmode.val();
                        switch (mode) {
                            case 'gun':
                            case 'multi':
                                break;
                            default:
                                throw new Error(`請選擇有效的 grpc mode`);
                        }
                        query.set('mode', `${mode}`);
                        break;
                    case 'xhttp':
                        mode = this.xhttpmode.val();
                        switch (mode) {
                            case 'packet-up':
                            case 'stream-up':
                            case 'stream-one':
                                break;
                            default:
                                throw new Error(`請選擇有效的 xhttp mode`);
                        }
                        query.set('mode', `${mode}`);
                        break;
                    default:
                        throw new Error(`請選擇有效的傳輸協議`);
                }
                query.set('ip', `${this.ip.is(":checked") ? 1 : 0}`);
                const v = url.toString();
                output.text(v);
                copy.removeClass("hide");
            }
            catch (e) {
                console.warn(e);
                output.text(`${e}`);
            }
        });
    }
    _hide() {
        const val = this.network.val();
        switch (val) {
            case 'ws':
                this.xhttpview.addClass('hide');
                this.grpcview.addClass('hide');
                this.wsview.removeClass('hide');
                this.node_ws.removeClass('hide');
                this.node_httpupgrade.addClass('hide');
                this.node_grpc.addClass('hide');
                this.node_xhttp.addClass('hide');
                break;
            case 'httpupgrade':
                this.xhttpview.addClass('hide');
                this.grpcview.addClass('hide');
                this.wsview.removeClass('hide');
                this.node_ws.addClass('hide');
                this.node_httpupgrade.removeClass('hide');
                this.node_grpc.addClass('hide');
                this.node_xhttp.addClass('hide');
                break;
            case 'grpc':
                this.xhttpview.addClass('hide');
                this.grpcview.removeClass('hide');
                this.wsview.addClass('hide');
                this.node_ws.addClass('hide');
                this.node_httpupgrade.addClass('hide');
                this.node_grpc.removeClass('hide');
                this.node_xhttp.addClass('hide');
                break;
            case 'xhttp':
                this.xhttpview.removeClass('hide');
                this.grpcview.addClass('hide');
                this.wsview.addClass('hide');
                this.node_ws.addClass('hide');
                this.node_httpupgrade.addClass('hide');
                this.node_grpc.addClass('hide');
                this.node_xhttp.removeClass('hide');
                break;
            default:
                this.xhttpview.addClass('hide');
                this.grpcview.addClass('hide');
                this.wsview.addClass('hide');
                break;
        }
    }
}
$(window).on("load", () => {
    const view = new View();
    view.init();
});
