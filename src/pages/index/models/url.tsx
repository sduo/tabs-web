export default interface Url {
    id: number,
    title: string,
    url: string,
    timestamp: number,
    revoked?: boolean,
    current?: boolean
}