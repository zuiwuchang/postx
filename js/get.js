document.addEventListener('alpine:init', function () {
    const serverValues = [
        {
            name: 'cloudflare server',
            id: 'cs',
        },
        {
            name: 'cloudflare tunnel',
            id: 'ct',
        },
        {
            name: 'direct server',
            id: 'ds',
        },
        {
            name: 'cloudflare worker',
            id: 'cw',
        },
        {
            name: 'streamf home',
            id: 'sh',
        },
        {
            name: 'streamf lan',
            id: 'sl',
        },
    ]
    const clientValues = [
        {
            name: 'v2rayNG',
            id: 'x',
        },
        {
            name: 'hiddify',
            id: 'h',
        },
    ]
    const ipValues = [
        {
            name: '域名',
            id: '0',
        },
        {
            name: '域名 IPv4',
            id: '7',
        },
        {
            name: '域名 IPv6',
            id: '8',
        },
        {
            name: '域名 2',
            id: '3',
        },
        {
            name: '域名 2 IPv4',
            id: '9',
        },
        {
            name: '域名 2 IPv6',
            id: '10',
        },
        {
            name: 'IPv4',
            id: '1',
        },
        {
            name: 'IPv6',
            id: '2',
        },
    ]
    const protocolValues = [
        {
            name: 'vmess',
            id: 'vmess',
        },
        {
            name: 'vless',
            id: 'vless',
        },
    ]
    const networkValues = [
        {
            name: 'websocket',
            id: 'ws',
        },
        {
            name: 'httpupgrade',
            id: 'httpupgrade',
        },
        {
            name: 'grpc',
            id: 'grpc',
        },
        {
            name: 'xhttp',
            id: 'xhttp',
        },
    ]
    const grpcValues = [
        {
            name: 'gun',
            id: 'gun',
        },
        {
            name: 'multi',
            id: 'multi',
        },
    ]
    const xhttpValues = [
        {
            name: 'packet-up',
            id: 'packet-up',
        },
        {
            name: 'stream-up',
            id: 'stream-up',
        },
        {
            name: 'stream-one',
            id: 'stream-one',
        },
    ]
    const alpnValues = [
        'h3',
        'h2',
        'http/1.1',
        'h3,h2,http/1.1',
        'h3,h2',
        'h2,http/1.1',
    ]
    const initValue = {
        baseurl: '',
        server: 'cs',
        client: 'x',
        ip: '0',
        protocol: 'vless',
        network: 'httpupgrade',
        grpc: 'gun',
        xhttp: 'packet-up',
        ed: false,
        alpn: 'h2,http/1.1',
    }
    try {
        let s = localStorage.getItem('postx')
        if (s) {
            if (s.startsWith("http")) {
                initValue.baseurl = s
            } else {
                const o = JSON.parse(s)
                initValue.baseurl = o.baseurl
                let v
                for (v of serverValues) {
                    if (v.id == o.server) {
                        initValue.server = o.server
                        break
                    }
                }
                for (v of clientValues) {
                    if (v.id == o.client) {
                        initValue.client = o.client
                        break
                    }
                }
                for (v of ipValues) {
                    if (v.id == o.ip) {
                        initValue.ip = o.ip
                        break
                    }
                }
                for (v of protocolValues) {
                    if (v.id == o.protocol) {
                        initValue.protocol = o.protocol
                        break
                    }
                }
                for (v of networkValues) {
                    if (v.id == o.network) {
                        initValue.network = o.network
                        break
                    }
                }
                for (v of grpcValues) {
                    if (v.id == o.grpc) {
                        initValue.grpc = o.grpc
                        break
                    }
                }
                for (v of xhttpValues) {
                    if (v.id == o.xhttp) {
                        initValue.xhttp = o.xhttp
                        break
                    }
                }
                for (v of alpnValues) {
                    if (v == o.alpn) {
                        initValue.alpn = o.alpn
                        break
                    }
                }
                initValue.ed = o.ed ? true : false
            }
        } else {
            s = localStorage.getItem('baseurl')
            if (s && s.startsWith("http")) {
                initValue.baseurl = s
            }
        }
    } catch (e) {
        console.warn(e)
    }
    function init() {
        this.$nextTick(() => {
            this.value = this.initValue
        })
    }
    function create(o) {
        o.value = undefined
        o.init = init
        return o
    }
    try {
        new ClipboardJS('#copy')
    } catch (e) {
        console.warn(e)
    }
    Alpine.data('form', function () {
        return {
            baseurl: create({
                initValue: initValue.baseurl,
                err: null,
                first: true,
                verify(v) {
                    if (this.first) {
                        this.first = false
                        return
                    }
                    this.err = null
                    try {
                        if (!v.startsWith("http://") && !v.startsWith("https://")) {
                            throw new Error("請輸入有效的訂閱地址")
                        }
                        return new URL(v)
                    } catch (e) {
                        this.err = e
                        return false
                    }
                },
            }),
            server: create({
                initValue: initValue.server,
                values: serverValues,
                get comment() {
                    switch (this.value) {
                        case 'ds':
                        case 'cw':
                        case 'ct':
                            return "server.html#" + this.value
                        case 'sh':
                        case 'sl':
                            return "server.html#streamf"
                        default:
                            return "server.html#server"
                    }
                },
            }),
            client: create({
                initValue: initValue.client,
                values: clientValues,
            }),
            ip: create({
                initValue: initValue.ip,
                values: ipValues,
                get comment() {
                    switch (this.value) {
                        case '1':
                        case '2':
                            return "cdn.html#fastip"
                        case '0':
                        case '3':
                            return "cdn.html#fastname"
                        default:
                            return "cdn.html#nameip"
                    }
                },
            }),
            protocol: create({
                initValue: initValue.protocol,
                values: protocolValues,
                get comment() {
                    return "v2ray.html#" + this.value
                },
            }),
            network: create({
                initValue: initValue.network,
                values: networkValues,
                get comment() {
                    switch (this.value) {
                        case 'ws':
                        case 'httpupgrade':
                            return 'ws.html#' + this.value
                        case 'grpc':
                            return "grpc.html#grpc"
                        default:
                            return 'xray.html#xhttp'
                    }
                },
            }),
            grpc: create({
                initValue: initValue.grpc,
                values: grpcValues,
                get comment() {
                    return 'grpc.html#' + this.value
                },
            }),
            get hasGRPC() {
                return this.network.value == 'grpc'
            },
            xhttp: create({
                initValue: initValue.xhttp,
                values: xhttpValues,
                get comment() {
                    return 'xray.html#' + this.value
                },
            }),
            get hasXHTTP() {
                return this.network.value == 'xhttp'
            },
            ed: create({
                initValue: initValue.ed,
            }),
            get hasED() {
                if (this.client.value == 'h') {
                    return false
                }
                switch (this.network.value) {
                    case 'ws':
                    case 'httpupgrade':
                        return true
                }
                return false
            },
            alpn: create({
                initValue: initValue.alpn,
                values: alpnValues,
            }),
            get hasAlpn() {
                switch (this.network.value) {
                    case 'xhttp':
                        return true
                }
                return false
            },
            save() {
                try {
                    localStorage.setItem('postx', JSON.stringify({
                        baseurl: this.baseurl.value,
                        server: this.server.value,
                        client: this.client.value,
                        ip: this.ip.value,
                        protocol: this.protocol.value,
                        network: this.network.value,

                        grpc: this.grpc.value,
                        xhttp: this.xhttp.value,
                        alpn: this.alpn.value,
                        ed: this.ed.value,
                    }))
                } catch (e) {
                    console.warn(e)
                }
            },
            get chooseIP() {
                switch (this.server.value) {
                    case 'ds':
                    case 'sh':
                    case 'sl':
                        return false
                }
                return true
            },
            get chooseProtocol() {
                switch (this.server.value) {
                    case 'cw':

                    case 'ds':
                    case 'sh':
                    case 'sl':
                        return false
                }
                return true
            },
            ok: false,
            init() {
                this.$nextTick(() => {
                    this.ok = true
                })
            },
            url: '',
            err: null,
            submit() {
                if (this.baseurl.err) {
                    return
                }
                this.url = ''
                this.err = null
                try {
                    // const url = new URL()
                    const url = this.baseurl.verify(this.baseurl.value)
                    url.search = ''

                    const query = url.searchParams
                    const server = this.server.value
                    query.set('server', server)
                    const client = this.client.value
                    query.set('client', client)

                    switch (server) {
                        case 'cw':
                            if (this.client.value != 'h' && this.ed.value) {
                                query.set('mode', 'ed=2560')
                            }
                            query.set('ip', this.ip.value)
                        case 'ds':
                        case 'sh':
                        case 'sl':
                            this.url = url.toString()
                            this.save()
                            return
                    }
                    query.set('protocol', `${this.protocol.value}`)
                    const network = this.network.value
                    query.set('network', `${network}`)
                    let mode
                    switch (network) {
                        case 'ws':
                        case 'httpupgrade':
                            if (this.client.value != 'h' && this.ed.value) {
                                query.set('mode', 'ed=2560')
                            }
                            break
                        case 'grpc':
                            mode = this.grpc.value
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
                            if (client == "h") {
                                throw new Error(`hiddify 還未支持 xhttp 請耐心等待`);
                            }
                            mode = this.xhttp.value
                            switch (mode) {
                                case 'packet-up':
                                case 'stream-up':
                                case 'stream-one':
                                    break;
                                default:
                                    throw new Error(`請選擇有效的 xhttp mode`);
                            }
                            query.set('mode', `${mode}`)
                            query.set('alpn', this.alpn.value)
                            break;
                        default:
                            throw new Error(`請選擇有效的傳輸協議`);
                    }
                    query.set('ip', this.ip.value)
                    this.url = url.toString()
                    this.save()
                } catch (e) {
                    console.warn(e)
                    this.err = e
                }
            },
        }
    })
})
