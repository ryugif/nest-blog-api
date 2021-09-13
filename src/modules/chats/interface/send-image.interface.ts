export interface Wid {
    server: string;
    user: string;
    _serialized: string;
}

export interface Phone {
    wa_version: string;
    mcc: string;
    mnc: string;
    os_version: string;
    device_manufacturer: string;
    device_model: string;
    os_build_number: string;
}

export interface Me {
    id: string;
    ref: string;
    refTTL: number;
    wid: Wid;
    connected: boolean;
    protoVersion: number[];
    clientToken: string;
    serverToken: string;
    isResponse: string;
    battery: number;
    plugged: boolean;
    lc: string;
    lg: string;
    locales: string;
    platform: string;
    phone: Phone;
    tos: number;
    smbTos: number;
    pushname: string;
    stale: boolean;
    blockStoreAdds: boolean;
    isVoipInitialized: boolean;
}

export interface Remote {
    server: string;
    user: string;
    _serialized: string;
}

export interface To {
    fromMe: boolean;
    remote: Remote;
    id: string;
    _serialized: string;
    formattedName: string;
    isBusiness: boolean;
    isMyContact: boolean;
    pushname: string;
    isOnline?: any;
}

export interface SendImage {
    me: Me;
    to: To;
    erro: boolean;
    text: string;
    status: string;
    type: string;
    filename: string;
    mimeType: string;
}