declare const ClipboardJS: any
class Bridge {
    private static instance_: Bridge | undefined
    static get instance(): Bridge {
        if (!Bridge.instance_) {
            Bridge.instance_ = new Bridge()
        }
        return Bridge.instance_
    }
    private no_?: boolean
    private constructor() {
        if (typeof localStorage === undefined) {
            this.no_ = true
        }
    }
    getItem(key: string): string | null {
        if (this.no_) {
            return null
        }
        return localStorage.getItem(key)
    }
    setItem(key: string, value: string) {
        if (!this.no_) {
            localStorage.setItem(key, value)
        }
    }
}

class View {

    ip = $("#ip")
    protocol = $("#protocol")
    network = $("#network")

    xhttpview = $("#xhttpview")
    xhttpmode = $("#xhttpmode")
    grpcview = $("#grpcview")
    grpcmode = $("#grpcmode")
    wsview = $("#wsview")
    wsed = $("#wsed")

    label = $("label")

    btn = $("#btn")

    node_ws = $("#node_ws")
    node_httpupgrade = $("#node_httpupgrade")
    node_grpc = $("#node_grpc")
    node_xhttp = $("#node_xhttp")

    init() {

        this.network.on('change', (v) => {
            this._hide()
        })

        this.protocol.val('vless')
        this.network.val('xhttp')
        this.xhttpmode.val('stream-one')

        let maxw = 0
        this.label.each((_, ele) => {
            const w = $(ele).width() ?? 0
            if (w > maxw) {
                maxw = w
            }
        })
        this.label.width(maxw)

        this._hide()

        const baseurl = $("#baseurl")
        baseurl.focus()

        const output = $("#output")
        let copy: any
        try {
            new ClipboardJS('#copy')
            copy = $("#copy")
        } catch (e) {
            alert(e)
        }
        try {
            const v = Bridge.instance.getItem('baseurl') ?? ''
            if (v.startsWith("http://") || v.startsWith("https://")) {
                baseurl.val(v)
            }
        } catch (e) {
            console.log(e)
        }
        this.btn.on('click', () => {
            try {
                const u = `${baseurl.val()}`
                if (!u.startsWith("http://") && !u.startsWith("https://")) {
                    throw new Error("請輸入有效的訂閱地址")
                }
                const url = new URL(u)
                url.search = ''

                const query = url.searchParams

                const protocol = this.protocol.val()
                switch (protocol) {
                    case 'vless':
                    case 'vmess':
                        break;
                    default:
                        throw new Error(`請選擇有效的數據協議`);
                }
                query.set('protocol', `${protocol}`)
                const network = this.network.val()
                query.set('network', `${network}`)
                let mode: any
                switch (network) {
                    case 'ws':
                    case 'httpupgrade':
                        if (this.wsed.is(":checked")) {
                            query.set('mode', '2560')
                        }
                        break
                    case 'grpc':
                        mode = this.grpcmode.val()
                        switch (mode) {
                            case 'gun':
                            case 'multi':
                                break;
                            default:
                                throw new Error(`請選擇有效的 grpc mode`);
                        }
                        query.set('mode', `${mode}`)
                        break
                    case 'xhttp':
                        mode = this.xhttpmode.val()
                        switch (mode) {
                            case 'packet-up':
                            case 'stream-up':
                            case 'stream-one':
                                break;
                            default:
                                throw new Error(`請選擇有效的 xhttp mode`);
                        }
                        query.set('mode', `${mode}`)
                        break;
                    default:
                        throw new Error(`請選擇有效的傳輸協議`);
                }
                query.set('ip', `${this.ip.is(":checked") ? 1 : 0}`)
                const v = url.toString()
                output.text(v)
                try {
                    Bridge.instance.setItem('baseurl', u)
                } catch (e) {
                    console.log(e)
                }
                if (copy) {
                    copy.removeClass("hide")
                }
            } catch (e) {
                console.warn(e)
                output.text(`${e}`)
            }
        })


    }
    private _hide() {
        const val = this.network.val()
        switch (val) {
            case 'ws':
                this.xhttpview.addClass('hide')
                this.grpcview.addClass('hide')
                this.wsview.removeClass('hide')

                this.node_ws.removeClass('hide')
                this.node_httpupgrade.addClass('hide')
                this.node_grpc.addClass('hide')
                this.node_xhttp.addClass('hide')
                break
            case 'httpupgrade':
                this.xhttpview.addClass('hide')
                this.grpcview.addClass('hide')
                this.wsview.removeClass('hide')

                this.node_ws.addClass('hide')
                this.node_httpupgrade.removeClass('hide')
                this.node_grpc.addClass('hide')
                this.node_xhttp.addClass('hide')
                break;
            case 'grpc':
                this.xhttpview.addClass('hide')
                this.grpcview.removeClass('hide')
                this.wsview.addClass('hide')

                this.node_ws.addClass('hide')
                this.node_httpupgrade.addClass('hide')
                this.node_grpc.removeClass('hide')
                this.node_xhttp.addClass('hide')
                break
            case 'xhttp':
                this.xhttpview.removeClass('hide')
                this.grpcview.addClass('hide')
                this.wsview.addClass('hide')

                this.node_ws.addClass('hide')
                this.node_httpupgrade.addClass('hide')
                this.node_grpc.addClass('hide')
                this.node_xhttp.removeClass('hide')
                break
            default:
                this.xhttpview.addClass('hide')
                this.grpcview.addClass('hide')
                this.wsview.addClass('hide')
                break;
        }
    }
}
$(window).on("load", () => {
    const view = new View()
    view.init()
})