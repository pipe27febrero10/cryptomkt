import OrionxBook from "./orionx-book";

export default class ResponseOrionxMarketBook{
    sell: Array<OrionxBook>
    buy: Array<OrionxBook>
    spread: number;
    mid: number;
}